const DEFAULT_PASSWORD = "Password123!"

const ADMIN_USER = {
  name: "Admin",
  email: "admin@admin.com",
  role: "admin" as const,
}

const SEED_USERS = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user" as const,
  },
]

export const runUsersSeed = async () => {
  // Dynamic import to avoid adding auth dependency to db package
  const { auth } = await import("../../../../auth/src/server.js")

  console.log("🌱 Seeding users...")

  // Seed admin user first
  console.log("  👤 Creating admin user...")
  const adminResult = await auth.api
    .createUser({
      body: {
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        password: DEFAULT_PASSWORD,
        role: ADMIN_USER.role,
      },
    })
    .catch((error: Error) => {
      if (error.message?.includes("already exists")) {
        console.log(`  ⚠️ Admin ${ADMIN_USER.email} already exists, skipping`)
        return null
      }
      throw error
    })

  if (adminResult) {
    console.log(`  ✅ Created admin: ${ADMIN_USER.email}`)
  }

  // Seed regular users
  for (const user of SEED_USERS) {
    const result = await auth.api
      .createUser({
        body: {
          name: user.name,
          email: user.email,
          password: DEFAULT_PASSWORD,
          role: user.role,
        },
      })
      .catch((error: Error) => {
        if (error.message?.includes("already exists")) {
          console.log(`  ⚠️ User ${user.email} already exists, skipping`)
          return null
        }
        throw error
      })

    if (result) {
      console.log(`  ✅ Created user: ${user.email}`)
    }
  }

  console.log("✅ Users seed completed")
}
