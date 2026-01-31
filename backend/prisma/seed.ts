import { PrismaClient, UserRole, UserStatus, OfficeBearerRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Taluks
  const taluks = [
    { code: 'KKI', name: 'Kallakurichi', nameTamil: 'கள்ளக்குறிச்சி', sortOrder: 1 },
    { code: 'CHI', name: 'Chinnasalem', nameTamil: 'சின்னசேலம்', sortOrder: 2 },
    { code: 'SAN', name: 'Sankarapuram', nameTamil: 'சங்கராபுரம்', sortOrder: 3 },
    { code: 'ULP', name: 'Ulundurpet', nameTamil: 'உளுந்தூர்பேட்டை', sortOrder: 4 },
    { code: 'TKR', name: 'Thirukovilur', nameTamil: 'திருக்கோவிலூர்', sortOrder: 5 },
    { code: 'KVH', name: 'Kalvarayan Hills', nameTamil: 'கல்வராயன் மலை', sortOrder: 6 },
    { code: 'VPM', name: 'Vanapuram', nameTamil: 'வானபுரம்', sortOrder: 7 },
    { code: 'EXT', name: 'External', nameTamil: 'வெளியூர்', sortOrder: 99 },
  ];

  for (const taluk of taluks) {
    await prisma.taluk.upsert({
      where: { code: taluk.code },
      update: taluk,
      create: taluk,
    });
  }
  console.log('✅ Taluks seeded');

  // Seed Settings
  const settings = [
    { key: 'site_name', value: 'Kallakurichi District Chess Association', group: 'general', valueType: 'string', isPublic: true },
    { key: 'site_tagline', value: 'Nurturing Chess Champions', group: 'general', valueType: 'string', isPublic: true },
    { key: 'membership_fee_player', value: 75, group: 'payments', valueType: 'number', isPublic: true },
    { key: 'membership_fee_arbiter', value: 250, group: 'payments', valueType: 'number', isPublic: true },
    { key: 'contact_email', value: 'info@kallaichess.com', group: 'contact', valueType: 'string', isPublic: true },
    { key: 'contact_phone', value: '+91 9876543210', group: 'contact', valueType: 'string', isPublic: true },
    { key: 'address', value: 'Kallakurichi, Tamil Nadu, India', group: 'contact', valueType: 'string', isPublic: true },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: null },
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  // Seed Super Admin
  const adminPassword = 'Admin@123';
  const kallakurichiTaluk = await prisma.taluk.findUnique({ where: { code: 'KKI' } });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@kallaichess.com' },
    update: {
      passwordHash: adminPassword,
    },
    create: {
      email: 'admin@kallaichess.com',
      phone: '9876543210',
      passwordHash: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phoneVerified: true,
      talukId: kallakurichiTaluk?.id,
    },
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // Seed KDCA Organization (District Association)
  const kdca = await prisma.organization.upsert({
    where: { slug: 'kallakurichi-district-chess-association' },
    update: {},
    create: {
      type: 'TALUK_ASSOCIATION',
      status: 'APPROVED',
      name: 'Kallakurichi District Chess Association',
      shortName: 'KDCA',
      slug: 'kallakurichi-district-chess-association',
      description: 'Official District Chess Association of Kallakurichi, Tamil Nadu. Established in 2019 to promote and develop chess in the district.',
      talukId: kallakurichiTaluk?.id,
      email: 'info@kallaichess.com',
      phone: '9876543210',
      establishedYear: 2019,
      approvedAt: new Date(),
      createdById: superAdmin.id,
    },
  });
  console.log('✅ KDCA Organization created');

  // Seed KDCA Office Bearers (sample data)
  const officeBearers = [
    { role: OfficeBearerRole.PRESIDENT, name: 'Dr. Sample President', designation: 'President, KDCA', sortOrder: 1 },
    { role: OfficeBearerRole.SECRETARY, name: 'Mr. Sample Secretary', designation: 'Secretary, KDCA', sortOrder: 2 },
    { role: OfficeBearerRole.TREASURER, name: 'Mr. Sample Treasurer', designation: 'Treasurer, KDCA', sortOrder: 3 },
  ];

  for (const bearer of officeBearers) {
    await prisma.officeBearer.upsert({
      where: { id: `${kdca.id}-${bearer.role}` },
      update: bearer,
      create: {
        ...bearer,
        organizationId: kdca.id,
      },
    });
  }
  console.log('✅ Office Bearers seeded');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
