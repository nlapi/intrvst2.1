<template>
  <div id="app">
    <div class="app-header">
      <div class="header-container">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-icon">
              <i class="el-icon-microphone"></i>
            </div>
            <div class="brand-text">
              <h1 class="brand-title">Interview Copilot</h1>
              <p class="brand-subtitle">AI-Powered Interview Assistant</p>
            </div>
          </div>
        </div>
        
        <nav class="navigation">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: $router.currentRoute.path === '/' }"
          >
            <div class="nav-icon">
              <i class="el-icon-chat-dot-round"></i>
            </div>
            <span class="nav-text">Interview</span>
          </router-link>
          
          <router-link 
            to="/customize" 
            class="nav-link"
            :class="{ active: $router.currentRoute.path === '/customize' }"
          >
            <div class="nav-icon">
              <i class="el-icon-user"></i>
            </div>
            <span class="nav-text">Profile</span>
          </router-link>
          
          <router-link 
            to="/setting" 
            class="nav-link"
            :class="{ active: $router.currentRoute.path === '/setting' }"
          >
            <div class="nav-icon">
              <i class="el-icon-setting"></i>
            </div>
            <span class="nav-text">Settings</span>
          </router-link>
        </nav>
      </div>
    </div>
    
    <main class="app-main">
      <router-view/>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
}

.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 80px;
}

.brand-section {
  display: flex;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin: 0;
}

.brand-subtitle {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
  line-height: 1;
}

.navigation {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #64748b;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 80px;
  position: relative;
}

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.nav-icon i {
  font-size: 18px;
}

.nav-text {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.nav-link:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.nav-link:hover .nav-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.nav-link.active {
  color: #3b82f6;
  background: #eff6ff;
}

.nav-link.active .nav-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  min-height: calc(100vh - 80px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 24px;
  }
  
  .app-main {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 70px;
  }
  
  .brand-logo {
    gap: 12px;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .brand-subtitle {
    font-size: 11px;
  }
  
  .navigation {
    gap: 4px;
  }
  
  .nav-link {
    padding: 8px 12px;
    min-width: 60px;
  }
  
  .nav-icon {
    width: 28px;
    height: 28px;
  }
  
  .nav-icon i {
    font-size: 16px;
  }
  
  .nav-text {
    font-size: 11px;
  }
  
  .app-main {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 8px;
    min-width: 44px;
  }
}
</style>