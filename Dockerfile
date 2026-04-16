# ======================
# Stage 1: Dependencies
# ======================
FROM node:22-alpine AS deps
# Tambahkan openssl dan libc6-compat karena Prisma memerlukannya di Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies secara bersih (ci = clean install)
RUN npm ci

# ======================
# Stage 2: Builder
# ======================
FROM node:22-alpine AS builder
WORKDIR /app

# Salin node_modules dari stage deps agar tidak install ulang
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment build-time (Penting untuk Next.js)
ARG NEXT_PUBLIC_API
# Dummy URL untuk mencegah error Prisma saat build (Koneksi asli dilakukan di Stage Runner)
ARG DATABASE_URL="postgresql://bagas:sdksdk@localhost:5432/osis_voting?schema=public"

ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API

# Generate Prisma Client agar TypeScript mengenali skema Anda
RUN npx prisma generate

# Proses Build (Akan sukses karena Anda sudah pasang force-dynamic di layout)
RUN npm run build

# ======================
# Stage 3: Runner
# ======================
FROM node:22-alpine AS runner
# Tambahkan openssl di runner agar Prisma Engine bisa jalan
RUN apk add --no-cache openssl
WORKDIR /app

RUN npm install -g @prisma/config @prisma/client

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin aset publik dan static
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/public ./public
# Salin output standalone (Next.js server minimalis)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# PENTING: Salin Prisma Client yang sudah digenerate agar bisa dipakai query
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

# Jalankan migrasi database lalu nyalakan server
CMD ["sh", "-c", "echo 'URL DB adalah: '$DATABASE_URL && node server.js"]
