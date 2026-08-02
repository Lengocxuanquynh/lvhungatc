import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderCompletedEmail(
  toEmail: string,
  customerName: string,
  orderId: string,
  products: { title: string; downloadUrl: string | null }[]
) {
  const mailOptions = {
    from: `"LVHUNGATC" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `[LVHUNGATC] Đơn hàng #${orderId} đã được xác nhận - Link tải sản phẩm`,
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Cảm ơn bạn đã mua hàng tại LVHUNGATC!</h2>
        <p>Xin chào <strong>${customerName}</strong>,</p>
        <p>Đơn hàng <strong>#${orderId}</strong> của bạn đã được thanh toán thành công. Dưới đây là danh sách sản phẩm và link tải (Google Drive) dành cho bạn:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 12px; border: 1px solid #e2e8f0;">Sản phẩm</th>
              <th style="padding: 12px; border: 1px solid #e2e8f0; width: 120px; text-align: center;">Link Tải</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p) => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${p.title}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  ${
                    p.downloadUrl
                      ? `<a href="${p.downloadUrl}" style="background-color: #2563eb; color: #fff; padding: 8px 12px; text-decoration: none; border-radius: 4px; font-size: 14px; display: inline-block;">Tải xuống</a>`
                      : `<span style="color: #64748b; font-size: 14px;">Đang cập nhật</span>`
                  }
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <p style="margin-top: 30px;">Nếu bạn gặp bất kỳ vấn đề gì trong quá trình tải xuống hoặc sử dụng sản phẩm, đừng ngần ngại liên hệ lại với chúng tôi bằng cách trả lời email này.</p>
        <br />
        <p>Trân trọng,<br /><strong>Đội ngũ LVHUNGATC</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${toEmail} for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
