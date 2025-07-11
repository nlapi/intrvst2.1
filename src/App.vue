<template>
  <div id="app">
    <!-- Authentication Modal -->
    <AuthModal 
      :visible="showAuthModal" 
      @auth-success="handleAuthSuccess"
    />
    
    <!-- Admin Panel -->
    <AdminPanel 
      :visible="showAdminPanel" 
      @update:visible="showAdminPanel = $event"
    />
    
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
        
        <!-- User Menu or Sign In Button -->
        <div class="auth-section">
          <UserMenu 
            v-if="currentUser"
            :user="currentUser"
            @signed-out="handleSignOut"
            @show-admin="showAdminPanel = true"
          />
          <el-button
            v-else
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
      <div v-if="!currentUser && !showAuthModal && !authLoading" class="auth-required-overlay">
        <div class="auth-required-content">
          <div class="auth-required-icon">
            <i class="el-icon-lock"></i>
          </div>
          <h3 class="auth-required-title">Authentication Required</h3>
          <p class="auth-required-description">
            Please sign in to access InterviewSignal and start your interview preparation journey.
          </p>
          <el-button
            type="primary"
            size="large"
            @click="showAuthModal = true"
            class="auth-required-button"
          >
            <i class="el-icon-user"></i>
            <span>Sign In to Continue</span>
          </el-button>
        </div>
      </div>
      
      <div v-if="authLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <i class="el-icon-loading"></i>
          </div>
          <p class="loading-text">Initializing InterviewSignal...</p>
        </div>
      </div>
      
      <router-view v-if="!authLoading && (currentUser || showAuthModal)"/>
    </main>
  </div>
</template>

<script>
import AuthModal from '@/components/AuthModal.vue'
import UserMenu from '@/components/UserMenu.vue'
import AdminPanel from '@/components/AdminPanel.vue'
import { authHelpers, supabase } from '@/utils/supabase'

export default {
  name: 'App',
  components: {
    AuthModal,
    UserMenu,
    AdminPanel
  },
  data() {
    return {
      currentUser: null,
      showAuthModal: false,
      showAdminPanel: false,
      authLoading: true
    }
  },
  async mounted() {
    await this.initializeAuth()
  },
  methods: {
    async initializeAuth() {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
        const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
          console.log('Supabase not configured, showing auth modal')
          this.authLoading = false
          this.showAuthModal = true
          return
        }
        
        // Get current user
        this.currentUser = await authHelpers.getCurrentUser()
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
          this.currentUser = session?.user || null
          
          if (event === 'SIGNED_IN') {
            this.showAuthModal = false
          } else if (event === 'SIGNED_OUT') {
            this.currentUser = null
          }
        })
      } catch (error) {
        console.error('Auth initialization error:', error)
        this.showAuthModal = true
      } finally {
        this.authLoading = false
      }
    },

    handleAuthSuccess(user) {
      this.currentUser = user
      this.showAuthModal = false
      this.$message.success('Welcome to InterviewSignal!')
    },

    handleSignOut() {
      this.currentUser = null
      this.showAdminPanel = false
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

.auth-required-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.auth-required-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.auth-required-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 24px;
}

.auth-required-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.auth-required-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.auth-required-button {
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

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.loading-spinner {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 24px;
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
    font-size: 14px;
  }
  
  .interview-part,
  .signal-part {
    padding: 5px 7px;
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
  
  .auth-section {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 12px;
  }
  
  .interview-part,
  .signal-part {
    padding: 4px 6px;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 8px;
    min-width: 44px;
  }
  
  .sign-in-button {
    height: 36px;
    padding: 0 16px;
    font-size: 13px;
  }
  
  .auth-required-content {
    padding: 32px 24px;
    margin: 0 16px;
  }
}
</style>