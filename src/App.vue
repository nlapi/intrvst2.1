<template>
  <div id="app">
    <div class="app-header">
      <div class="header-container">
        <div class="brand-section">
          <div class="brand-logo">
            <h1 class="brand-title">
              <span class="interview-part">Interview</span><span class="signal-part">Signal</span>
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
        
        <div class="auth-section">
          <el-button
            type="primary"
            @click="showAuthModal = true"
            class="sign-in-button"
          >
            <i class="el-icon-user"></i>
            <span>Sign In</span>
          </el-button>
        </div>
      </div>
    </div>
    
    <main class="app-main">
      <div class="welcome-content">
        <div class="welcome-card">
          <div class="welcome-icon">
            <i class="el-icon-chat-dot-round"></i>
          </div>
          <h2 class="welcome-title">Welcome to InterviewSignal</h2>
          <p class="welcome-description">
            Your AI-powered interview preparation companion. Sign in to get started with personalized coaching and practice sessions.
          </p>
          <el-button
            type="primary"
            size="large"
            @click="showAuthModal = true"
            class="welcome-button"
          >
            <i class="el-icon-user"></i>
            <span>Get Started</span>
          </el-button>
        </div>
      </div>
    </main>

    <!-- Simple Auth Modal -->
    <el-dialog
      :visible.sync="showAuthModal"
      title="Sign In to InterviewSignal"
      width="400px"
      custom-class="auth-dialog"
    >
      <div class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <el-input v-model="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <el-input v-model="password" type="password" placeholder="Enter your password" />
        </div>
        <el-button type="primary" @click="handleAuth" class="auth-button">
          Sign In
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showAuthModal: false,
      email: '',
      password: ''
    }
  },
  methods: {
    handleAuth() {
      console.log('Auth attempt:', this.email)
      this.$message.success('Authentication system will be connected soon!')
      this.showAuthModal = false
    }
  }
}
</script>

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
  gap: 24px;
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
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  display: flex;
  align-items: center;
}

.interview-part {
  background: #0a66c2;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.signal-part {
  color: #0a66c2;
  font-weight: 700;
  font-size: inherit;
  margin-left: 4px;
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

.auth-section {
  display: flex;
  align-items: center;
}

.sign-in-button {
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.welcome-card {
  text-align: center;
  max-width: 500px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 32px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.welcome-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.welcome-button {
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.auth-button {
  height: 44px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 70px;
  }
  
  .brand-title {
    font-size: 14px;
  }
  
  .navigation {
    gap: 4px;
  }
  
  .nav-link {
    padding: 8px 12px;
    min-width: 60px;
  }
  
  .nav-text {
    font-size: 11px;
  }
  
  .app-main {
    padding: 16px;
  }
  
  .welcome-card {
    padding: 32px 24px;
    margin: 0 16px;
  }
}
</style>