<template>
  <el-dialog
    :visible.sync="visible"
    :title="isLogin ? 'Sign In to InterviewSignal' : 'Create Your Account'"
    width="400px"
    :close-on-click-modal="false"
    custom-class="auth-dialog"
    @close="$emit('close')"
  >
    <div class="auth-form">
      <!-- Sign In Form -->
      <div v-if="isLogin">
        <div class="form-group">
          <label>Email</label>
          <el-input 
            v-model="loginForm.email" 
            placeholder="Enter your email"
            type="email"
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            show-password
            class="auth-input"
          />
        </div>
      </div>
      
      <!-- Sign Up Form -->
      <div v-else>
        <div class="form-group">
          <label>Full Name *</label>
          <el-input 
            v-model="signupForm.fullName" 
            placeholder="Enter your full name"
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <el-input 
            v-model="signupForm.email" 
            type="email" 
            placeholder="Enter your email address"
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Password *</label>
          <el-input 
            v-model="signupForm.password" 
            type="password" 
            placeholder="Create a password"
            show-password
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Confirm Password *</label>
          <el-input 
            v-model="signupForm.confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            show-password
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Referral Code *</label>
          <el-input 
            v-model="signupForm.referralCode" 
            placeholder="Enter your referral code"
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Current Role *</label>
          <el-input 
            v-model="signupForm.role" 
            placeholder="e.g., Software Engineer, Product Manager"
            class="auth-input"
          />
        </div>
        <div class="form-group">
          <label>Company (Optional)</label>
          <el-input 
            v-model="signupForm.company" 
            placeholder="Current or target company"
            class="auth-input"
          />
        </div>
      </div>
      
      <!-- Status Messages -->
      <div v-if="statusMessage" class="status-message" :class="statusMessage.type">
        <i :class="statusMessage.type === 'success' ? 'el-icon-check' : 'el-icon-warning'"></i>
        <div class="message-content">
          <div class="message-title">{{ statusMessage.title }}</div>
          <div class="message-text">{{ statusMessage.text }}</div>
        </div>
      </div>
      
      <!-- Submit Button -->
      <el-button 
        type="primary" 
        @click="handleSubmit" 
        :loading="loading"
        :disabled="loading"
        class="auth-button"
      >
        {{ isLogin ? 'Sign In' : 'Create Account' }}
      </el-button>
      
      <!-- Toggle between Sign In / Sign Up -->
      <div class="auth-toggle">
        <span>{{ isLogin ? "Don't have an account?" : "Already have an account?" }}</span>
        <el-button type="text" @click="toggleMode" class="toggle-button">
          {{ isLogin ? 'Sign Up' : 'Sign In' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { authHelpers } from '@/utils/supabase'

export default {
  name: 'AuthModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLogin: true,
      loading: false,
      statusMessage: null,
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        role: '',
        company: ''
      }
    }
  },
  computed: {
    isSupabaseConfigured() {
      // Always return true since we have mock authentication fallback
      return true
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin
      this.statusMessage = null
      this.clearForms()
    },
    
    clearForms() {
      this.loginForm = {
        email: '',
        password: ''
      }
      this.signupForm = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        role: '',
        company: ''
      }
    },
    
    async handleSubmit() {
      if (!this.isSupabaseConfigured) {
        this.statusMessage = {
          type: 'error',
          title: 'Configuration Required',
          text: 'Please set up Supabase configuration to enable authentication. Click "Connect to Supabase" in the top right.'
        }
        return
      }
      
      this.loading = true
      this.statusMessage = null
      
      try {
        if (this.isLogin) {
          await this.handleSignIn()
        } else {
          await this.handleSignUp()
        }
      } catch (error) {
        this.statusMessage = {
          type: 'error',
          title: 'Error',
          text: error.message
        }
      } finally {
        this.loading = false
      }
    },
    
    async handleSignIn() {
      const { email, password } = this.loginForm
      
      if (!email || !password) {
        throw new Error('Please enter both email and password')
      }
      
      const { data, error } = await authHelpers.signIn(email, password)
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.')
        }
        throw new Error(error.message)
      }
      
      if (!data.user) {
        throw new Error('Invalid email or password')
      }
      
      // Check if user is approved (you'll need to implement this in your database)
      this.$emit('auth-success', data.user)
      this.clearForms()
    },
    
    async handleSignUp() {
      const { fullName, email, password, confirmPassword, referralCode, role, company } = this.signupForm
      
      // Validation
      if (!fullName || !email || !password || !referralCode || !role) {
        throw new Error('Please fill in all required fields')
      }
      
      if (!confirmPassword) {
        throw new Error('Please confirm your password')
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
      
      // Validate referral code
      if (!this.validateReferralCode(referralCode)) {
        throw new Error('Invalid referral code. Please check your code and try again.')
      }
      
      // Mark referral code as used
      this.markReferralCodeAsUsed(referralCode)
      
      const { data, error } = await authHelpers.signUp(email, password, {
        full_name: fullName,
        current_role: role,
        company: company || '',
        referral_code: referralCode,
        status: 'approved', // Directly approved with valid referral code
        email_confirmed_at: new Date().toISOString()
      })
      
      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists')
        }
        throw new Error(error.message)
      }
      
      // Directly emit success since no email verification needed
      this.$emit('auth-success', data.user)
      this.clearForms()
    },
    
    validateReferralCode(code) {
      // Get valid referral codes from localStorage
      const validCodes = JSON.parse(localStorage.getItem('referralCodes') || '[]')
      return validCodes.some(codeObj => codeObj.code === code && codeObj.active && !codeObj.used)
    },
    
    markReferralCodeAsUsed(code) {
      const validCodes = JSON.parse(localStorage.getItem('referralCodes') || '[]')
      const codeIndex = validCodes.findIndex(codeObj => codeObj.code === code)
      if (codeIndex !== -1) {
        validCodes[codeIndex].used = true
        validCodes[codeIndex].usedAt = new Date().toISOString()
        localStorage.setItem('referralCodes', JSON.stringify(validCodes))
      }
    }
  }
}
</script>

<style scoped>
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

.auth-input .el-input__inner {
  height: 44px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 0 14px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.auth-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.status-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
}

.status-message.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.status-message.error {
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

.auth-button {
  height: 44px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  font-weight: 600;
  font-size: 15px;
}

.auth-toggle {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.toggle-button {
  color: #0a66c2;
  font-weight: 600;
  padding: 0;
}

.toggle-button:hover {
  color: #004182;
}
</style>

<style>
.auth-dialog .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.auth-dialog .el-dialog__header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.auth-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.auth-dialog .el-dialog__body {
  padding: 24px;
}
</style>