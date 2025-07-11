<template>
  <div id="app">
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading InterviewSignal...</p>
      </div>
    </div>

    <div v-else-if="!currentUser" class="app-container">
      <!-- Header for non-authenticated users -->
      <div class="app-header">
        <div class="header-container">
          <div class="brand-section">
            <div class="brand-logo">
              <h1 class="brand-title">
                <span class="interview-part">Interview</span><span class="signal-part">Signal</span>
              </h1>
            </div>
          </div>
          
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
        <div class="welcome-layout">
          <div class="welcome-content-left">
            <div class="welcome-info">
              <h2 class="welcome-title">Welcome to InterviewSignal</h2>
              <p class="welcome-description">
                Your AI-powered interview preparation companion. Sign up to get started with personalized coaching and practice sessions.
              </p>
              <div class="welcome-features">
                <div class="feature-item">
                  <i class="el-icon-microphone"></i>
                  <span>Live Speech Recognition</span>
                </div>
                <div class="feature-item">
                  <i class="el-icon-magic-stick"></i>
                  <span>AI-Powered Coaching</span>
                </div>
                <div class="feature-item">
                  <i class="el-icon-user"></i>
                  <span>Personalized Guidance</span>
                </div>
              </div>
              
              <div class="legal-notice">
                <p class="legal-text">
                  By clicking Continue to join or sign in, you agree to InterviewSignal's User Agreement, Privacy Policy, and Cookie Policy.
                </p>
              </div>
              
              <div class="join-section">
                <span class="join-text">New to InterviewSignal? </span>
                <a href="#" @click.prevent="showAuthModal = true" class="join-link">Join now</a>
              </div>
            </div>
          </div>
          
          <div class="welcome-content-right">
            <div class="welcome-image">
              <img src="./assets/ChatGPT Image Jul 10, 2025, 08_47_36 PM.png" alt="InterviewSignal" class="hero-image" />
            </div>
          </div>
        </div>
      </main>

      <!-- Authentication Modal -->
      <AuthModal 
        :visible="showAuthModal" 
        @auth-success="handleAuthSuccess"
        @close="showAuthModal = false"
      />
    </div>

    <!-- Authenticated User Interface -->
    <div v-else class="app-container">
      <!-- Header for authenticated users -->
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
            <UserMenu 
              :user="currentUser" 
              @signed-out="handleSignOut"
              @show-admin="showAdminPanel = true"
            />
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <main class="app-main">
        <div v-if="userStatus === 'pending'" class="status-screen">
          <div class="status-card pending">
            <div class="status-icon">
              <i class="el-icon-time"></i>
            </div>
            <h3 class="status-title">Account Pending Approval</h3>
            <p class="status-description">
              Your account has been created and email verified successfully! 
              An administrator will review and approve your access shortly.
            </p>
            <div class="status-details">
              <div class="detail-item">
                <i class="el-icon-check"></i>
                <span>Email Verified</span>
              </div>
              <div class="detail-item pending">
                <i class="el-icon-time"></i>
                <span>Admin Approval Pending</span>
              </div>
            </div>
            <el-button @click="handleSignOut" type="text" class="sign-out-link">
              Sign Out
            </el-button>
          </div>
        </div>

        <div v-else-if="userStatus === 'rejected'" class="status-screen">
          <div class="status-card rejected">
            <div class="status-icon">
              <i class="el-icon-close"></i>
            </div>
            <h3 class="status-title">Access Denied</h3>
            <p class="status-description">
              Your account application has been reviewed and unfortunately was not approved at this time.
            </p>
            <el-button @click="handleSignOut" type="text" class="sign-out-link">
              Sign Out
            </el-button>
          </div>
        </div>

        <div v-else>
          <router-view/>
        </div>
      </main>

      <!-- Admin Panel -->
      <AdminPanel 
        :visible="showAdminPanel"
        @close="showAdminPanel = false"
        @user-deleted="refreshUserStatus"
      />
    </div>
  </div>
</template>

<script>
import { authHelpers } from '@/utils/supabase'
import AuthModal from '@/components/AuthModal.vue'
import UserMenu from '@/components/UserMenu.vue'
import AdminPanel from '@/components/AdminPanel.vue'

export default {
  name: 'App',
  components: {
    AuthModal,
    UserMenu,
    AdminPanel
  },
  data() {
    return {
      loading: true,
      currentUser: null,
      userStatus: 'approved', // approved, pending, rejected
      showAuthModal: false,
      showAdminPanel: false,
      showEmailVerificationHelper: false,
      // Mock user database
      users: [
        {
          id: 'admin-001',
          email: 'nisjet.lapi@gmail.com',
          password: 'Winter202!Winter202!',
          fullName: 'Admin User',
          role: 'Administrator',
          company: 'InterviewSignal',
          status: 'approved',
          isAdmin: true,
          emailVerified: true,
          createdAt: new Date('2024-01-01').toISOString()
        },
        {
          id: 'user-001',
          email: 'john.smith@example.com',
          password: 'password123',
          fullName: 'John Smith',
          role: 'Software Engineer',
          company: 'Tech Corp',
          status: 'pending',
          isAdmin: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'user-002',
          email: 'sarah.johnson@example.com',
          password: 'password123',
          fullName: 'Sarah Johnson',
          role: 'Product Manager',
          company: 'StartupXYZ',
          status: 'approved',
          isAdmin: false,
          emailVerified: true,
          createdAt: new Date().toISOString()
        }
      ]
    }
  },
  computed: {
    isSupabaseConfigured() {
      // Always return true since we have fallback authentication
      return true
    }
  },
  async mounted() {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check for existing Supabase session
    if (this.isSupabaseConfigured) {
      try {
        const user = await authHelpers.getCurrentUser()
        if (user && user.email_confirmed_at) {
          this.currentUser = user
          this.userStatus = this.getUserStatus(user)
        }
      } catch (error) {
        console.error('Error checking auth session:', error)
      }
    } else {
      // Fallback to localStorage for demo purposes
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          const user = this.users.find(u => u.id === userData.id)
          if (user) {
            this.currentUser = user
            this.userStatus = user.status
          }
        } catch (error) {
          console.error('Error loading saved user:', error)
          localStorage.removeItem('currentUser')
        }
      }
    }
    
    this.loading = false
  },
  methods: {
    getUserStatus(user) {
      // Check if user is admin
      if (authHelpers.isAdmin(user)) {
        return 'approved'
      }
      
      // For now, return pending - you'll need to implement user status in your database
      // This would typically check a user_profiles table or similar
      return user.user_metadata?.status || 'pending'
    },
    
    handleAuthSuccess(user) {
      this.currentUser = user
      this.userStatus = this.getUserStatus(user)
      this.showAuthModal = false
      
      // Save session (fallback for non-Supabase)
      if (!this.isSupabaseConfigured) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email
        }))
      }
      
      if (this.userStatus === 'approved') {
        // Get display name from customization data if available
        const customizationData = this.getCustomizationFromStorage()
        let displayName = user.email
        
        if (customizationData.personalInfo && customizationData.personalInfo.firstName) {
          displayName = `${customizationData.personalInfo.firstName} ${customizationData.personalInfo.lastName || ''}`.trim()
        } else if (user.user_metadata?.full_name) {
          displayName = user.user_metadata.full_name
        }
        
        this.$message.success(`Welcome back, ${displayName}!`)
        if (authHelpers.isAdmin(user)) {
          this.$message.info('Admin privileges activated')
        }
      }
    },
    
    async handleSignOut() {
      if (this.isSupabaseConfigured) {
        await authHelpers.signOut()
      }
      
      this.currentUser = null
      this.userStatus = 'approved'
      this.showAdminPanel = false
      localStorage.removeItem('currentUser')
      this.$message.success('Successfully signed out')
    },
    
    refreshUserStatus() {
      if (this.currentUser) {
        if (this.isSupabaseConfigured) {
          // Refresh from Supabase
          this.userStatus = this.getUserStatus(this.currentUser)
        } else {
          // Fallback to mock data
          const updatedUser = this.users.find(u => u.id === this.currentUser.id)
          if (updatedUser) {
            this.currentUser = updatedUser
            this.userStatus = updatedUser.status
          } else {
            this.handleSignOut()
            this.$message.warning('Your account has been removed by an administrator')
          }
        }
      }
    },
    
    // Method to be called by child components to get/update users
    getUsers() {
      return this.users
    },
    
    updateUser(userId, updates) {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...updates }
        return this.users[userIndex]
      }
      return null
    },
    
    deleteUser(userId) {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1)
        return true
      }
      return false
    },
    
    addUser(userData) {
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        emailVerified: true, // Only called after email verification
        status: 'pending'
      }
      this.users.push(newUser)
      return newUser
    },
    
    getCustomizationFromStorage() {
      const saved = localStorage.getItem('interview_customization')
      if (!saved) {
        return { personalInfo: null }
      }
      
      try {
        const data = JSON.parse(saved)
        return {
          personalInfo: data.personalInfo || null
        }
      } catch (error) {
        console.error('Error loading customization data:', error)
        return { personalInfo: null }
      }
    }
  },
  provide() {
    return {
      getUsers: this.getUsers,
      updateUser: this.updateUser,
      deleteUser: this.deleteUser,
      addUser: this.addUser
    }
  }
}
</script>

<style scoped>
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

.config-notice {
  background: #fef3c7;
  border-bottom: 1px solid #f59e0b;
  padding: 12px 0;
}

.notice-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 32px;
}

.notice-icon {
  color: #f59e0b;
  font-size: 18px;
}

.notice-text {
  flex: 1;
}

.notice-text strong {
  color: #92400e;
  font-weight: 600;
}

.notice-text p {
  color: #a16207;
  font-size: 14px;
  margin: 2px 0 0 0;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #0a66c2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-text {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  font-size: 17px;
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
  font-size: inherit;
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
  height: 36px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 600;
  background: white;
  color: #0a66c2;
  border: 2px solid #0a66c2;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.sign-in-button:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(10, 102, 194, 0.2);
}

.app-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  width: 100%;
}

/* Prevent scrolling on welcome and interview pages */
.app-container:has(.welcome-layout) {
  height: 100vh;
  overflow: hidden;
}

.app-container:has(.interview-workspace) {
  height: 100vh;
  overflow: hidden;
}

.app-main:has(.welcome-layout) {
  height: calc(100vh - 80px);
  overflow: hidden;
}

.app-main:has(.interview-workspace) {
  height: calc(100vh - 80px);
  overflow: hidden;
}

.welcome-layout {
  display: flex;
  align-items: stretch;
  gap: 48px;
  min-height: 60vh;
}

.welcome-content-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-info {
  max-width: 100%;
  width: 100%;
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.welcome-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.hero-image {
  max-width: 100%;
  max-height: 500px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1));
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  text-align: left;
  line-height: 1.2;
  width: 100%;
}

.welcome-description {
  font-size: 17px;
  color: #64748b;
  margin: 0 0 36px 0;
  line-height: 1.65;
  text-align: left;
  max-width: 480px;
}

.welcome-features {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 36px;
  max-width: 400px;
  width: 100%;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.feature-item i {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
  border-radius: 8px;
  font-size: 16px;
  flex-shrink: 0;
}

.legal-notice {
  margin-bottom: 28px;
  max-width: 500px;
  text-align: left;
}

.legal-text {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.join-section {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  justify-content: flex-start;
}

.join-text {
  color: #64748b;
}

.join-link {
  color: #0a66c2;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s ease;
}

.join-link:hover {
  color: #004182;
  text-decoration: underline;
}

.status-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.status-card {
  text-align: center;
  max-width: 500px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.status-card.pending {
  border-left: 4px solid #f59e0b;
}

.status-card.rejected {
  border-left: 4px solid #ef4444;
}

.status-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 32px;
}

.status-card.pending .status-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.status-card.rejected .status-icon {
  background: #fef2f2;
  color: #ef4444;
}

.status-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.status-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.detail-item i {
  font-size: 16px;
}

.detail-item:not(.pending) {
  color: #16a34a;
}

.detail-item.pending {
  color: #f59e0b;
}

.sign-out-link {
  color: #64748b;
  font-weight: 500;
}

.sign-out-link:hover {
  color: #3b82f6;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-layout {
    flex-direction: column;
    gap: 32px;
  }
  
  .welcome-info {
    padding: 32px 20px;
    align-items: center;
    text-align: center;
  }
  
  .welcome-title {
    text-align: center;
  }
  
  .welcome-description {
    text-align: center;
  }
  
  .legal-text {
    text-align: center;
  }
  
  .join-section {
    justify-content: center;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .hero-image {
    max-height: 300px;
  }
  
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
  
  .status-card {
    padding: 32px 24px;
    margin: 0 16px;
  }
}
</style>