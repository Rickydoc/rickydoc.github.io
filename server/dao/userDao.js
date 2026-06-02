// ============================================
//  星尘编年史 - 用户数据访问对象 (DAO)
//  负责 users 表的所有数据库操作
// ============================================

const { pool } = require('../db');

const UserDao = {

  // ========== 查询操作 ==========

  /**
   * 根据用户名查找用户
   * @param {string} username
   * @returns {Array} 用户记录（含密码）
   */
  async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    return rows;
  },

  /**
   * 根据邮箱查找用户
   * @param {string} email
   * @returns {Array} 用户记录
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    return rows;
  },

  /**
   * 根据用户名或邮箱查找用户（登录用）
   * @param {string} account
   * @returns {Array} 用户记录（含密码）
   */
  async findByAccount(account) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', [account, account]
    );
    return rows;
  },

  /**
   * 根据 ID 查找用户（不含密码）
   * @param {number} id
   * @returns {Array} 用户记录
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, gender, phone, created_at, updated_at FROM users WHERE id = ?', [id]
    );
    return rows;
  },

  /**
   * 获取用户密码（修改密码时用）
   * @param {number} id
   * @returns {Array} 含 password 的记录
   */
  async findPasswordById(id) {
    const [rows] = await pool.query(
      'SELECT id, password FROM users WHERE id = ?', [id]
    );
    return rows;
  },

  /**
   * 获取用户总数
   * @returns {number}
   */
  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return rows[0].total;
  },

  /**
   * 分页查询用户列表（不含密码）
   * @param {number} offset
   * @param {number} limit
   * @returns {Array} 用户列表
   */
  async findPage(offset, limit) {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, gender, phone, created_at FROM users ORDER BY created_at DESC LIMIT ?, ?',
      [offset, limit]
    );
    return rows;
  },

  /**
   * 查询所有用户（不含密码）
   * @returns {Array} 用户列表
   */
  async findAll() {
    const [rows] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, gender, phone, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  // ========== 写入操作 ==========

  /**
   * 创建新用户
   * @param {Object} data - { username, email, password, nickname }
   * @returns {Object} 插入结果
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
   * @param {number} id
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
   * @param {number} id
   * @param {string} hashedPassword
   */
  async updatePassword(id, hashedPassword) {
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]
    );
  },

  /**
   * 根据邮箱更新密码（忘记密码用）
   * @param {string} email
   * @param {string} hashedPassword
   * @returns {Object} 更新结果
   */
  async updatePasswordByEmail(email, hashedPassword) {
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]
    );
    return result;
  },

  /**
   * 删除用户
   * @param {number} id
   * @returns {Object}
   */
  async deleteById(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = UserDao;
