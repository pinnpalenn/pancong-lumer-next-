import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '123',
    },
  })

  const products = [
    { name: 'Coklat Keju Lumer', price: 15000 },
    { name: 'Coklat Oreo Crunch', price: 16000 },
    { name: 'Tiramisu Keju', price: 17000 },
    { name: 'Red Velvet Cream', price: 18000 },
    { name: 'Green Tea Matcha', price: 17000 },
    { name: 'Durian Lumer', price: 20000 },
    { name: 'Choco Crunchy', price: 15000 },
    { name: 'Mix 2 Rasa', price: 18000 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        price: p.price,
        isAvailable: true,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  