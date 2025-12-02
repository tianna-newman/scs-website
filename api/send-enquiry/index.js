const nodemailer = require("nodemailer");

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

  // ===== 配置 SMTP（Outlook / Microsoft 365）=====
  const host = process.env.SMTP_HOST || "smtp.office365.com";
  const port = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : 587; // TLS
  const user = process.env.SMTP_USER; // 一般就是 info@scse.com.au
  const pass = process.env.SMTP_PASS; // 这个邮箱的密码

  const toEmail = process.env.EMAIL_TO || "info@scse.com.au"; // 收件人
  const fromEmail =
    process.env.EMAIL_FROM || user || "info@scse.com.au"; // 发件人

  if (!user || !pass) {
    context.log("SMTP_USER or SMTP_PASS is not set");
    context.res = {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: false, error: "Email service not configured" },
    };
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 才用 SSL，587 用 STARTTLS
    auth: {
      user,
      pass,
    },
  });

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

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    context.res = {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: true, message: "Enquiry received and email sent" },
    };
  } catch (error) {
    context.log("Error sending email", error);
    context.res = {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: {
        success: false,
        error: error && error.message ? error.message : "Failed to send email",
      },
    };
  }
};
