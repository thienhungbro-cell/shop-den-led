import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, message: "Telegram config missing" },
        { status: 500 }
      );
    }

    const message = [
      "🛒 Đơn hàng mới từ website",
      "",
      `👤 Khách hàng: ${body.customer?.name ?? "N/A"}`,
      `📱 SĐT: ${body.customer?.phone ?? "N/A"}`,
      `📍 Địa chỉ: ${body.customer?.address ?? "N/A"}`,
      `📝 Ghi chú: ${body.customer?.note ?? "Không có"}`,
      "",
      "📦 Sản phẩm:",
      ...(body.items ?? []).map((item: any) =>
        `- ${item.name} x${item.quantity} (${item.price?.toLocaleString("vi-VN")}đ)`
      ),
      "",
      `💰 Tổng tiền: ${Number(body.total ?? 0).toLocaleString("vi-VN")}đ`,
    ].join("\n");

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok || !telegramData.ok) {
      return NextResponse.json(
        { success: false, message: telegramData.description ?? "Send telegram failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Order sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
