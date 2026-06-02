/* ============================================
   星尘编年史 - 公共 JS
   导航栏、登录状态、工具函数
   ============================================ */

// API 基础地址
const API_BASE = 'http://localhost:3000/api';

// ========== 工具函数 ==========

// 获取 localStorage 中的 token
function getToken() {
  return localStorage.getItem('stardust_token');
}

// 获取 localStorage 中的用户信息
function getUser() {
  const data = localStorage.getItem('stardust_user');
  return data ? JSON.parse(data) : null;
}

// 保存登录信息
function saveAuth(token, user) {
  localStorage.setItem('stardust_token', token);
  localStorage.setItem('stardust_user', JSON.stringify(user));
}

// 清除登录信息
function clearAuth() {
  localStorage.removeItem('stardust_token');
  localStorage.removeItem('stardust_user');
}

// 检查是否已登录
function isLoggedIn() {
  return !!getToken();
}

// 带 token 的 fetch 请求
async function authFetch(url, options = {}) {
  const token = getToken();
  if (!options.headers) options.headers = {};
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token;
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, options);
  if (res.status === 401) {
    clearAuth();
    window.location.href = 'login.html';
    return;
  }
  return res.json();
}

// 显示消息提示（兼容 ElementUI 和原生）
function showMessage(msg, type) {
  if (typeof Element !== 'undefined' && window.ELEMENT && window.ELEMENT.Message) {
    ELEMENT.Message({ message: msg, type: type || 'info', duration: 3000 });
  } else {
    // 简单 fallback
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:12px 24px;border-radius:8px;font-size:14px;color:#fff;animation:fadeInDown .3s;';
    const colors = { success: '#2ed573', error: '#ff4757', warning: '#ffa502', info: '#7c5cff' };
    el.style.background = colors[type] || colors.info;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
  }
}

// ========== 星空背景 ==========

function createStars(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 普通星星
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.width = star.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(star);
  }

  // 流星
  for (let i = 0; i < 3; i++) {
    const shooting = document.createElement('div');
    shooting.className = 'shooting-star';
    shooting.style.left = Math.random() * 60 + '%';
    shooting.style.top = Math.random() * 40 + '%';
    shooting.style.animationDelay = (i * 5 + Math.random() * 5) + 's';
    shooting.style.animationDuration = (3 + Math.random() * 2) + 's';
    container.appendChild(shooting);
  }
}

// ========== 导航栏组件 ==========

function renderNavbar(activePage) {
  const user = getUser();
  const navHTML = `
    <nav class="navbar" id="navbar">
      <a href="index.html" class="nav-brand">星尘编年史</a>
      <div class="nav-links">
        <a href="index.html" class="nav-link ${activePage === 'index' ? 'active' : ''}">首页</a>
        <a href="game.html" class="nav-link ${activePage === 'game' ? 'active' : ''}">开始旅程</a>
        <a href="reader.html" class="nav-link ${activePage === 'reader' ? 'active' : ''}">阅读小说</a>
        ${user ? `
          <a href="home.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">主页</a>
          <div class="nav-user" onclick="toggleUserMenu()">
            <div class="nav-avatar">${(user.nickname || user.username || '').charAt(0).toUpperCase()}</div>
            <span class="nav-username">${user.nickname || user.username}</span>
          </div>
          <div id="userDropdown" style="display:none;position:absolute;top:55px;right:30px;background:rgba(15,15,42,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px 0;min-width:160px;backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,0.3);">
            <a href="profile.html" style="display:block;padding:10px 20px;color:rgba(255,255,255,0.7);font-size:0.9rem;transition:all 0.3s;" onmouseover="this.style.background='rgba(124,92,255,0.15)';this.style.color='#fff'" onmouseout="this.style.background='';this.style.color='rgba(255,255,255,0.7)'">个人资料</a>
            <div style="height:1px;background:rgba(255,255,255,0.1);margin:5px 0;"></div>
            <a href="#" onclick="handleLogout()" style="display:block;padding:10px 20px;color:rgba(255,255,255,0.7);font-size:0.9rem;transition:all 0.3s;" onmouseover="this.style.background='rgba(255,71,87,0.15)';this.style.color='#ff4757'" onmouseout="this.style.background='';this.style.color='rgba(255,255,255,0.7)'">退出登录</a>
          </div>
        ` : `
          <a href="login.html" class="nav-link ${activePage === 'login' ? 'active' : ''}">登录</a>
          <a href="register.html" class="nav-link ${activePage === 'register' ? 'active' : ''}" style="background:linear-gradient(135deg,var(--accent),var(--accent-light));color:white;border-radius:50px;padding:8px 20px;">注册</a>
        `}
      </div>
      <button class="menu-toggle" onclick="toggleMobileMenu()">☰</button>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <a href="index.html" class="nav-link ${activePage === 'index' ? 'active' : ''}">首页</a>
      <a href="game.html" class="nav-link ${activePage === 'game' ? 'active' : ''}">开始旅程</a>
      <a href="reader.html" class="nav-link ${activePage === 'reader' ? 'active' : ''}">阅读小说</a>
      ${user ? `
        <a href="home.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">主页</a>
        <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">个人资料</a>
        <a href="#" class="nav-link" onclick="handleLogout()">退出登录</a>
      ` : `
        <a href="login.html" class="nav-link ${activePage === 'login' ? 'active' : ''}">登录</a>
        <a href="register.html" class="nav-link ${activePage === 'register' ? 'active' : ''}">注册</a>
      `}
    </div>
    <div class="mobile-overlay" id="mobileOverlay" onclick="toggleMobileMenu()"></div>
  `;

  const navContainer = document.getElementById('app-navbar');
  if (navContainer) {
    navContainer.innerHTML = navHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  // 滚动时添加阴影
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
  });
}

// 切换移动端菜单
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  if (menu) menu.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

// 切换用户下拉菜单
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
}

// 点击其他地方关闭下拉菜单
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('userDropdown');
  const userEl = document.querySelector('.nav-user');
  if (dropdown && userEl && !userEl.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// 退出登录
function handleLogout() {
  clearAuth();
  showMessage('已退出登录', 'success');
  setTimeout(() => { window.location.href = 'login.html'; }, 500);
}

// 需要登录的页面调用此函数
function requireAuth() {
  if (!isLoggedIn()) {
    showMessage('请先登录', 'warning');
    setTimeout(() => { window.location.href = 'login.html'; }, 500);
    return false;
  }
  return true;
}

// ========== 主题切换 ==========

// 主题定义
const THEMES = [
  { id: 'default', name: '星尘紫', color: '#7c5cff' },
  { id: 'emerald', name: '翡翠绿', color: '#00d68f' },
  { id: 'ocean',   name: '深海蓝', color: '#00b4d8' },
  { id: 'flame',   name: '烈焰红', color: '#ff4757' },
  { id: 'sakura',  name: '樱花粉', color: '#ff69b4' },
  { id: 'sunset',  name: '日落橙', color: '#ff8c00' },
  { id: 'aurora',  name: '极光',   color: '#00ffc8' }
];

// 获取当前主题
function getTheme() {
  return localStorage.getItem('stardust_theme') || 'default';
}

// 设置主题
function setTheme(themeId) {
  localStorage.setItem('stardust_theme', themeId);
  applyTheme(themeId);
}

// 应用主题到 DOM
function applyTheme(themeId) {
  if (themeId === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }
  // 更新主题面板选中状态
  document.querySelectorAll('.theme-item').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === themeId);
  });
}

// 渲染主题切换器
function renderThemeSwitcher() {
  const currentTheme = getTheme();

  // 先应用主题
  applyTheme(currentTheme);

  const switcherHTML = `
    <div class="theme-switcher" id="themeSwitcher">
      <button class="theme-toggle-btn" onclick="toggleThemePanel()" title="切换主题">🎨</button>
      <div class="theme-panel" id="themePanel">
        <div class="theme-panel-title">选择主题</div>
        <div class="theme-grid">
          ${THEMES.map(t => `
            <div class="theme-item ${t.id === currentTheme ? 'active' : ''}"
                 data-theme="${t.id}"
                 onclick="setTheme('${t.id}')">
              <div class="theme-color" style="background: ${t.color};"></div>
              <span class="theme-name">${t.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', switcherHTML);
}

// 切换主题面板显示
function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.toggle('open');
}

// 点击其他地方关闭主题面板
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('themeSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    const panel = document.getElementById('themePanel');
    if (panel) panel.classList.remove('open');
  }
});