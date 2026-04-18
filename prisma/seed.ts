import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear tipos de discapacidad
  const disabilities = [
    { nombre: 'Discapacidad visual', categoria: 'visual' },
    { nombre: 'Discapacidad auditiva', categoria: 'auditiva' },
    { nombre: 'Discapacidad motriz', categoria: 'motriz' },
    { nombre: 'Discapacidad intelectual', categoria: 'intelectual' },
    { nombre: 'Discapacidad psicosocial', categoria: 'psicosocial' },
    { nombre: 'Discapacidad múltiple', categoria: 'multiple' },
    { nombre: 'Sordoceguera', categoria: 'multiple' },
    { nombre: 'Trastorno del espectro autista', categoria: 'neurodivergencia' },
  ];

  for (const disability of disabilities) {
    await prisma.disability.upsert({
      where: { nombre: disability.nombre },
      update: {},
      create: disability,
    });
  }
  console.log('✅ Tipos de discapacidad creados');

  // 2. Crear superadmin
  const superadminEmail = 'admin@suma.pe';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        email: superadminEmail,
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
    console.log('✅ Superadmin creado: admin@suma.pe / admin123');
  } else {
    console.log('ℹ️ Superadmin ya existe');
  }

  console.log('🎉 Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });