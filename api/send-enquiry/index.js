const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
  // CORS 预检
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

  const {
    name,
    email,
    phone,
    preferredDate,
    message,
    serviceType,
    privacyConsent,
  } = body || {};

  // serviceType 既可能是 string 也可能是 array，这里统一成数组
  let serviceList = [];
  if (Array.isArray(serviceType)) {
    serviceList = serviceType;
  } else if (typeof serviceType === "string" && serviceType.trim()) {
    serviceList = [serviceType.trim()];
  }

  let serviceSummary = "Not specified";
  if (serviceList.length > 0) {
    serviceSummary = serviceList.join(", ");
  }

  context.log("Enquiry received", {
    name,
    email,
    phone,
    preferredDate,
    serviceType: serviceList,
  });

  if (!name || !email || !message) {
    context.res = {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { success: false, error: "Missing required fields" },
    };
    return;
  }

  // ===== SMTP 配置（Gmail，使用应用专用密码）=====
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : 587;
  const user = process.env.SMTP_USER; // 例如：akiyoru.momiji@gmail.com
  const pass = process.env.SMTP_PASS; // Gmail 应用专用密码

  // 收件人：支持逗号分隔多个
  const toEmail =
    process.env.EMAIL_TO || "info@scse.com.au,admin@gohubme.com";

  // 发件人（显示名 + 邮箱）
  const fromEmail =
    process.env.EMAIL_FROM || user || "akiyoru.momiji@gmail.com";

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
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: {
      user,
      pass,
    },
  });

  const submittedAt = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
  });

  const subject = `【SCS Website】New enquiry from ${name}`;

  const textBody = `
Hi Michael,

You have a new enquiry from the SCS website.

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Preferred Date/Time: ${preferredDate || "Not specified"}
Services: ${serviceSummary}
Privacy Consent: ${privacyConsent ? "Yes" : "No"}
Submitted At: ${submittedAt}

Message:
${message}

---
This email was sent automatically from the SCS website enquiry form.
  `.trim();

  const htmlBody = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#222;">
    <h2 style="margin:0 0 8px 0;">New enquiry from SCS website</h2>
    <p style="margin:0 0 16px 0;">Hi Michael,</p>
    <p style="margin:0 0 16px 0;">
      You have received a new enquiry from the SCS website contact form:
    </p>

    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 16px 0;">
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Name:</td>
        <td style="padding:4px 8px;">${name}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Email:</td>
        <td style="padding:4px 8px;">${email}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Phone:</td>
        <td style="padding:4px 8px;">${phone || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Preferred Date/Time:</td>
        <td style="padding:4px 8px;">${preferredDate || "Not specified"}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Services:</td>
        <td style="padding:4px 8px;">${serviceSummary}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Privacy Consent:</td>
        <td style="padding:4px 8px;">${privacyConsent ? "Yes" : "No"}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;font-weight:bold;">Submitted At:</td>
        <td style="padding:4px 8px;">${submittedAt}</td>
      </tr>
    </table>

    <p style="margin:0 0 8px 0;"><strong>Message:</strong></p>
    <div style="margin:0 0 24px 0;padding:12px 14px;border-radius:6px;border:1px solid #e0e0e0;background:#f5f5f5;white-space:pre-wrap;">
      ${(message || "").replace(/\n/g, "<br>")}
    </div>

    <p style="margin:0;font-size:12px;color:#666;">
      This email was sent automatically from the SCS website enquiry form.
    </p>
  </div>
  `;

  const mailOptions = {
    from: `"SCS Website Notification" <${fromEmail}>`,
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
        error:
          (error && error.message) || "Failed to send email",
      },
    };
  }
};
