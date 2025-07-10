<template>
  <div id="app">
    <div v-if="!isAuthPage" class="app-header">
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
            to="/pricing" 
            class="nav-link"
            :class="{ active: $router.currentRoute.path === '/pricing' }"
          >
            <div class="nav-icon">
              <i class="el-icon-coin"></i>
            </div>
            <span class="nav-text">Pricing</span>
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
          
          <div class="nav-divider"></div>
          
          <button @click="handleSignOut" class="nav-link logout-link">
            <div class="nav-icon">
              <i class="el-icon-switch-button"></i>
            </div>
            <span class="nav-text">Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
    
    <main class="app-main" :class="{ 'auth-main': isAuthPage }">
      <SubscriptionStatus v-if="!isAuthPage && user" />
      <router-view/>
    </main>
  </div>
</template>

<script>
import { supabase, signOut } from './utils/supabase'
import SubscriptionStatus from './components/SubscriptionStatus.vue'

export default {
  name: 'App',
  components: {
    SubscriptionStatus
  },
  data() {
    return {
      user: null
    }
  },
  computed: {
    isAuthPage() {
      return ['/login', '/signup'].includes(this.$route.path)
    }
  },
  async mounted() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    this.user = session?.user || null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null
      
      if (event === 'SIGNED_IN') {
        this.$router.push('/')
      } else if (event === 'SIGNED_OUT') {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut()
      } catch (error) {
        console.error('Error signing out:', error)
      }
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
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
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

.nav-divider {
  width: 1px;
  height: 32px;
  background: #e2e8f0;
  margin: 0 8px;
}

.logout-link:hover {
  color: #ef4444;
  background: #fef2f2;
}

.logout-link:hover .nav-icon {
  background: #fecaca;
  color: #ef4444;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.app-main.auth-main {
  max-width: none;
  margin: 0;
  padding: 0;
  min-height: 100vh;
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
}
</style>