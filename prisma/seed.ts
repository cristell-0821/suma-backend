import { PrismaClient, Role, Modality, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ============================================
  // 1. CREAR TIPOS DE DISCAPACIDAD
  // ============================================
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

  // ============================================
  // 2. CREAR SUPERADMIN
  // ============================================
  const superadminEmail = 'admin@suma.pe';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        email: superadminEmail,
        password: hashedPassword,
        role: Role.SUPERADMIN,
      },
    });
    console.log('✅ Superadmin creado: admin@suma.pe / admin123');
  } else {
    adminUser = existingAdmin;
    console.log('ℹ️ Superadmin ya existe');
  }

  // ============================================
  // 3. CREAR POSTULANTE CON PERFIL COMPLETO
  // ============================================
  const postulanteEmail = 'postulante@test.com';
  const existingPostulante = await prisma.user.findUnique({
    where: { email: postulanteEmail },
  });

  let postulanteUser;
  if (!existingPostulante) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    postulanteUser = await prisma.user.create({
      data: {
        email: postulanteEmail,
        password: hashedPassword,
        role: Role.POSTULANTE,
        postulante: {
          create: {
            nombres: 'María Elena',
            apellidos: 'Rodríguez Quispe',
            telefono: '+51 987 654 321',
            fechaNacimiento: new Date('1995-03-15'),
            ciudad: 'Lima',
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Accesibilidad Web'],
            cvUrl: 'https://storage.suma.pe/cvs/maria-rodriguez.pdf',
            sobreMi: 'Soy una desarrolladora frontend apasionada por crear experiencias web accesibles e inclusivas. Tengo 3 años de experiencia construyendo interfaces con React y me especializo en WCAG y diseño universal. Busco un ambiente de trabajo que valore la diversidad y la inclusión.',
            salarioEsperado: 4500,
            linkedin: 'https://linkedin.com/in/maria-rodriguez-quispe',
            portfolio: 'https://mariarodriguez.dev',
            fotoPerfil: 'https://storage.suma.pe/perfiles/maria.jpg',
            modalidadPreferida: Modality.HIBRIDO,
            sectorPreferido: 'Tecnología',
            ciudadPreferida: 'Lima',
            disabilities: {
              connect: [
                { nombre: 'Discapacidad visual' },
                { nombre: 'Discapacidad motriz' },
              ],
            },
          },
        },
      },
      include: {
        postulante: true,
      },
    });
    console.log('✅ Postulante creado: postulante@test.com / 123456');
  } else {
    postulanteUser = await prisma.user.findUnique({
      where: { email: postulanteEmail },
      include: { postulante: true },
    });
    console.log('ℹ️ Postulante ya existe');
  }

  // ============================================
  // 4. CREAR EMPRESA CON PERFIL COMPLETO
  // ============================================
  const empresaEmail = 'empresa@test.com';
  const existingEmpresa = await prisma.user.findUnique({
    where: { email: empresaEmail },
  });

  let empresaUser;
  if (!existingEmpresa) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    empresaUser = await prisma.user.create({
      data: {
        email: empresaEmail,
        password: hashedPassword,
        role: Role.EMPRESA,
        empresa: {
          create: {
            razonSocial: 'TechInnova S.A.C.',
            ruc: '20601234567',
            sector: 'Tecnología',
            tamaño: 'mediana',
            descripcion: 'Empresa líder en desarrollo de software con un fuerte compromiso con la inclusión laboral. Contamos con políticas de diversidad y adaptaciones de puestos de trabajo para personas con discapacidad. Creemos que la diversidad impulsa la innovación.',
            sitioWeb: 'https://techinnova.pe',
            ciudad: 'Lima',
            direccion: 'Av. Javier Prado Este 4200, San Isidro',
            nombreContacto: 'Carlos Mendoza',
            cargoContacto: 'Gerente de Talento',
            telefonoContacto: '+51 1 234 5678',
            isApproved: true,
            isVerified: true,
            accommodations: ['Rampas de acceso', 'Software de lectura de pantalla', 'Horario flexible', 'Teletrabajo'],
          },
        },
      },
      include: {
        empresa: true,
      },
    });
    console.log('✅ Empresa creada: empresa@test.com / 123456');
  } else {
    empresaUser = await prisma.user.findUnique({
      where: { email: empresaEmail },
      include: { empresa: true },
    });
    console.log('ℹ️ Empresa ya existe');
  }

  // ============================================
  // 5. CREAR OFERTA DE TRABAJO
  // ============================================
  if (empresaUser?.empresa) {
    const existingJob = await prisma.jobOffer.findFirst({
      where: { empresaId: empresaUser.empresa.id },
    });

    if (!existingJob) {
      const jobOffer = await prisma.jobOffer.create({
        data: {
          empresaId: empresaUser.empresa.id,
          titulo: 'Desarrollador Frontend React (Inclusivo)',
          descripcion: 'Buscamos un desarrollador frontend con experiencia en React para unirse a nuestro equipo de producto. Ofrecemos un ambiente inclusivo con adaptaciones para personas con discapacidad visual y motriz. Trabajarás en proyectos de impacto social.',
          requisitos: [
            '2+ años de experiencia con React',
            'Conocimiento de TypeScript',
            'Experiencia con pruebas de accesibilidad (WCAG)',
            'Trabajo en equipo y comunicación efectiva',
          ],
          funciones: [
            'Desarrollar interfaces de usuario accesibles',
            'Colaborar con diseñadores UX/UI',
            'Implementar pruebas automatizadas',
            'Mentorear a desarrolladores junior',
          ],
          modalidad: Modality.HIBRIDO,
          sector: 'Tecnología',
          ciudad: 'Lima',
          salarioMin: 3500,
          salarioMax: 5500,
          isActive: true,
          expiresAt: new Date('2026-06-30'),
          disabilities: {
            connect: [
              { nombre: 'Discapacidad visual' },
              { nombre: 'Discapacidad motriz' },
            ],
          },
        },
      });
      console.log('✅ Oferta de trabajo creada:', jobOffer.titulo);

      // ============================================
      // 6. POSTULANTE APLICA A LA OFERTA
      // ============================================
      if (postulanteUser?.postulante) {
        const existingApplication = await prisma.application.findUnique({
          where: {
            postulanteId_jobOfferId: {
              postulanteId: postulanteUser.postulante.id,
              jobOfferId: jobOffer.id,
            },
          },
        });

        if (!existingApplication) {
          await prisma.application.create({
            data: {
              postulanteId: postulanteUser.postulante.id,
              jobOfferId: jobOffer.id,
              status: ApplicationStatus.ENVIADO,
              mensaje: 'Me interesa mucho esta oportunidad. Tengo experiencia en React y accesibilidad web, y creo que puedo aportar mucho al equipo.',
            },
          });
          console.log('✅ Postulación creada');
        } else {
          console.log('ℹ️ Postulación ya existe');
        }
      }
    } else {
      console.log('ℹ️ Oferta de trabajo ya existe');
    }
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });