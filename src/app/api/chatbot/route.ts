import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "Xin chào! Hiện tại Chatbot AI đang chạy ở chế độ giả lập (Chưa cấu hình GEMINI_API_KEY trong file .env).\n\n";

      if (userMessage.includes("giá") || userMessage.includes("bao nhiêu") || userMessage.includes("sản phẩm")) {
        reply += "Bạn có thể tham khảo danh sách sản phẩm và giá cả trực tiếp trên website ở mục 'Sản phẩm' hoặc liên hệ Zalo 0359.663.118 để được báo giá chính xác nhất nhé!";
      } else if (userMessage.includes("địa chỉ") || userMessage.includes("ở đâu") || userMessage.includes("cửa hàng") || userMessage.includes("chỉ đường")) {
        reply += "Cửa hàng Xuân Lợi Store có địa chỉ tại: Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM. Mở cửa từ 8:00 đến 18:00 hàng ngày.";
      } else if (userMessage.includes("bảo hành") || userMessage.includes("đổi trả")) {
        reply += "Các dòng đèn bi cầu LED/Laser và mạch điện thông minh tại cửa hàng được bảo hành chính hãng từ 1-3 năm. Hỗ trợ đổi trả dễ dàng trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.";
      } else if (userMessage.includes("liên hệ") || userMessage.includes("sđt") || userMessage.includes("hotline") || userMessage.includes("zalo") || userMessage.includes("gọi")) {
        reply += "Anh/chị có thể gọi hotline hoặc nhắn Zalo qua số: 0359.663.118 để được tư vấn nhanh nhất ạ.";
      } else {
        reply += "Anh/chị đang quan tâm đến việc nâng cấp ánh sáng (bi cầu, trợ sáng) hay lắp đặt mạch điện thông minh cho dòng xe nào ạ? Hãy để lại tên xe và số điện thoại, em sẽ báo kỹ thuật viên liên hệ tư vấn ngay nhé!";
      }
      return NextResponse.json({ reply });
    }

    // Read product data to inject as context
    const productsFilePath = path.join(process.cwd(), "src/data/products.json");
    let productsData = "[]";
    try {
      productsData = fs.readFileSync(productsFilePath, "utf8");
    } catch (e) {
      console.error("Error reading products.json:", e);
    }

    // Parse and compress products to save tokens
    let productsList = [];
    try {
      productsList = JSON.parse(productsData).map((p: any) => ({
        name: p.name,
        brand: p.brand,
        price: p.price,
        salePrice: p.salePrice,
        description: p.description,
        specs: p.specs || {},
      }));
    } catch (e) {
      console.error("Error parsing products.json:", e);
    }

    const systemInstruction = `
Bạn là trợ lý ảo chuyên nghiệp, tận tâm của "Xuân Lợi Store" - cửa hàng nâng cấp ánh sáng, đèn xe cao cấp tại Việt Nam.

Thông tin cửa hàng:
- Địa chỉ: Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM
- Số điện thoại/Zalo: 0359.663.118
- Email: info@xuanloi-store.vn
- Giờ mở cửa: 8:00 – 18:00 hàng ngày (cả Thứ 7 và Chủ Nhật)
- Dịch vụ chính: Nâng cấp đèn LED, đèn Bi cầu LED/Laser, Đèn trợ sáng, Mạch điện thông minh (mạch tắt đèn, mạch smartkey, auto passing, mạch tắt máy tạm thời), và phụ kiện ánh sáng cho xe máy, ô tô.

Danh sách sản phẩm của cửa hàng:
${JSON.stringify(productsList, null, 2)}

Nguyên tắc trả lời:
1. Bạn phải luôn lịch sự, thân thiện, xưng hô lễ phép với khách hàng (Ví dụ: "Xuân Lợi Store xin chào anh/chị ạ...", xưng "em/Xuân Lợi Store" và gọi khách là "anh/chị").
2. Tư vấn sản phẩm phù hợp dựa trên nhu cầu của khách hàng. Hãy giới thiệu các sản phẩm có trong danh sách trên kèm theo giá (nếu giá là 0 hoặc không có thì báo khách liên hệ trực tiếp để có giá tốt nhất tùy theo dòng xe).
3. Nếu khách hỏi về dòng xe cụ thể (như Winner X, Exciter, Vision, SH...), hãy tư vấn các sản phẩm tương thích và các loại mạch chuyên dụng.
4. Ngắn gọn, súc tích, định dạng câu trả lời đẹp mắt bằng các gạch đầu dòng, tô đậm thông số quan trọng.
5. Nếu câu hỏi vượt quá chuyên môn kỹ thuật phức tạp hoặc cần đặt lịch lắp đặt tại cửa hàng Thủ Đức, hãy khuyên khách hàng để lại số điện thoại để nhân viên kỹ thuật gọi lại tư vấn, hoặc nhắn Zalo/gọi hotline: 0359.663.118.
6. Tuyệt đối không bịa đặt sản phẩm không có trong danh sách sản phẩm của shop.
`;

    // Map messages to Gemini API format
    // Gemini roles: 'user' and 'model'
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Call Gemini API using native fetch
    // Using gemini-2.5-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API error details:", errData);
      return NextResponse.json(
        { error: errData.error?.message || "Lỗi kết nối với AI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Em chưa hiểu ý anh/chị lắm. Anh/chị có thể nói rõ hơn được không ạ?";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Error in chatbot route:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 }
    );
  }
}
