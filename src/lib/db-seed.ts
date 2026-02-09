import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function ensureSeeded() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    if (!existingAdmin) {
      console.log('Seeding database...')
      
      // Import and run the seed function
      const seedModule = await import('../../prisma/seed')
      if (seedModule.main) {
        await seedModule.main()
      }
      
      console.log('Database seeded successfully')
    } else {
      console.log('Database already seeded')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}
