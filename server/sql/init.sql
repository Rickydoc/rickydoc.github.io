-- ============================================
-- 星尘编年史 - 数据库初始化脚本
-- 两张表: users (一般用户信息) + login_users (登录用户详细信息)
-- 使用方法: mysql -u root -p123456 < server/sql/init.sql
-- ============================================

-- 创建数据库
DROP DATABASE IF EXISTS stardust;
CREATE DATABASE stardust DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stardust;

-- ============================================
-- 表1: users — 一般用户信息表
-- 用于: 注册、登录、修改密码、列表展示
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  password VARCHAR(255) NOT NULL COMMENT '密码(bcrypt加密)',
  nickname VARCHAR(50) DEFAULT '' COMMENT '昵称',
  avatar VARCHAR(255) DEFAULT '' COMMENT '头像URL',
  bio TEXT COMMENT '个人简介',
  gender ENUM('male', 'female', 'other', '') DEFAULT '' COMMENT '性别',
  phone VARCHAR(20) DEFAULT '' COMMENT '手机号',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='一般用户信息表';

-- ============================================
-- 表2: login_users — 登录用户表
-- 用于: 存储登录用户的扩展信息(阅读进度、游戏存档、成就等)
-- ============================================
CREATE TABLE login_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE COMMENT '关联 users.id',
  reading_progress INT DEFAULT 0 COMMENT '阅读进度(章节号)',
  reading_book VARCHAR(100) DEFAULT '' COMMENT '当前阅读书名',
  game_progress INT DEFAULT 0 COMMENT '游戏进度(百分比0-100)',
  game_scene VARCHAR(100) DEFAULT '' COMMENT '当前游戏场景',
  save_data JSON COMMENT '游戏存档数据(JSON)',
  achievements JSON COMMENT '成就列表(JSON)',
  login_days INT DEFAULT 1 COMMENT '累计登录天数',
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录用户详细信息表';

-- ============================================
-- 插入测试数据
-- ============================================

-- 测试用户 (密码: 123456)
INSERT INTO users (username, email, password, nickname, bio) VALUES
('testuser', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '测试用户', '这是测试用户的个人简介');

-- 测试用户的登录信息
INSERT INTO login_users (user_id, reading_progress, reading_book, game_progress, game_scene, achievements, login_days) VALUES
(1, 0, '斗破苍穹', 0, '序章', '["初入星尘"]', 1);
