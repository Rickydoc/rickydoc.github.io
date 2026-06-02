// ============================================
//  星尘编年史 - 用户控制器 (Controller)
//  接收请求 → 调用 UserService → 返回 JSON
// ============================================

const UserService = require('../services/userService');

const UserController = {

  /** POST /api/register */
  async register(req, res) {
    try {
      const { username, email, password, nickname } = req.body;
      const result = await UserService.register({ username, email, password, nickname });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 注册错误:', err);
      return res.json({ code: 500, message: '服务器错误，请稍后重试' });
    }
  },

  /** POST /api/login */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await UserService.login({ username, password });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 登录错误:', err);
      return res.json({ code: 500, message: '服务器错误，请稍后重试' });
    }
  },

  /** POST /api/forgot-password */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await UserService.forgotPassword(email);
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 忘记密码错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** POST /api/reset-password */
  async resetPassword(req, res) {
    try {
      const { email, verifyCode, newPassword } = req.body;
      const result = await UserService.resetPassword({ email, verifyCode, newPassword });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 重置密码错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** GET /api/profile */
  async getProfile(req, res) {
    try {
      const result = await UserService.getProfile(req.userId);
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 获取信息错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** PUT /api/profile */
  async updateProfile(req, res) {
    try {
      const { nickname, bio, gender, phone, avatar } = req.body;
      const result = await UserService.updateProfile(req.userId, { nickname, bio, gender, phone, avatar });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 更新信息错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** PUT /api/change-password */
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await UserService.changePassword(req.userId, { oldPassword, newPassword });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 修改密码错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  },

  /** GET /api/users */
  async getUserList(req, res) {
    try {
      const { page, pageSize } = req.query;
      const result = await UserService.getUserList({
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10
      });
      return res.json(result);
    } catch (err) {
      console.error('[UserController] 获取列表错误:', err);
      return res.json({ code: 500, message: '服务器错误' });
    }
  }
};

module.exports = UserController;
