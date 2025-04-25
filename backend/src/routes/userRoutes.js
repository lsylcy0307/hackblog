const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getUsers,
  getUser,
  updateUserRole
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router; 