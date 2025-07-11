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
      :title="isSignUp ? 'Create Account' : 'Sign In to InterviewSignal'"
      width="400px"
      custom-class="auth-dialog"
    >
      <div class="auth-form">
        <div v-if="!isSignUp" class="form-group">
          <label>Email</label>
          <el-input v-model="email" placeholder="Enter your email" />
        </div>
        <div v-if="!isSignUp" class="form-group">
          <label>Password</label>
          <el-input v-model="password" type="password" placeholder="Enter your password" />
        </div>
        
        <!-- Sign Up Form -->
        <div v-if="isSignUp">
          <div class="form-group">
            <label>Full Name</label>
            <el-input v-model="signUpData.fullName" placeholder="Enter your full name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <el-input v-model="signUpData.email" type="email" placeholder="Enter your email address" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <el-input v-model="signUpData.password" type="password" placeholder="Create a password" />
          </div>
          <div class="form-group">
            <label>Current Role</label>
            <el-input v-model="signUpData.role" placeholder="e.g., Software Engineer, Product Manager" />
          </div>
          <div class="form-group">
            <label>Company (Optional)</label>
            <el-input v-model="signUpData.company" placeholder="Current or target company" />
          </div>
        </div>
        
        <!-- Status Messages -->
        <div v-if="authMessage" class="auth-message" :class="authMessage.type">
          <i :class="authMessage.type === 'success' ? 'el-icon-check' : 'el-icon-warning'"></i>
          <div class="message-content">
            <div class="message-title">{{ authMessage.title }}</div>
            <div class="message-text">{{ authMessage.text }}</div>
          </div>
        </div>
        
        <el-button 
          type="primary" 
          @click="handleAuth" 
          :loading="authLoading"
          class="auth-button"
        >
          {{ isSignUp ? 'Create Account' : 'Sign In' }}
        </el-button>
        
        <!-- Toggle between Sign In / Sign Up -->
        <div class="auth-toggle">
          <span>{{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}</span>
          <el-button type="text" @click="toggleAuthMode" class="toggle-button">
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    
    <!-- Admin Panel Modal -->
    <el-dialog
      :visible.sync="showAdminPanel"
      title="Admin Panel - User Management"
      width="800px"
      custom-class="admin-dialog"
    >
      <div class="admin-content">
        <div class="admin-header">
          <h3>Pending Approvals</h3>
          <p>Users waiting for admin approval</p>
        </div>
        
        <div class="pending-users">
          <div v-if="pendingUsers.length === 0" class="no-pending">
            <i class="el-icon-check"></i>
            <p>No users pending approval</p>
          </div>
          
          <div v-for="user in pendingUsers" :key="user.id" class="user-card">
            <div class="user-info">
              <div class="user-avatar">{{ getUserInitials(user.fullName) }}</div>
              <div class="user-details">
                <div class="user-name">{{ user.fullName }}</div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ user.role }}</div>
                <div class="user-company" v-if="user.company">{{ user.company }}</div>
              </div>
            </div>
            <div class="user-actions">
              <el-button type="success" size="small" @click="approveUser(user)">
                <i class="el-icon-check"></i> Approve
              </el-button>
              <el-button type="danger" size="small" @click="rejectUser(user)">
                <i class="el-icon-close"></i> Reject
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="admin-header" style="margin-top: 32px;">
          <h3>Approved Users</h3>
          <p>Active users with access to the platform</p>
        </div>
        
        <div class="approved-users">
          <div v-if="approvedUsers.length === 0" class="no-users">
            <i class="el-icon-user"></i>
            <p>No approved users yet</p>
          </div>
          
          <div v-for="user in approvedUsers" :key="user.id" class="user-card approved">
            <div class="user-info">
              <div class="user-avatar approved">{{ getUserInitials(user.fullName) }}</div>
              <div class="user-details">
                <div class="user-name">{{ user.fullName }}</div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ user.role }}</div>
                <div class="user-company" v-if="user.company">{{ user.company }}</div>
              </div>
            </div>
            <div class="user-actions">
              <el-button type="danger" size="small" @click="deleteUser(user)">
                <i class="el-icon-delete"></i> Delete
              </el-button>
            </div>
          </div>
        </div>
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
      showAdminPanel: false,
      isSignUp: false,
      authLoading: false,
      authMessage: null,
      email: '',
      password: '',
      signUpData: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        company: ''
      },
      // Mock data - in real app this would come from database
      pendingUsers: [
        {
          id: 1,
          fullName: 'John Smith',
          email: 'john.smith@example.com',
          role: 'Software Engineer',
          company: 'Tech Corp',
          status: 'pending',
          emailVerified: true
        },
        {
          id: 2,
          fullName: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          role: 'Product Manager',
          company: 'StartupXYZ',
          status: 'pending',
          emailVerified: true
        }
      ],
      approvedUsers: [
        {
          id: 3,
          fullName: 'Admin User',
          email: 'nisjet.lapi@gmail.com',
          role: 'Administrator',
          company: 'InterviewSignal',
          status: 'approved'
        }
      ]
    }
  },
  methods: {
    toggleAuthMode() {
      this.isSignUp = !this.isSignUp
      this.authMessage = null
      this.clearForms()
    },
    
    clearForms() {
      this.email = ''
      this.password = ''
      this.signUpData = {
        fullName: '',
        email: '',
        password: '',
        role: '',
        company: ''
      }
    },
    
    async handleAuth() {
      this.authLoading = true
      this.authMessage = null
      
      try {
        if (this.isSignUp) {
          await this.handleSignUp()
        } else {
          await this.handleSignIn()
        }
      } catch (error) {
        this.authMessage = {
          type: 'error',
          title: 'Error',
          text: error.message
        }
      } finally {
        this.authLoading = false
      }
    },
    
    async handleSignUp() {
      // Validate form
      if (!this.signUpData.fullName || !this.signUpData.email || !this.signUpData.password || !this.signUpData.role) {
        throw new Error('Please fill in all required fields')
      }
      
      // Simulate email verification and admin approval process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      this.authMessage = {
        type: 'success',
        title: 'Account Created Successfully!',
        text: 'Please check your email to verify your account. After email verification, an admin will review and approve your access.'
      }
      
      // Add to pending users (in real app, this would be saved to database)
      this.pendingUsers.push({
        id: Date.now(),
        fullName: this.signUpData.fullName,
        email: this.signUpData.email,
        role: this.signUpData.role,
        company: this.signUpData.company,
        status: 'pending',
        emailVerified: false
      })
      
      // Clear form
      setTimeout(() => {
        this.clearForms()
        this.isSignUp = false
        this.authMessage = null
      }, 3000)
    },
    
    async handleSignIn() {
      if (!this.email || !this.password) {
        throw new Error('Please enter both email and password')
      }
      
      // Check if admin
      if (this.email === 'nisjet.lapi@gmail.com') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.showAuthModal = false
        this.showAdminPanel = true
        this.$message.success('Welcome back, Admin!')
        return
      }
      
      // Check if user is approved
      const user = this.approvedUsers.find(u => u.email === this.email)
      if (!user) {
        throw new Error('Account not found or not yet approved. Please contact admin.')
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.showAuthModal = false
      this.$message.success(`Welcome back, ${user.fullName}!`)
    },
    
    getUserInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    
    async approveUser(user) {
      this.$confirm(`Approve access for ${user.fullName}?`, 'Approve User', {
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel',
        type: 'success'
      }).then(() => {
        // Move from pending to approved
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id)
        this.approvedUsers.push({
          ...user,
          status: 'approved'
        })
        this.$message.success(`${user.fullName} has been approved!`)
      })
    },
    
    async rejectUser(user) {
      this.$confirm(`Reject ${user.fullName}'s application?`, 'Reject User', {
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id)
        this.$message.success(`${user.fullName}'s application has been rejected`)
      })
    },
    
    async deleteUser(user) {
      if (user.email === 'nisjet.lapi@gmail.com') {
        this.$message.error('Cannot delete admin account')
        return
      }
      
      this.$confirm(`Permanently delete ${user.fullName}?`, 'Delete User', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        this.approvedUsers = this.approvedUsers.filter(u => u.id !== user.id)
        this.$message.success(`${user.fullName} has been deleted`)
      })
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

.auth-toggle {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.toggle-button {
  color: #0a66c2;
  font-weight: 600;
}

.auth-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
}

.auth-message.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.auth-message.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.message-content {
  flex: 1;
}

.message-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
}

/* Admin Panel Styles */
.admin-content {
  max-height: 600px;
  overflow-y: auto;
}

.admin-header {
  margin-bottom: 20px;
}

.admin-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.admin-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.pending-users, .approved-users {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-pending, .no-users {
  text-align: center;
  padding: 32px;
  color: #64748b;
}

.no-pending i, .no-users i {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.user-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.user-card.approved {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-avatar.approved {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.user-email {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 2px;
}

.user-role {
  font-size: 13px;
  color: #0a66c2;
  font-weight: 500;
}

.user-company {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.user-actions {
  display: flex;
  gap: 8px;
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
  
  .user-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .user-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
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