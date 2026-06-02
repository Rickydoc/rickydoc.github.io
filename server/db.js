// ============================================
//  星尘编年史 - 数据库连接模块
//  使用 mysql2 创建连接池
// ============================================

const mysql = require('mysql2/promise');
const config = require('./config');

// 创建连接池
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  charset: config.db.charset
});

/**
 * 测试数据库连接
 * 启动时调用，确认数据库可达
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL 数据库连接成功');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL 数据库连接失败:', err.message);
    console.error('请确保 MySQL 服务已启动，并已执行 server/sql/init.sql 初始化数据库');
  }
}

module.exports = { pool, testConnection };
