// ============================================
//  星尘编年史 - 用户路由
// ============================================

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// 公开接口
router.post('/register',        UserController.register);
router.post('/login',           UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password',  UserController.resetPassword);

// 需要登录
router.get('/profile',         authMiddleware, UserController.getProfile);
router.put('/profile',         authMiddleware, UserController.updateProfile);
router.put('/change-password', authMiddleware, UserController.changePassword);
router.get('/users',           authMiddleware, UserController.getUserList);

module.exports = router;
