const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // create users
  const passwordHash = await bcrypt.hash('password123', 10)
  const defaultPassword = 'password123'

  // Create sample donor
  const donor = await prisma.user.upsert({
    where: { email: 'donor@example.com' },
    update: {},
    create: { email: 'donor@example.com', name: 'Sample Donor', password: passwordHash, role: 'DONOR' },
  })

  // Create multiple NGOs with credentials
  const ngosData = [
    {
      name: 'Green Earth Community',
      email: 'greenearth@ngo.org',
      contactName: 'John Smith',
      verified: true,
    },
    {
      name: 'Hope Foundation',
      email: 'hope@ngo.org',
      contactName: 'Sarah Johnson',
      verified: true,
    },
    {
      name: 'Community Care Network',
      email: 'community@ngo.org',
      contactName: 'Michael Chen',
      verified: false,
    },
    {
      name: 'Helping Hands NGO',
      email: 'helpinghands@ngo.org',
      contactName: 'Emily Rodriguez',
      verified: true,
    },
    {
      name: 'Youth Empowerment Center',
      email: 'youth@ngo.org',
      contactName: 'David Wilson',
      verified: false,
    },
  ]

  const createdNGOs = []
  for (const ngoData of ngosData) {
    // Create or update NGO user
    const ngoUser = await prisma.user.upsert({
      where: { email: ngoData.email },
      update: {},
      create: {
        email: ngoData.email,
        name: ngoData.contactName,
        password: passwordHash,
        role: 'NGO',
      },
    })

    // Create or update NGO record
    let ngo = await prisma.nGO.findFirst({ where: { userId: ngoUser.id } })
    if (!ngo) {
      ngo = await prisma.nGO.create({
        data: {
          name: ngoData.name,
          verified: ngoData.verified,
          userId: ngoUser.id,
        },
      })
    } else {
      // Update if exists
      ngo = await prisma.nGO.update({
        where: { id: ngo.id },
        data: {
          name: ngoData.name,
          verified: ngoData.verified,
          userId: ngoUser.id,
        },
      })
    }

    createdNGOs.push(ngo)
  }

  // Create some sample tasks for NGOs
  if (createdNGOs.length > 0) {
    const tasksData = [
      {
        title: 'Food Distribution Drive',
        ngoId: createdNGOs[0].id,
        status: 'upcoming',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '10:00 AM',
        location: 'Community Center, Main Street',
      },
      {
        title: 'Clothing Donation Pickup',
        ngoId: createdNGOs[1].id,
        status: 'upcoming',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '2:00 PM',
        location: 'Warehouse District, Block 5',
      },
      {
        title: 'School Supply Distribution',
        ngoId: createdNGOs[0].id,
        status: 'upcoming',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: '9:00 AM',
        location: 'Local School, Park Avenue',
      },
      {
        title: 'Medical Supplies Delivery',
        ngoId: createdNGOs[3].id,
        status: 'upcoming',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '11:00 AM',
        location: 'Health Center, Oak Street',
      },
    ]

    for (const taskData of tasksData) {
      try {
        await prisma.task.create({ data: taskData })
      } catch (err) {
        // Skip if task already exists
        if (!err.message.includes('Unique constraint')) {
          console.error('Error creating task:', err)
        }
      }
    }
  }

  // Create donations
  if (createdNGOs.length > 0) {
    const donationsData = [
      { title: 'Winter Clothing Bundle', items: 12, status: 'delivered', ngoName: createdNGOs[0].name, donorId: donor.id, ngoId: createdNGOs[0].id },
      { title: 'Educational Books', items: 45, status: 'in-transit', ngoName: createdNGOs[1].name, donorId: donor.id, ngoId: createdNGOs[1].id },
      { title: 'Kitchen Equipment', items: 8, status: 'claimed', ngoName: createdNGOs[0].name, donorId: donor.id, ngoId: createdNGOs[0].id },
    ]

    for (const donationData of donationsData) {
      try {
        await prisma.donation.create({ data: donationData })
      } catch (err) {
        // Skip if donation already exists
        if (!err.message.includes('Unique constraint')) {
          console.error('Error creating donation:', err)
        }
      }
    }
  }

  console.log('\n✅ Seeded NGOs with login credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  ngosData.forEach((ngo, idx) => {
    console.log(`${idx + 1}. ${ngo.name}`)
    console.log(`   Email: ${ngo.email}`)
    console.log(`   Password: ${defaultPassword}`)
    console.log(`   Status: ${ngo.verified ? '✓ Verified' : '⚠ Pending Verification'}`)
    console.log('')
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n✅ Seeded sample donor, NGOs, tasks, and donations')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
