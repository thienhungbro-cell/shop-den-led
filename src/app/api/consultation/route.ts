import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, interest, note } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Số điện thoại là bắt buộc" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // In case Telegram config is missing (e.g. local development), mock success
    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured. Lead data received:", body);
      return NextResponse.json({
        success: true,
        message: "Gửi yêu cầu thành công (Chế độ phát triển: Chưa cấu hình Telegram)",
      });
    }

    const message = [
      "🔔 <b>Yêu cầu tư vấn mới từ website</b>",
      "",
      `👤 <b>Khách hàng:</b> ${name || "Chưa cung cấp"}`,
      `📱 <b>Số điện thoại:</b> <code>${phone}</code>`,
      `💡 <b>Dịch vụ quan tâm:</b> ${interest || "Chưa chọn"}`,
      `📝 <b>Lời nhắn:</b> ${note || "Không có"}`,
      "",
      `⏱️ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
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
        { success: false, message: telegramData.description ?? "Send Telegram failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Yêu cầu tư vấn đã được gửi thành công" });
  } catch (error) {
    console.error("Error sending consultation:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi hệ thống" },
      { status: 500 }
    );
  }
}
