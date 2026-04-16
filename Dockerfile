# ======================
# Stage 1: Dependencies
# ======================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# ======================
# Stage 2: Builder
# ======================
FROM node:22-alpine AS builder
# Tambahkan openssl di sini juga karena 'prisma generate' membutuhkannya
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pastikan npx prisma generate dijalankan SEBELUM build
# Agar TypeScript bisa memvalidasi tipe data PrismaClient
RUN npx prisma generate
RUN npm run build

# ======================
# Stage 3: Runner
# ======================
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone mode dari Next.js tidak secara otomatis menyertakan folder @prisma di node_modules
# Kita harus menyalinnya secara manual ke dalam folder standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# --- BAGIAN KRUSIAL ---
# Salin generated Prisma Client ke lokasi node_modules di runner
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
# ----------------------

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]