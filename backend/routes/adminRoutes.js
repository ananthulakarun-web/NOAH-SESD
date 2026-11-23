const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly); // Enforce role-based access control for all admin routes

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
