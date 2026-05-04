import { PrismaClient, Role, Modality, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ============================================
  // 1. CREAR DEPARTAMENTOS Y CIUDADES
  // ============================================
  const departamentosData = [
    {
      nombre: 'Lima',
      ciudades: ['Lima', 'Callao', 'San Isidro', 'Miraflores', 'Barranco', 'La Molina', 'San Borja', 'Surco', 'Comas', 'San Juan de Lurigancho'],
    },
    {
      nombre: 'Arequipa',
      ciudades: ['Arequipa', 'Cayma', 'Cerro Colorado', 'Jacobo Hunter', 'Mariano Melgar', 'Miraflores (Arequipa)', 'Paucarpata', 'Socabaya', 'Yanahuara'],
    },
    {
      nombre: 'La Libertad',
      ciudades: ['Trujillo', 'El Porvenir', 'La Esperanza', 'Laredo', 'Moche', 'Salaverry', 'Víctor Larco Herrera'],
    },
    {
      nombre: 'Cusco',
      ciudades: ['Cusco', 'San Sebastián', 'San Jerónimo', 'Wanchaq', 'Santiago'],
    },
    {
      nombre: 'Junín',
      ciudades: ['Huancayo', 'El Tambo', 'Chilca', 'San Agustín', 'San Jerónimo de Tunán'],
    },
    {
      nombre: 'Piura',
      ciudades: ['Piura', 'Castilla', 'Catacaos', 'Cura Mori', 'El Tallán', 'La Arena', 'La Unión'],
    },
    {
      nombre: 'Lambayeque',
      ciudades: ['Chiclayo', 'José Leonardo Ortiz', 'La Victoria', 'Pimentel', 'Reque', 'Santa Rosa'],
    },
    {
      nombre: 'Ancash',
      ciudades: ['Huaraz', 'Independencia', 'Jangas', 'La Libertad (Ancash)', 'Olleros', 'Paltay'],
    },
    {
      nombre: 'Ica',
      ciudades: ['Ica', 'Chincha Alta', 'Pisco', 'Palpa', 'Nazca', 'San Juan Bautista'],
    },
    {
      nombre: 'Callao',
      ciudades: ['Callao', 'Bellavista', 'Carmen de la Legua Reynoso', 'La Perla', 'La Punta', 'Ventanilla'],
    },
    {
      nombre: 'Tacna',
      ciudades: ['Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva', 'Inclán', 'Pocollay'],
    },
    {
      nombre: 'Moquegua',
      ciudades: ['Moquegua', 'Samegua', 'San Cristóbal', 'Torata'],
    },
    {
      nombre: 'Puno',
      ciudades: ['Puno', 'San Antonio', 'San Sebastián', 'Juliaca', 'Yunguyo', 'Azángaro'],
    },
    {
      nombre: 'Ayacucho',
      ciudades: ['Ayacucho', 'Carmen Alto', 'Jesús Nazareno', 'San Juan Bautista', 'Socos'],
    },
    {
      nombre: 'Huánuco',
      ciudades: ['Huánuco', 'Amarilis', 'Pillco Marca', 'Yarumayo', 'Yacus'],
    },
    {
      nombre: 'Cajamarca',
      ciudades: ['Cajamarca', 'Asunción', 'Chetilla', 'Jesús', 'La Encañada', 'Namora'],
    },
    {
      nombre: 'San Martín',
      ciudades: ['Moyobamba', 'Bellavista (San Martín)', 'Nueva Cajamarca', 'Tarapoto', 'Juanjuí'],
    },
    {
      nombre: 'Loreto',
      ciudades: ['Iquitos', 'Belén', 'Punchana', 'San Juan Bautista (Loreto)', 'Yurimaguas', 'Nauta'],
    },
    {
      nombre: 'Ucayali',
      ciudades: ['Pucallpa', 'Yarinacocha', 'Manantay', 'Callería', 'Campo Verde'],
    },
    {
      nombre: 'Madre de Dios',
      ciudades: ['Puerto Maldonado', 'Iberia', 'Tahuamanu', 'Inambari'],
    },
    {
      nombre: 'Tumbes',
      ciudades: ['Tumbes', 'Aguas Verdes', 'Corrales', 'Zarumilla', 'Zorritos'],
    },
    {
      nombre: 'Amazonas',
      ciudades: ['Chachapoyas', 'Bagua', 'Utcubamba', 'Bongará', 'Luya'],
    },
    {
      nombre: 'Huancavelica',
      ciudades: ['Huancavelica', 'Acobambilla', 'Conayca', 'Cuenca', 'Mariscal Cáceres'],
    },
    {
      nombre: 'Pasco',
      ciudades: ['Cerro de Pasco', 'Chaupimarca', 'Yanacancha', 'Tinyahuarco', 'Vicco'],
    },
    {
      nombre: 'Apurímac',
      ciudades: ['Abancay', 'Andahuaylas', 'Chalhuanca', 'Curahuasi', 'Tamburco'],
    },
  ];

  for (const dep of departamentosData) {
    await prisma.departamento.upsert({
      where: { nombre: dep.nombre },
      update: {},
      create: {
        nombre: dep.nombre,
        ciudades: {
          create: dep.ciudades.map((c) => ({ nombre: c })),
        },
      },
    });
  }
  console.log('✅ Departamentos y ciudades creados');

  // Obtener IDs para usar después
  const limaCiudad = await prisma.ciudad.findFirst({
    where: { nombre: 'Lima', departamento: { nombre: 'Lima' } },
  });
  const limaId = limaCiudad!.id;

  // ============================================
  // 2. CREAR SECTORES
  // ============================================
  const sectoresNombres = [
    'Tecnología',
    'Salud',
    'Educación',
    'Manufactura',
    'Retail',
    'Servicios',
    'Finanzas',
    'Construcción',
    'Logística',
    'Turismo',
    'Agroindustria',
    'Energía',
    'Medios',
    'Legal',
    'Ingeniería',
    'Consultoría',
    'ONG / Social',
    'Gobierno',
    'Otro',
  ];

  for (const nombre of sectoresNombres) {
    await prisma.sector.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log('✅ Sectores creados');

  const tecnologiaSector = await prisma.sector.findUnique({
    where: { nombre: 'Tecnología' },
  });
  const tecnologiaId = tecnologiaSector!.id;

  // ============================================
  // 3. CREAR TIPOS DE DISCAPACIDAD
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
  // 4. CREAR SUPERADMIN
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
  // 5. CREAR POSTULANTE CON PERFIL COMPLETO
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
            ciudad: { connect: { id: limaId } },
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Accesibilidad Web'],
            cvUrl: 'https://storage.suma.pe/cvs/maria-rodriguez.pdf',
            sobreMi: 'Soy una desarrolladora frontend apasionada por crear experiencias web accesibles e inclusivas.',
            salarioEsperado: 4500,
            linkedin: 'https://linkedin.com/in/maria-rodriguez-quispe',
            portfolio: 'https://mariarodriguez.dev',
            fotoPerfil: 'https://storage.suma.pe/perfiles/maria.jpg',
            modalidadPreferida: Modality.HIBRIDO,
            sector: { connect: { id: tecnologiaId } },
            ciudadPreferida: { connect: { id: limaId } },
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
  // 6. CREAR EMPRESA CON PERFIL COMPLETO
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
            sector: { connect: { id: tecnologiaId } },
            tamaño: 'mediana',
            descripcion: 'Empresa líder en desarrollo de software con un fuerte compromiso con la inclusión laboral.',
            sitioWeb: 'https://techinnova.pe',
            ciudad: { connect: { id: limaId } },
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
  // 7. CREAR OFERTA DE TRABAJO
  // ============================================
  if (empresaUser?.empresa) {
    const existingJob = await prisma.jobOffer.findFirst({
      where: { empresaId: empresaUser.empresa.id },
    });

    if (!existingJob) {
      const jobOffer = await prisma.jobOffer.create({
        data: {
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
          salarioMin: 3500,
          salarioMax: 5500,
          isActive: true,
          expiresAt: new Date('2026-06-30'),
          empresa: { connect: { id: empresaUser.empresa.id } },
          sector: { connect: { id: tecnologiaId } },
          ciudad: { connect: { id: limaId } },
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
      // 8. POSTULANTE APLICA A LA OFERTA
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
              mensaje: 'Me interesa mucho esta oportunidad. Tengo experiencia en React y accesibilidad web.',
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