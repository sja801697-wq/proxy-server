const express = require('express');
const https = require('https');
const { REAL_URL, SECRET_TOKEN, PORT } = require('./config');

const app = express();

// middleware للتحقق من التوكن
function verifyToken(req, res, next) {
  const token = req.headers['x-secret-token'];

  if (!token || token !== SECRET_TOKEN) {
    return res.status(403).json({ error: 'غير مصرح - توكن خاطئ' });
  }
  next();
}

// مسار التحميل المحمي
app.get('/download', verifyToken, (req, res) => {
  console.log('طلب تحميل مصرح به:', new Date().toISOString());
  res.redirect(REAL_URL);
});

// مسار للتحقق من أن الخادم يعمل
app.get('/health', (req, res) => {
  res.json({ status: 'يعمل بشكل طبيعي' });
});

app.listen(PORT, () => {
  console.log(`الخادم الوسيط يعمل على المنفذ ${PORT}`);
  console.log(`رابط التحميل المحمي: http://localhost:${PORT}/download`);
});