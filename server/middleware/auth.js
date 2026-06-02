// ============================================
//  星尘编年史 - 认证中间件
//  验证 JWT token，提取用户 ID
// ============================================

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT 认证中间件
 * 从请求头提取 Bearer token，验证并解码
 * 验证通过后将 userId 挂载到 req 对象
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 检查 Authorization 头是否存在
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录或 token 无效'
    });
  }

  const token = authHeader.substring(7);

  try {
    // 验证并解码 token
    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'token 已过期，请重新登录'
    });
  }
}

module.exports = authMiddleware;
