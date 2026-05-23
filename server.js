require('dotenv').config();
const express = require('express');

const app = express();
const REAL_URL = process.env.REAL_URL;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const PORT = process.env.PORT || 3000;

function verifyToken(req, res, next) {
  const token = req.headers['x-secret-token'];
  if (!token || token !== SECRET_TOKEN) {
    return res.status(403).json({ error: 'غير مصرح' });
  }
  next();
}

app.get('/download', verifyToken, (req, res) => {
  console.log('طلب مصرح:', new Date().toISOString());
  res.redirect(REAL_URL);
});

app.get('/health', (req, res) => {
  res.json({ status: 'يعمل' });
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});