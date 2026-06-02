// ============================================
//  星尘编年史 - Express 服务入口
//  架构: Route → Controller → Service → DAO → MySQL
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { testConnection } = require('./db');

// 路由模块
const userRoutes = require('./routes/user');
const loginUserRoutes = require('./routes/loginUser');

const app = express();

// ========== 中间件 ==========
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ========== 路由 ==========
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: '服务运行正常', time: new Date().toISOString() });
});

app.use('/api', userRoutes);       // 用户相关: 注册、登录、列表、资料
app.use('/api', loginUserRoutes);  // 登录用户: 游戏进度、阅读进度、存档

// 静态文件
app.use(express.static(path.join(__dirname, '..', 'docs')));

// ========== 错误处理 ==========
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

// ========== 启动 ==========
app.listen(config.server.port, async () => {
  console.log('=================================');
  console.log('  星尘编年史 - 后端服务');
  console.log(`  地址: http://localhost:${config.server.port}`);
  console.log('  架构: Route → Controller → Service → DAO → MySQL');
  console.log('  表:   users + login_users');
  console.log('=================================');
  await testConnection();
});
