const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware'); //[cite: 18]

router.get('/', brandController.getBrands); //[cite: 13]
router.get('/:slug', brandController.getBrandBySlug); //[cite: 13]
router.get('/:slug/products', brandController.getBrandProducts); //[cite: 13]

// Admin routes
router.post('/', authMiddleware, adminMiddleware, brandController.createBrand); //[cite: 13]
router.put('/:id', authMiddleware, adminMiddleware, brandController.updateBrand); //[cite: 13]

module.exports = router;