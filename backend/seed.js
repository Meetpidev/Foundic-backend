const { PrismaClient } = require("./generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { hashPassword } = require("./src/utils/password");

// Since Prisma v7 schema doesn't have the URL, we pass it via adapter just like the main app
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_y2ine0xLZWSm@ep-spring-shape-a5gi1krg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding sample data...");

  const defaultPassword = await hashPassword("Foundic123!");

  // 1. Create a Founder
  const founder = await prisma.user.upsert({
    where: { email: "founder@foundic.io" },
    update: {},
    create: {
      email: "founder@foundic.io",
      phone: "+1234567890",
      passwordHash: defaultPassword,
      role: "FOUNDER",
      isVerified: true, // Bypass OTP
      founderProfile: {
        create: {
          fullName: "Alex Founder",
          businessHealthScore: 78,
        },
      },
    },
  });
  console.log("✅ Created Founder: founder@foundic.io");

  // 2. Create an Expert
  const expert = await prisma.user.upsert({
    where: { email: "expert@foundic.io" },
    update: {},
    create: {
      email: "expert@foundic.io",
      phone: "+1987654321",
      passwordHash: defaultPassword,
      role: "EXPERT",
      isVerified: true,
      expertProfile: {
        create: {
          fullName: "Sarah Expert",
          title: "Fractional CMO",
          status: "APPROVED",
          rating: 4.9,
          completedProjects: 12,
        },
      },
    },
  });
  console.log("✅ Created Expert: expert@foundic.io");

  // 3. Create a Company
  const company = await prisma.user.upsert({
    where: { email: "company@foundic.io" },
    update: {},
    create: {
      email: "company@foundic.io",
      phone: "+1555555555",
      passwordHash: defaultPassword,
      role: "COMPANY",
      isVerified: true,
      companyProfile: {
        create: {
          companyName: "Acme Corp",
          contactName: "John Enterprise",
          industry: "Technology",
        },
      },
    },
  });
  console.log("✅ Created Company: company@foundic.io");

  console.log("\n🎉 Seeding complete! You can now log in directly.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
