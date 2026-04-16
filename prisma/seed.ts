import bcrypt from "bcrypt";
async function main() {
  const hashedPassword = await bcrypt.hash("sdksdk", 10); // Ganti password ini
  console.log("Password:", hashedPassword);
}

main()
  .catch((e) => console.error(e))
  .finally();
