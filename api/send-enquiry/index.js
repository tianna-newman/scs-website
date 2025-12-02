module.exports = async function (context, req) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
    return;
  }

  // 🔑 关键：兼容 req.body 为空的情况
  let body = req.body;
  if (!body && req.rawBody) {
    try {
      body = JSON.parse(req.rawBody);
    } catch (e) {
      context.log('Failed to parse rawBody', e);
    }
  }

  const { name, email, phone, message } = body || {};

  context.log('Enquiry received', { name, email, phone });

  if (!name || !email || !message) {
    context.res = {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: { success: false, error: 'Missing required fields' }
    };
    return;
  }

  // 👇 现在先只是确认收到，之后我们在这里加“发邮件”的逻辑
  context.res = {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: { success: true, message: 'Enquiry received' }
  };
};
