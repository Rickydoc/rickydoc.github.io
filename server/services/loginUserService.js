// ============================================
//  星尘编年史 - 登录用户业务逻辑层 (Service)
//  调用 LoginUserDao 管理游戏/阅读进度
// ============================================

const LoginUserDao = require('../dao/loginUserDao');

const LoginUserService = {

  // ========== 获取游戏进度 ==========
  async getGameProgress(userId) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }
    const user = rows[0];
    return {
      code: 200,
      data: {
        game_progress: user.game_progress,
        game_scene: user.game_scene,
        save_data: user.save_data
      }
    };
  },

  // ========== 更新游戏进度 ==========
  async updateGameProgress(userId, { game_progress, game_scene }) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }

    await LoginUserDao.updateGameProgress(userId, { game_progress, game_scene });
    return { code: 200, message: '游戏进度更新成功' };
  },

  // ========== 获取阅读进度 ==========
  async getReadingProgress(userId) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }
    const user = rows[0];
    return {
      code: 200,
      data: {
        reading_progress: user.reading_progress,
        reading_book: user.reading_book
      }
    };
  },

  // ========== 更新阅读进度 ==========
  async updateReadingProgress(userId, { reading_progress, reading_book }) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }

    await LoginUserDao.updateReadingProgress(userId, { reading_progress, reading_book });
    return { code: 200, message: '阅读进度更新成功' };
  },

  // ========== 保存游戏存档 ==========
  async saveGame(userId, saveData) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }

    await LoginUserDao.updateSaveData(userId, saveData);
    return { code: 200, message: '游戏存档保存成功' };
  },

  // ========== 获取游戏存档 ==========
  async getSaveGame(userId) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }
    return {
      code: 200,
      data: { save_data: rows[0].save_data }
    };
  },

  // ========== 更新成就 ==========
  async updateAchievements(userId, achievements) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }

    await LoginUserDao.updateAchievements(userId, achievements);
    return { code: 200, message: '成就更新成功' };
  },

  // ========== 获取完整登录用户信息 ==========
  async getLoginUserInfo(userId) {
    const rows = await LoginUserDao.findByUserId(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户记录不存在' };
    }
    return { code: 200, data: rows[0] };
  }
};

module.exports = LoginUserService;
