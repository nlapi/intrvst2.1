<template>
  <el-dialog
    :visible.sync="visible"
    :title="isLogin ? 'Sign In' : 'Create Account'"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="auth-modal"
  >
    <div class="auth-container">
      <!-- Header -->
      <div class="auth-header">
        <div class="auth-icon">
          <i :class="isLogin ? 'el-icon-user' : 'el-icon-plus'"></i>
        </div>
        <h3 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Join InterviewSignal' }}</h3>
        <p class="auth-subtitle">
          {{ isLogin ? 'Sign in to continue your interview preparation' : 'Create your account to get started' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
            class="auth-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
            show-password
            class="auth-input"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="form-label">Full Name</label>
          <el-input
            v-model="form.fullName"
            placeholder="Enter your full name"
            :disabled="loading"
            class="auth-input"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="form-label">Current Role</label>
          <el-input
            v-model="form.currentRole"
            placeholder="e.g., Software Engineer, Product Manager"
            :disabled="loading"
            class="auth-input"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <i class="el-icon-warning"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          <i class="el-icon-check"></i>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Submit Button -->
        <el-button
          type="primary"
          :loading="loading"
          :disabled="loading"
          class="auth-submit-button"
          native-type="submit"
        >
          <span v-if="!loading">{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
          <span v-else>{{ isLogin ? 'Signing In...' : 'Creating Account...' }}</span>
        </el-button>

        <!-- Toggle Mode -->
        <div class="auth-toggle">
          <span class="toggle-text">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          </span>
          <button
            type="button"
            @click="toggleMode"
            :disabled="loading"
            class="toggle-button"
          >
            {{ isLogin ? 'Sign Up' : 'Sign In' }}
          </button>
        </div>
      </form>
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
      errorMessage: '',
      successMessage: '',
      form: {
        email: '',
        password: '',
        fullName: '',
        currentRole: ''
      }
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin
      this.clearMessages()
      this.resetForm()
    },

    resetForm() {
      this.form = {
        email: '',
        password: '',
        fullName: '',
        currentRole: ''
      }
    },

    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },

    async handleSubmit() {
      this.clearMessages()
      this.loading = true

      try {
        if (this.isLogin) {
          await this.handleSignIn()
        } else {
          await this.handleSignUp()
        }
      } catch (error) {
        console.error('Auth error:', error)
        this.errorMessage = 'An unexpected error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async handleSignIn() {
      const { data, error } = await authHelpers.signIn(this.form.email, this.form.password)
      
      if (error) {
        this.errorMessage = error.message
        return
      }

      if (data.user) {
        this.successMessage = 'Successfully signed in!'
        setTimeout(() => {
          this.$emit('auth-success', data.user)
          this.resetForm()
        }, 1000)
      }
    },

    async handleSignUp() {
      const userData = {
        full_name: this.form.fullName,
        current_role: this.form.currentRole
      }

      const { data, error } = await authHelpers.signUp(
        this.form.email, 
        this.form.password, 
        userData
      )
      
      if (error) {
        this.errorMessage = error.message
        return
      }

      if (data.user) {
        this.successMessage = 'Account created successfully! Please check your email to verify your account.'
        setTimeout(() => {
          this.isLogin = true
          this.resetForm()
          this.clearMessages()
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  padding: 8px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 24px;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.auth-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
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

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.auth-input .el-input__inner {
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.auth-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #16a34a;
  font-size: 14px;
}

.auth-submit-button {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  margin-top: 8px;
}

.auth-toggle {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.toggle-text {
  font-size: 14px;
  color: #64748b;
  margin-right: 8px;
}

.toggle-button {
  background: none;
  border: none;
  color: #0a66c2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.toggle-button:hover {
  color: #004182;
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style>
.auth-modal .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.auth-modal .el-dialog__header {
  display: none;
}

.auth-modal .el-dialog__body {
  padding: 32px;
}
</style>