// ============================================
//  星尘编年史 - 用户数据访问层 (DAO/Model)
//  封装所有 users 表的 SQL 操作
// ============================================

const { pool } = require('../db');

const UserModel = {

  /**
   * 根据用户名查找用户
   * @param {string} username
   * @returns {Array} 匹配的用户记录
   */
  async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows;
  },

  /**
   * 根据邮箱查找用户
   * @param {string} email
   * @returns {Array} 匹配的用户记录
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows;
  },

  /**
   * 根据用户名或邮箱查找用户（登录用）
   * @param {string} account - 用户名或邮箱
   * @returns {Array} 匹配的用户记录
   */
  async findByAccount(account) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [account, account]
    );
    return rows;
  },

  /**
   * 根据 ID 查找用户（不含密码）
   * @param {number} id
   * @returns {Array} 匹配的用户记录
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, gender, phone, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows;
  },

  /**
   * 获取所有用户列表（不含密码）
   * @returns {Array} 用户列表
   */
  async findAll() {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, gender, phone, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  /**
   * 获取用户总数
   * @returns {number} 用户总数
   */
  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return rows[0].total;
  },

  /**
   * 创建新用户
   * @param {Object} userData - { username, email, password, nickname }
   * @returns {Object} 插入结果（含 insertId）
   */
  async create({ username, email, password, nickname }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)',
      [username, email, password, nickname || username]
    );
    return result;
  },

  /**
   * 更新用户个人信息
   * @param {number} id - 用户 ID
   * @param {Object} data - { nickname, bio, gender, phone, avatar }
   */
  async updateProfile(id, { nickname, bio, gender, phone, avatar }) {
    await pool.query(
      'UPDATE users SET nickname = ?, bio = ?, gender = ?, phone = ?, avatar = ? WHERE id = ?',
      [nickname || '', bio || '', gender || '', phone || '', avatar || '', id]
    );
  },

  /**
   * 更新用户密码
   * @param {number} id - 用户 ID
   * @param {string} hashedPassword - 加密后的新密码
   */
  async updatePassword(id, hashedPassword) {
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  },

  /**
   * 根据邮箱更新密码（忘记密码用）
   * @param {string} email
   * @param {string} hashedPassword - 加密后的新密码
   * @returns {Object} 更新结果
   */
  async updatePasswordByEmail(email, hashedPassword) {
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    return result;
  },

  /**
   * 删除用户
   * @param {number} id
   * @returns {Object} 删除结果
   */
  async deleteById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = UserModel;
