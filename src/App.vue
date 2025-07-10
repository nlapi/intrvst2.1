<template>
  <div id="app">
    <div class="modern-header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-icon">
            <i class="el-icon-microphone"></i>
          </div>
          <h1 class="app-title">Interview Copilot</h1>
        </div>
        <nav class="nav-section">
          <router-link 
            to="/" 
            class="nav-item"
            :class="{ active: $router.currentRoute.path === '/' }"
          >
            <i class="el-icon-chat-dot-round"></i>
            <span>Interview</span>
          </router-link>
          <router-link 
            to="/customize" 
            class="nav-item"
            :class="{ active: $router.currentRoute.path === '/customize' }"
          >
            <i class="el-icon-user"></i>
            <span>Profile</span>
          </router-link>
          <router-link 
            to="/setting" 
            class="nav-item"
            :class="{ active: $router.currentRoute.path === '/setting' }"
          >
            <i class="el-icon-setting"></i>
            <span>Settings</span>
          </router-link>
        </nav>
      </div>
    </div>
    <router-view class="router_view"/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000e6;
  background-color: #f3f2ef;
  min-height: 100vh;
}

.modern-header {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: #0a66c2;
  margin: 0;
  letter-spacing: -0.5px;
}

.nav-section {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  text-decoration: none;
  color: #666666;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  min-width: 60px;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 2px;
}

.nav-item:hover {
  background-color: #f3f2ef;
  color: #0a66c2;
}

.nav-item.active {
  color: #0a66c2;
  background-color: #e7f3ff;
}

.router_view {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 11px;
    min-width: 50px;
  }
  
  .nav-item i {
    font-size: 18px;
  }
  
  .router_view {
    margin: 16px auto;
    padding: 0 16px;
  }
}
</style>