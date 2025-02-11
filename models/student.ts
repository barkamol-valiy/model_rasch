import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allStudents = await prisma.student.findMany();
  console.log("All students:" + allStudents);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
