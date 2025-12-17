const DEFAULT_PASSWORD = "Password123!"

const SEED_USERS = [
  {
    name: "John Doe",
    email: "john@example.com",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
  },
]

export const runUsersSeed = async () => {
  // Dynamic import to avoid adding auth dependency to db package
  const { auth } = await import("../../../../auth/src/server.js")

  console.log("🌱 Seeding users...")

  for (const user of SEED_USERS) {
    await auth.api
      .signUpEmail({
        body: {
          name: user.name,
          email: user.email,
          password: DEFAULT_PASSWORD,
        },
      })
      .catch(() => {
        console.log(
          `  ⚠️ User ${user.email} already exists. Are you re-running the seed?`,
        )

        process.exit(1)
      })

    console.log(`  ✅ Created user: ${user.email}`)
  }

  console.log("✅ Users seed completed")
}
