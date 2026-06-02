// ============================================
//  星尘编年史 - 用户业务逻辑层 (Service)
//  调用 UserDao + LoginUserDao 完成业务
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserDao = require('../dao/userDao');
const LoginUserDao = require('../dao/loginUserDao');

const UserService = {

  // ========== 注册 ==========
  async register({ username, email, password, nickname }) {
    // 1. 参数校验
    if (!username || !email || !password) {
      return { code: 400, message: '用户名、邮箱和密码不能为空' };
    }
    if (username.length < 3 || username.length > 20) {
      return { code: 400, message: '用户名长度应为 3-20 个字符' };
    }
    if (password.length < 6) {
      return { code: 400, message: '密码长度不能少于 6 个字符' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { code: 400, message: '邮箱格式不正确' };
    }

    // 2. 检查唯一性
    if ((await UserDao.findByUsername(username)).length > 0) {
      return { code: 400, message: '用户名已被注册' };
    }
    if ((await UserDao.findByEmail(email)).length > 0) {
      return { code: 400, message: '邮箱已被注册' };
    }

    // 3. 加密密码 & 创建 users 记录
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const result = await UserDao.create({ username, email, password: hashedPassword, nickname });

    // 4. 创建 login_users 记录（关联新用户）
    await LoginUserDao.create(result.insertId);

    // 5. 生成 JWT
    const token = jwt.sign({ id: result.insertId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    return {
      code: 200,
      message: '注册成功',
      data: {
        token,
        user: { id: result.insertId, username, email, nickname: nickname || username }
      }
    };
  },

  // ========== 登录 ==========
  async login({ username, password }) {
    if (!username || !password) {
      return { code: 400, message: '用户名和密码不能为空' };
    }

    const users = await UserDao.findByAccount(username);
    if (users.length === 0) {
      return { code: 400, message: '用户名或密码错误' };
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { code: 400, message: '用户名或密码错误' };
    }

    // 更新 login_users 的登录天数
    await LoginUserDao.updateLogin(user.id);

    // 获取 login_users 信息
    const loginUsers = await LoginUserDao.findByUserId(user.id);
    const loginUser = loginUsers.length > 0 ? loginUsers[0] : null;

    const token = jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio,
          gender: user.gender,
          phone: user.phone
        },
        loginUser: loginUser ? {
          reading_progress: loginUser.reading_progress,
          reading_book: loginUser.reading_book,
          game_progress: loginUser.game_progress,
          game_scene: loginUser.game_scene,
          achievements: loginUser.achievements,
          login_days: loginUser.login_days,
          last_login: loginUser.last_login
        } : null
      }
    };
  },

  // ========== 忘记密码 ==========
  async forgotPassword(email) {
    if (!email) {
      return { code: 400, message: '请输入邮箱地址' };
    }
    const users = await UserDao.findByEmail(email);
    if (users.length === 0) {
      return { code: 400, message: '该邮箱未注册' };
    }
    return {
      code: 200,
      message: '验证码已发送到您的邮箱',
      data: { verifyCode: config.verifyCode }
    };
  },

  // ========== 重置密码 ==========
  async resetPassword({ email, verifyCode, newPassword }) {
    if (!email || !verifyCode || !newPassword) {
      return { code: 400, message: '请填写完整信息' };
    }
    if (newPassword.length < 6) {
      return { code: 400, message: '新密码长度不能少于 6 个字符' };
    }
    if (verifyCode !== config.verifyCode) {
      return { code: 400, message: '验证码错误' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const result = await UserDao.updatePasswordByEmail(email, hashedPassword);
    if (result.affectedRows === 0) {
      return { code: 400, message: '邮箱未找到' };
    }
    return { code: 200, message: '密码重置成功，请使用新密码登录' };
  },

  // ========== 获取用户信息 ==========
  async getProfile(userId) {
    const users = await UserDao.findById(userId);
    if (users.length === 0) {
      return { code: 404, message: '用户不存在' };
    }

    // 同时获取 login_users 信息
    const loginUsers = await LoginUserDao.findByUserId(userId);
    const loginUser = loginUsers.length > 0 ? loginUsers[0] : null;

    return {
      code: 200,
      data: {
        ...users[0],
        loginUser: loginUser ? {
          reading_progress: loginUser.reading_progress,
          reading_book: loginUser.reading_book,
          game_progress: loginUser.game_progress,
          game_scene: loginUser.game_scene,
          save_data: loginUser.save_data,
          achievements: loginUser.achievements,
          login_days: loginUser.login_days,
          last_login: loginUser.last_login
        } : null
      }
    };
  },

  // ========== 获取用户列表（联合查询） ==========
  async getUserList({ page = 1, pageSize = 10 } = {}) {
    const total = await LoginUserDao.count();
    const offset = (page - 1) * pageSize;
    const list = await LoginUserDao.findPageWithUser(offset, pageSize);

    return {
      code: 200,
      data: {
        list,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    };
  },

  // ========== 更新用户信息 ==========
  async updateProfile(userId, data) {
    await UserDao.updateProfile(userId, data);
    const users = await UserDao.findById(userId);
    return { code: 200, message: '更新成功', data: users[0] };
  },

  // ========== 修改密码 ==========
  async changePassword(userId, { oldPassword, newPassword }) {
    if (!oldPassword || !newPassword) {
      return { code: 400, message: '请填写原密码和新密码' };
    }
    if (newPassword.length < 6) {
      return { code: 400, message: '新密码长度不能少于 6 个字符' };
    }

    const rows = await UserDao.findPasswordById(userId);
    if (rows.length === 0) {
      return { code: 404, message: '用户不存在' };
    }

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) {
      return { code: 400, message: '原密码错误' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await UserDao.updatePassword(userId, hashedPassword);

    return { code: 200, message: '密码修改成功' };
  }
};

module.exports = UserService;
