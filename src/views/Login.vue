<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-logo">
          <h1 class="brand-title">
            <span class="interview-part">Interview</span><span class="signal-part">Signal</span>
          </h1>
        </div>
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
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
            placeholder="Enter your password"
            class="auth-input"
            :class="{ error: errors.password }"
            @input="clearError('password')"
            show-password
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <div v-if="errors.general" class="general-error">
          <div class="error-icon">
            <i class="el-icon-warning"></i>
          </div>
          <div class="error-text">{{ errors.general }}</div>
        </div>

        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
          class="auth-button"
          size="large"
        >
          <span v-if="!loading">Sign In</span>
          <span v-else>Signing In...</span>
        </el-button>
      </form>

      <div class="auth-footer">
        <p class="auth-link-text">
          Don't have an account?
          <router-link to="/signup" class="auth-link">Sign up here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { signIn } from '../utils/supabase'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async handleLogin() {
      this.clearAllErrors()
      
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        const { data, error } = await signIn(this.email, this.password)
        
        if (error) {
          this.handleAuthError(error)
        } else if (data.user) {
          this.$router.push('/')
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
      }

      return isValid
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    handleAuthError(error) {
      switch (error.message) {
        case 'Invalid login credentials':
          this.errors.general = 'Invalid email or password. Please check your credentials and try again.'
          break
        case 'Email not confirmed':
          this.errors.general = 'Please confirm your email address before signing in.'
          break
        case 'Too many requests':
          this.errors.general = 'Too many login attempts. Please wait a moment and try again.'
          break
        default:
          this.errors.general = error.message || 'Failed to sign in. Please try again.'
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