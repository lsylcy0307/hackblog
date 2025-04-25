const express = require('express');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  pinArticle
} = require('../controllers/articleController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticle);

// Author routes (author & admin)
router.post('/', protect, authorize('author', 'admin'), createArticle);
router.put('/:id', protect, authorize('author', 'admin'), updateArticle);
router.delete('/:id', protect, authorize('author', 'admin'), deleteArticle);

// Admin only routes
router.patch('/:id/pin', protect, authorize('admin'), pinArticle);

module.exports = router; 