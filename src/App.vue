<template>
  <div id="app">
    <div class="app-header">
      <div class="header-container">
        <div class="brand-section">
          <div class="brand-logo">
            <h1 class="brand-title">
              <span class="interview-part">interview</span><span class="signal-part">Signal</span>
            </h1>
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
}

.brand-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  display: flex;
  align-items: center;
}

.interview-part {
  background: #0a66c2;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.signal-part {
  background: white;
  color: #0a66c2;
  padding: 4px 6px;
  border-radius: 4px;
  font-weight: 700;
  border: 2px solid #0a66c2;
  margin-left: -2px;
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
  
  .brand-title {
    font-size: 11px;
  }
  
  .interview-part,
  .signal-part {
    padding: 3px 5px;
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
    font-size: 12px;
  }
  
  .nav-text {
    font-size: 11px;
  }
  
  .app-main {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 10px;
  }
  
  .interview-part,
  .signal-part {
    padding: 2px 4px;
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