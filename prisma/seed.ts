import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@crm.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const salesEmail = process.env.SEED_SALES_EMAIL || "vendas@crm.local";
  const salesPassword = process.env.SEED_SALES_PASSWORD || "Vendas@123";

  const [adminHash, salesHash] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(salesPassword, 10),
  ]);

  const company = await prisma.company.upsert({
    where: { id: "seed-company" },
    update: {},
    create: {
      id: "seed-company",
      name: "Acme SaaS",
    },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
      companyId: company.id,
    },
  });

  await prisma.user.upsert({
    where: { email: salesEmail },
    update: {
      passwordHash: salesHash,
      role: "SALES",
    },
    create: {
      name: "Vendedor",
      email: salesEmail,
      passwordHash: salesHash,
      role: "SALES",
      companyId: company.id,
    },
  });

  const hasContacts =
    (await prisma.contact.count({ where: { companyId: company.id } })) > 0;
  if (!hasContacts) {
    const contacts = [
      {
        name: "Marina Costa",
        email: "marina@north.com",
        company: "North Trade",
        source: "LinkedIn",
      },
      {
        name: "Pedro Lima",
        email: "pedro@limalog.com",
        company: "Lima Log",
        source: "Outbound",
      },
      {
        name: "Helena Prado",
        email: "helena@pradotech.com",
        company: "Prado Tech",
        source: "Referral",
      },
    ];

    for (const contact of contacts) {
      await prisma.contact.create({
        data: { ...contact, companyId: company.id },
      });
    }
  }

  const hasDeals =
    (await prisma.deal.count({ where: { companyId: company.id } })) > 0;
  if (!hasDeals) {
    const firstContact = await prisma.contact.findFirst({
      where: { companyId: company.id },
    });

    if (firstContact) {
      await prisma.deal.createMany({
        data: [
          {
            title: "Plano Enterprise",
            value: 1800000,
            stage: "PROPOSAL",
            companyId: company.id,
            contactId: firstContact.id,
          },
          {
            title: "Migração CRM",
            value: 950000,
            stage: "NEGOTIATION",
            companyId: company.id,
          },
        ],
      });
    }
  }

  console.log(`Seed concluído. Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Seed concluído. Sales: ${salesEmail} / ${salesPassword}`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
