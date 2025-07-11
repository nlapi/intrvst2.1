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
        <div class="welcome-content">
          <div class="welcome-card">
            <div class="welcome-icon">
              <i class="el-icon-chat-dot-round"></i>
            </div>
            <h2 class="welcome-title">Welcome to InterviewSignal</h2>
            <p class="welcome-description">
              Your AI-powered interview preparation companion. Sign up to get started with personalized coaching and practice sessions.
            </p>
            <div class="welcome-actions">
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
          emailVerified: true,
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
  async mounted() {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check for existing session
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
    
    this.loading = false
  },
  methods: {
    handleAuthSuccess(user) {
      this.currentUser = user
      this.userStatus = user.status
      this.showAuthModal = false
      
      // Save session
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email
      }))
      
      if (user.status === 'approved') {
        this.$message.success(`Welcome back, ${user.fullName}!`)
        if (user.isAdmin) {
          this.$message.info('Admin privileges activated')
        }
      }
    },
    
    handleSignOut() {
      this.currentUser = null
      this.userStatus = 'approved'
      this.showAdminPanel = false
      localStorage.removeItem('currentUser')
      this.$message.success('Successfully signed out')
    },
    
    refreshUserStatus() {
      if (this.currentUser) {
        const updatedUser = this.users.find(u => u.id === this.currentUser.id)
        if (updatedUser) {
          this.currentUser = updatedUser
          this.userStatus = updatedUser.status
        } else {
          // User was deleted
          this.handleSignOut()
          this.$message.warning('Your account has been removed by an administrator')
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
        emailVerified: false,
        status: 'pending'
      }
      this.users.push(newUser)
      return newUser
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
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  width: 100%;
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

.welcome-actions {
  display: flex;
  justify-content: center;
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
  
  .welcome-card, .status-card {
    padding: 32px 24px;
    margin: 0 16px;
  }
}
</style>