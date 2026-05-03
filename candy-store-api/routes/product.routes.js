const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware'); 

router.get('/', productController.getProducts); 
router.get('/featured', productController.getFeaturedProducts); 
router.get('/new-arrivals', productController.getNewArrivals); 
router.get('/:slug', productController.getProductBySlug); 
router.post('/:id/reviews', authMiddleware, productController.addReview); 

// Admin routes
router.post('/', authMiddleware, adminMiddleware, productController.createProduct); 
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct); 
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct); 

module.exports = router;