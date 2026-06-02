// ============================================
//  星尘编年史 - 登录用户控制器 (Controller)
//  管理游戏进度、阅读进度、存档、成就
// ============================================

const LoginUserService = require('../services/loginUserService');

const LoginUserController = {

  /** GET /api/game-progress */
  async getGameProgress(req, res) {
    try {
      const result = await LoginUserService.getGameProgress(req.userId);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 获取游戏进度错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** PUT /api/game-progress */
  async updateGameProgress(req, res) {
    try {
      const { game_progress, game_scene } = req.body;
      const result = await LoginUserService.updateGameProgress(req.userId, { game_progress, game_scene });
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 更新游戏进度错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** GET /api/reading-progress */
  async getReadingProgress(req, res) {
    try {
      const result = await LoginUserService.getReadingProgress(req.userId);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 获取阅读进度错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** PUT /api/reading-progress */
  async updateReadingProgress(req, res) {
    try {
      const { reading_progress, reading_book } = req.body;
      const result = await LoginUserService.updateReadingProgress(req.userId, { reading_progress, reading_book });
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 更新阅读进度错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** POST /api/save-game */
  async saveGame(req, res) {
    try {
      const saveData = req.body;
      const result = await LoginUserService.saveGame(req.userId, saveData);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 保存存档错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** GET /api/save-game */
  async getSaveGame(req, res) {
    try {
      const result = await LoginUserService.getSaveGame(req.userId);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 读取存档错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** PUT /api/achievements */
  async updateAchievements(req, res) {
    try {
      const { achievements } = req.body;
      const result = await LoginUserService.updateAchievements(req.userId, achievements);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 更新成就错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** GET /api/login-user-info */
  async getLoginUserInfo(req, res) {
    try {
      const result = await LoginUserService.getLoginUserInfo(req.userId);
      return res.json(result);
    } catch (err) {
      console.error('[LoginUserController] 获取登录用户信息错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  }
};

module.exports = LoginUserController;
