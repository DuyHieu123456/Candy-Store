const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware'); //[cite: 18]

router.get('/', categoryController.getCategories); //[cite: 15]
router.get('/:slug', categoryController.getCategoryBySlug); //[cite: 15]
router.get('/:slug/products', categoryController.getCategoryProducts); //[cite: 15]

// Admin routes
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory); //[cite: 15]
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory); //[cite: 15]

module.exports = router;