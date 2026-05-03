const jwt = require('jsonwebtoken');
const JWT_SECRET  = process.env.JWT_SECRET  || 'candystore_secret_key_2024';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { generateToken, verifyToken };