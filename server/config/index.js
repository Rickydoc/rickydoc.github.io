// ============================================
//  星尘编年史 - 全局配置
//  集中管理数据库、JWT、服务器等配置项
// ============================================

module.exports = {
  // 服务器配置
  server: {
    port: 3000
  },

  // 数据库配置
  db: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'stardust',
    connectionLimit: 10,
    charset: 'utf8mb4'
  },

  // JWT 配置
  jwt: {
    secret: 'stardust_chronicles_secret_2026',
    expiresIn: '7d'
  },

  // bcrypt 配置
  bcrypt: {
    saltRounds: 10
  },

  // 模拟验证码（生产环境应使用真实邮件服务）
  verifyCode: '888888'
};
