const sgMail = require("@sendgrid/mail");

module.exports = async function (context, req) {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
    return;
  }

  // 兼容 rawBody
  let body = req.body;
  if (!body && req.rawBody) {
    try {
      body = JSON.parse(req.rawBody);
    } catch (e) {
      context.log("Failed to parse rawBody", e);
    }
  }

  const { name, email, phone, message } = body || {};

  context.log("Enquiry received", { name, email, phone });

  if (!name || !email || !message) {
    context.res = {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: false, error: "Missing required fields" },
    };
    return;
  }

  // 从环境变量读取 SendGrid 配置
  const apiKey = process.env.SENDGRID_API_KEY;
  const toEmail = process.env.EMAIL_TO || "info@scse.com.au"; // 收件人
  const fromEmail = process.env.EMAIL_FROM || "no-reply@scse.com.au"; // 发件人（需要在 SendGrid 里验证）

  if (!apiKey) {
    context.log("SENDGRID_API_KEY is not set");
    context.res = {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: false, error: "Email service not configured" },
    };
    return;
  }

  sgMail.setApiKey(apiKey);

  const subject = "New enquiry from SCS website";
  const textBody = `
A new enquiry has been submitted from the website.

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message}
  `.trim();

  const htmlBody = `
    <h2>New enquiry from SCS website</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${(message || "").replace(/\n/g, "<br>")}</p>
  `;

  const msg = {
    to: toEmail,
    from: fromEmail,
    replyTo: email, // 方便你在邮箱里直接点“回复”
    subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    await sgMail.send(msg);
    context.res = {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: true, message: "Enquiry received and email sent" },
    };
  } catch (error) {
    context.log("Error sending email", error);
    if (error.response) {
      context.log("SendGrid response body:", error.response.body);
    }

    context.res = {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: false, error: "Failed to send email" },
    };
  }
};
