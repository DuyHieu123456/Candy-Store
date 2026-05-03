const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware'); //[cite: 18]

router.get('/', bannerController.getBanners); //[cite: 12]

// Admin routes
router.post('/', authMiddleware, adminMiddleware, bannerController.createBanner); //[cite: 12]
router.put('/:id', authMiddleware, adminMiddleware, bannerController.updateBanner); //[cite: 12]
router.delete('/:id', authMiddleware, adminMiddleware, bannerController.deleteBanner); //[cite: 12]

module.exports = router;