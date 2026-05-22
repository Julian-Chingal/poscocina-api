import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { seedModules, seedPermissions, seedRoles } from './Rbca.data';
import { seedUsers, seedTables } from './usersTables.data';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');
  
  await prisma.$transaction(async (tx) => {
    const moduleMap = await seedModules(tx);
    const permissionMap = await seedPermissions(tx, moduleMap);
    const roleMap = await seedRoles(tx, permissionMap);
    await seedUsers(tx, roleMap);
    await seedTables(tx);
  });

  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
