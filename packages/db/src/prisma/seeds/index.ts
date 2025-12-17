import { db } from "../../index"
import { runUsersSeed } from "./users-seed"

const main = async () => {
  console.log("🚀 Starting database seeding...")

  await runUsersSeed()

  console.log("🎉 All seeds completed successfully!")
}

main()
  .then(async () => {
    await db.$disconnect()

    process.exit(0)
  })
  .catch(async (e) => {
    await db.$disconnect()

    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
