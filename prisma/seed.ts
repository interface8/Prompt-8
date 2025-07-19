import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.promptType.deleteMany();

  const design = await prisma.promptType.create({
    data: {
      name: "Design",
      children: {
        create: [
          { name: "UI/UX" },
          { name: "Product Design" },
          { name: "Branding" },
        ],
      },
    },
  });

  const development = await prisma.promptType.create({
    data: {
      name: "Development",
      children: {
        create: [
          {
            name: "Frontend",
            children: {
              create: [{ name: "React" }, { name: "Next.js" }],
            },
          },
          {
            name: "Backend",
            children: {
              create: [{ name: "Node.js" }, { name: "Databases" }],
            },
          },
        ],
      },
    },
  });

  const marketing = await prisma.promptType.create({
    data: {
      name: "Marketing",
      children: {
        create: [{ name: "Content Strategy" }, { name: "SEO" }],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error("Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
