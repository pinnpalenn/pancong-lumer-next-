"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  totalAmount: z.number(),
  metode_pemesanan: z.enum(["delivery", "take_away", "gofood", "grabfood"]),
  metode_pembayaran: z.enum(["tunai", "m_banking", "shopeepay"]),
  customerName: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof orderSchema>;

export async function submitOrder(data: CreateOrderInput) {
  const result = orderSchema.safeParse(data);

  if (!result.success) {
    return { success: false, message: "Data pesanan tidak valid" };
  }

  const { metode_pemesanan, metode_pembayaran, items, totalAmount, customerName } = result.data;

  if (metode_pemesanan === "gofood" || metode_pemesanan === "grabfood") {
    return {
      success: true,
      status: "redirect",
      message: `Silakan lanjutkan pemesanan melalui aplikasi ${metode_pemesanan}.`,
      link: `https://${metode_pemesanan}.link/pancong-lumer`,
    };
  }

  let orderStatus: "PENDING" | "PROCESSING" = "PENDING";
  if (metode_pembayaran === "tunai") {
    orderStatus = "PROCESSING";
  }

  const newOrder = await prisma.order.create({
    data: {
      totalAmount,
      status: orderStatus,
      paymentMethod:
        metode_pembayaran === "m_banking"
          ? "TRANSFER"
          : metode_pembayaran === "shopeepay"
          ? "QRIS"
          : "CASH",
      deliveryMethod:
        metode_pemesanan === "delivery" ? "DELIVERY" : "TAKE_AWAY",
      customerName: customerName || "Guest",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.price,
        })),
      },
    },
  });

  if (metode_pembayaran === "m_banking") {
    const virtualAccount = `008${Math.floor(Math.random() * 900000000) + 100000000}`;
    return {
      success: true,
      status: "success",
      message: "Pesanan berhasil. Silakan transfer.",
      order_id: newOrder.id,
      detail_pembayaran: {
        metode: "Virtual Account",
        bank: "BCA",
        virtual_account: virtualAccount,
        total: totalAmount,
        batas_waktu: new Date(Date.now() + 3600000).toISOString(),
      },
    };
  }

  if (metode_pembayaran === "shopeepay") {
    return {
      success: true,
      status: "success",
      message: "Scan QR Code berikut.",
      order_id: newOrder.id,
      detail_pembayaran: {
        metode: "ShopeePay",
        image: "https://placehold.co/400x400/ea580c/ffffff?text=QR+ShopeePay",
        total: totalAmount,
        batas_waktu: new Date(Date.now() + 900000).toISOString(),
      },
    };
  }

  return {
    success: true,
    status: "success",
    message: "Pesanan diterima. Mohon tunggu panggilan.",
    order_id: newOrder.id,
  };
}
