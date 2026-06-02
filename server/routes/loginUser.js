// ============================================
//  星尘编年史 - 登录用户路由
//  游戏进度、阅读进度、存档、成就
// ============================================

const express = require('express');
const router = express.Router();
const LoginUserController = require('../controllers/loginUserController');
const authMiddleware = require('../middleware/auth');

// 所有接口都需要登录
router.get('/game-progress',    authMiddleware, LoginUserController.getGameProgress);
router.put('/game-progress',    authMiddleware, LoginUserController.updateGameProgress);
router.get('/reading-progress', authMiddleware, LoginUserController.getReadingProgress);
router.put('/reading-progress', authMiddleware, LoginUserController.updateReadingProgress);
router.post('/save-game',       authMiddleware, LoginUserController.saveGame);
router.get('/save-game',        authMiddleware, LoginUserController.getSaveGame);
router.put('/achievements',     authMiddleware, LoginUserController.updateAchievements);
router.get('/login-user-info',  authMiddleware, LoginUserController.getLoginUserInfo);

module.exports = router;
