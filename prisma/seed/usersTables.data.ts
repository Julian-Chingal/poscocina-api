/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Prisma } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adminInfo = {
  name: process.env.ADMIN_NAME || 'Administrador',
  email: process.env.ADMIN_EMAIL || 'prueba@test.com',
  password: process.env.ADMIN_PASSWORD || 'Admin2024!',
  role: 'ADMIN',
};

// Usuarios Iniciales
interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const USER: UserData = {
  name: adminInfo.name,
  email: adminInfo.email,
  password: adminInfo.password,
  role: adminInfo.role,
};

export async function seedUsers(
  tx: Prisma.TransactionClient,
  roleMap: Record<string, string>,
) {
  const roleId: string | undefined = roleMap[USER.role];
  const saltRounds = 10;
  if (!roleId) {
    throw new Error(`Role ${USER.role} not found in roleMap`);
  }

  const passwordHash = await bcrypt.hash(USER.password, saltRounds);

  await tx.user.upsert({
    where: { email: USER.email },
    update: {
      name: USER.name,
      roleId,
      isActive: true,
    },
    create: {
      email: USER.email,
      name: USER.name,
      passwordHash,
      roleId,
      isActive: true,
    },
  });
}

// Tables
interface TableData {
  number: number;
  zone: string;
  capacity: number;
}

const TABLES: TableData[] = [
  // Salón principal
  { number: 1, zone: 'Salón', capacity: 2 },
  { number: 2, zone: 'Salón', capacity: 2 },
  { number: 3, zone: 'Salón', capacity: 4 },
  { number: 4, zone: 'Salón', capacity: 4 },
  { number: 5, zone: 'Salón', capacity: 4 },
  { number: 6, zone: 'Salón', capacity: 6 },
  { number: 7, zone: 'Salón', capacity: 6 },
  { number: 8, zone: 'Salón', capacity: 8 },

  // Terraza
  { number: 9, zone: 'Terraza', capacity: 2 },
  { number: 10, zone: 'Terraza', capacity: 2 },
  { number: 11, zone: 'Terraza', capacity: 4 },
  { number: 12, zone: 'Terraza', capacity: 4 },

  // Barra
  { number: 13, zone: 'Barra', capacity: 1 },
  { number: 14, zone: 'Barra', capacity: 1 },
  { number: 15, zone: 'Barra', capacity: 1 },
  { number: 16, zone: 'Barra', capacity: 1 },
];

export async function seedTables(tx: Prisma.TransactionClient) {
  await Promise.all(
    TABLES.map((table) =>
      tx.table.upsert({
        where: { number: table.number },
        update: { zone: table.zone, capacity: table.capacity },
        create: {
          number: table.number,
          zone: table.zone,
          capacity: table.capacity,
        },
      }),
    ),
  );
}
