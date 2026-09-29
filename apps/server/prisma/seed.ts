import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

/** Dữ liệu demo cho môi trường dev: 3 user (mật khẩu: password123) + 1 nhóm. */
async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await Promise.all(
    ['an', 'binh', 'chi'].map((n) =>
      prisma.user.upsert({
        where: { email: `${n}@keepay.dev` },
        update: {},
        create: { email: `${n}@keepay.dev`, passwordHash, displayName: n.toUpperCase() },
      }),
    ),
  );
  await prisma.group.create({
    data: {
      name: 'Nhóm demo',
      createdById: users[0]!.id,
      members: { create: users.map((u) => ({ userId: u.id })) },
    },
  });
  await prisma.$disconnect();
}
void main();
