require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
const REAL_URL = process.env.REAL_URL;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const AES_KEY = process.env.AES_KEY; // 32 حرف
const AES_IV = process.env.AES_IV;   // 16 حرف
const PORT = process.env.PORT || 3000;

function encryptUrl(text) {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(AES_KEY),
        Buffer.from(AES_IV)
    );
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function verifyToken(req, res, next) {
    const token = req.headers['x-secret-token'];
    if (!token || token !== SECRET_TOKEN) {
        return res.status(403).json({ error: 'تريد تسحب الملفات 😂 تم التشفير بواسطة سجاد' });
    }
    next();
}
app.get('/json', verifyToken, (req, res) => {
    const encryptedUrl = encryptUrl(process.env.JSON_URL);
    res.json({ url: encryptedUrl });
});

app.get('/download', verifyToken, (req, res) => {
    const encryptedUrl = encryptUrl(REAL_URL);
    res.json({ url: encryptedUrl });
});

app.get('/health', (req, res) => res.json({ status: 'يعمل' }));

app.listen(PORT, () => console.log(`الخادم يعمل على ${PORT}`));