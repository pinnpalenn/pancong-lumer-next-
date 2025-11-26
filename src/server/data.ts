import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function getProducts() {
  return await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });
}

export async function getOrdersHistory() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getDashboardStats() {
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);

  const todaysOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalSales = todaysOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount),
    0
  );

  const soldProductsCount: Record<string, number> = {};
  todaysOrders.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.product.name;
      soldProductsCount[name] = (soldProductsCount[name] || 0) + item.quantity;
    });
  });

  const allProducts = await prisma.product.findMany();

  const laku = Object.entries(soldProductsCount).map(([nama, jumlah]) => ({
    nama,
    jumlah,
  }));

  const belumLaku = allProducts
    .filter((p) => !soldProductsCount[p.name])
    .map((p) => ({ nama: p.name, jumlah: 0 }));

  return {
    date: now.toISOString().split("T")[0],
    total_sales: totalSales,
    total_orders: todaysOrders.length,
    menu_laku: laku,
    menu_belum_laku: belumLaku,
  };
}

export async function getSalesChartData() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
      status: {
        not: "CANCELLED",
      },
    },
  })

  // Grouping sales by date
  const salesByDate: Record<string, number> = {}
  
  // Initialize last 7 days with 0
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    salesByDate[dateStr] = 0
  }

  orders.forEach(order => {
    const dateStr = order.createdAt.toISOString().split("T")[0]
    if (salesByDate[dateStr] !== undefined) {
      salesByDate[dateStr] += Number(order.totalAmount)
    }
  })

  return Object.entries(salesByDate)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
