<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-logo">
          <h1 class="brand-title">
            <span class="interview-part">Interview</span><span class="signal-part">Signal</span>
          </h1>
        </div>
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join thousands of successful candidates</p>
      </div>

      <form @submit.prevent="handleSignup" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <el-input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="auth-input"
            :class="{ error: errors.email }"
            @input="clearError('email')"
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <el-input
            v-model="password"
            type="password"
            placeholder="Create a password"
            class="auth-input"
            :class="{ error: errors.password }"
            @input="clearError('password')"
            show-password
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          <div class="password-hint">
            Password must be at least 6 characters long
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="auth-input"
            :class="{ error: errors.confirmPassword }"
            @input="clearError('confirmPassword')"
            show-password
          />
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
        </div>

        <div v-if="errors.general" class="general-error">
          <div class="error-icon">
            <i class="el-icon-warning"></i>
          </div>
          <div class="error-text">{{ errors.general }}</div>
        </div>

        <div v-if="successMessage" class="success-message">
          <div class="success-icon">
            <i class="el-icon-check"></i>
          </div>
          <div class="success-text">{{ successMessage }}</div>
        </div>

        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
          class="auth-button"
          size="large"
        >
          <span v-if="!loading">Create Account</span>
          <span v-else>Creating Account...</span>
        </el-button>
      </form>

      <div class="auth-footer">
        <p class="auth-link-text">
          Already have an account?
          <router-link to="/login" class="auth-link">Sign in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { signUp } from '../utils/supabase'

export default {
  name: 'Signup',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errors: {},
      successMessage: ''
    }
  },
  methods: {
    async handleSignup() {
      this.clearAllErrors()
      this.successMessage = ''
      
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        const { data, error } = await signUp(this.email, this.password)
        
        if (error) {
          this.handleAuthError(error)
        } else if (data.user) {
          this.successMessage = 'Account created successfully! You can now sign in.'
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        }
      } catch (error) {
        this.errors.general = 'An unexpected error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    },

    validateForm() {
      let isValid = true

      if (!this.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!this.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters long'
        isValid = false
      }

      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      return isValid
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    handleAuthError(error) {
      switch (error.message) {
        case 'User already registered':
          this.errors.general = 'An account with this email already exists. Please sign in instead.'
          break
        case 'Password should be at least 6 characters':
          this.errors.password = 'Password must be at least 6 characters long'
          break
        case 'Invalid email':
          this.errors.email = 'Please enter a valid email address'
          break
        default:
          this.errors.general = error.message || 'Failed to create account. Please try again.'
      }
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
        this.$forceUpdate()
      }
    },

    clearAllErrors() {
      this.errors = {}
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-logo {
  margin-bottom: 24px;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interview-part {
  background: #0a66c2;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 700;
}

.signal-part {
  color: #0a66c2;
  font-weight: 700;
  font-size: inherit;
  margin-left: 6px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.auth-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  font-size: 16px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.auth-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.auth-input.error .el-input__inner {
  border-color: #ef4444;
  background: #fef2f2;
}

.error-message {
  font-size: 14px;
  color: #ef4444;
  margin-top: 4px;
}

.password-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.general-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
}

.error-icon {
  font-size: 16px;
}

.error-text {
  font-size: 14px;
  line-height: 1.4;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
}

.success-icon {
  font-size: 16px;
}

.success-text {
  font-size: 14px;
  line-height: 1.4;
}

.auth-button {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  margin-top: 8px;
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(10, 102, 194, 0.3);
}

.auth-footer {
  text-align: center;
  margin-top: 32px;
}

.auth-link-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.auth-link {
  color: #0a66c2;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .auth-container {
    padding: 16px;
  }
  
  .auth-card {
    padding: 32px 24px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .auth-title {
    font-size: 24px;
  }
}
</style>