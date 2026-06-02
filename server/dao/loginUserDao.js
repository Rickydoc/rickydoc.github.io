// ============================================
//  星尘编年史 - 登录用户数据访问对象 (DAO)
//  负责 login_users 表的所有数据库操作
// ============================================

const { pool } = require('../db');

const LoginUserDao = {

  // ========== 查询操作 ==========

  /**
   * 根据 user_id 查找登录用户信息
   * @param {number} userId
   * @returns {Array}
   */
  async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM login_users WHERE user_id = ?', [userId]
    );
    return rows;
  },

  /**
   * 根据 ID 查找
   * @param {number} id
   * @returns {Array}
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM login_users WHERE id = ?', [id]
    );
    return rows;
  },

  /**
   * 查询所有登录用户信息
   * @returns {Array}
   */
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM login_users ORDER BY last_login DESC'
    );
    return rows;
  },

  /**
   * 联合查询: users + login_users（列表展示用）
   * @param {number} offset
   * @param {number} limit
   * @returns {Array}
   */
  async findPageWithUser(offset, limit) {
    const [rows] = await pool.query(`
      SELECT
        u.id, u.username, u.email, u.nickname, u.avatar, u.bio, u.gender, u.phone, u.created_at,
        lu.reading_progress, lu.reading_book, lu.game_progress, lu.game_scene,
        lu.achievements, lu.login_days, lu.last_login
      FROM users u
      LEFT JOIN login_users lu ON u.id = lu.user_id
      ORDER BY u.created_at DESC
      LIMIT ?, ?
    `, [offset, limit]);
    return rows;
  },

  /**
   * 联合查询总数
   * @returns {number}
   */
  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return rows[0].total;
  },

  // ========== 写入操作 ==========

  /**
   * 创建登录用户记录（注册时调用）
   * @param {number} userId
   * @returns {Object}
   */
  async create(userId) {
    const [result] = await pool.query(
      'INSERT INTO login_users (user_id) VALUES (?)', [userId]
    );
    return result;
  },

  /**
   * 创建登录用户记录（带初始数据）
   * @param {Object} data - { user_id, reading_progress, reading_book, game_progress, game_scene, achievements, login_days }
   * @returns {Object}
   */
  async createWithData(data) {
    const [result] = await pool.query(
      `INSERT INTO login_users (user_id, reading_progress, reading_book, game_progress, game_scene, achievements, login_days)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.reading_progress || 0,
        data.reading_book || '',
        data.game_progress || 0,
        data.game_scene || '',
        data.achievements ? JSON.stringify(data.achievements) : '[]',
        data.login_days || 1
      ]
    );
    return result;
  },

  /**
   * 更新登录天数和最后登录时间
   * @param {number} userId
   */
  async updateLogin(userId) {
    await pool.query(`
      UPDATE login_users
      SET login_days = login_days + 1, last_login = NOW()
      WHERE user_id = ?
    `, [userId]);
  },

  /**
   * 更新阅读进度
   * @param {number} userId
   * @param {Object} data - { reading_progress, reading_book }
   */
  async updateReadingProgress(userId, { reading_progress, reading_book }) {
    await pool.query(
      'UPDATE login_users SET reading_progress = ?, reading_book = ? WHERE user_id = ?',
      [reading_progress || 0, reading_book || '', userId]
    );
  },

  /**
   * 更新游戏进度
   * @param {number} userId
   * @param {Object} data - { game_progress, game_scene }
   */
  async updateGameProgress(userId, { game_progress, game_scene }) {
    await pool.query(
      'UPDATE login_users SET game_progress = ?, game_scene = ? WHERE user_id = ?',
      [game_progress || 0, game_scene || '', userId]
    );
  },

  /**
   * 保存游戏存档
   * @param {number} userId
   * @param {Object} saveData
   */
  async updateSaveData(userId, saveData) {
    await pool.query(
      'UPDATE login_users SET save_data = ? WHERE user_id = ?',
      [JSON.stringify(saveData), userId]
    );
  },

  /**
   * 更新成就列表
   * @param {number} userId
   * @param {Array} achievements
   */
  async updateAchievements(userId, achievements) {
    await pool.query(
      'UPDATE login_users SET achievements = ? WHERE user_id = ?',
      [JSON.stringify(achievements), userId]
    );
  },

  /**
   * 删除登录用户记录
   * @param {number} userId
   */
  async deleteByUserId(userId) {
    await pool.query('DELETE FROM login_users WHERE user_id = ?', [userId]);
  }
};

module.exports = LoginUserDao;
