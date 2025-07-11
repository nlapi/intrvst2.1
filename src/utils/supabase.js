import { createClient } from '@supabase/supabase-js'

// Check if Supabase environment variables are properly configured
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

// Always create a mock client for development/demo purposes
const mockUsers = [
  {
    id: 'admin-001',
    email: 'nisjet.lapi@gmail.com',
    password: 'Winter202!Winter202!',
    user_metadata: {
      full_name: 'Admin User',
      current_role: 'Administrator',
      company: 'InterviewSignal',
      status: 'approved'
    },
    email_confirmed_at: new Date().toISOString()
  },
  {
    id: 'user-001',
    email: 'john.smith@example.com',
    password: 'password123',
    user_metadata: {
      full_name: 'John Smith',
      current_role: 'Software Engineer',
      company: 'Tech Corp',
      status: 'pending'
    },
    email_confirmed_at: new Date().toISOString()
  }
]

// Create Supabase client - will be null if env vars not set
export const supabase = (supabaseUrl && supabaseKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseKey !== 'your_supabase_anon_key') 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'sb-auth-token',
        flowType: 'pkce'
      }
    })
  : null

// Auth helpers
export const authHelpers = {
  async signUp(email, password, userData = {}) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      return { data, error }
    } else {
      // Mock signup for demo
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        return { data: null, error: { message: 'User already registered' } }
      }
      
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        password,
        user_metadata: {
          ...userData,
          status: 'pending'
        },
        email_confirmed_at: new Date().toISOString()
      }
      
      mockUsers.push(newUser)
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
      
      return { 
        data: { 
          user: newUser,
          session: { access_token: 'mock-token' }
        }, 
        error: null 
      }
    }
  },

  async signIn(email, password) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } else {
      // Mock signin for demo
      const savedUsers = localStorage.getItem('mockUsers')
      const allUsers = savedUsers ? JSON.parse(savedUsers) : mockUsers
      
      const user = allUsers.find(u => u.email === email && u.password === password)
      if (!user) {
        return { data: null, error: { message: 'Invalid email or password' } }
      }
      
      return { 
        data: { 
          user,
          session: { access_token: 'mock-token' }
        }, 
        error: null 
      }
    }
  },

  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      return { error }
    } else {
      // Mock signout
      localStorage.removeItem('currentUser')
      return { error: null }
    }
  },

  async getCurrentUser() {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } else {
      // Mock current user
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          const savedUsers = localStorage.getItem('mockUsers')
          const allUsers = savedUsers ? JSON.parse(savedUsers) : mockUsers
          return allUsers.find(u => u.id === userData.id)
        } catch (error) {
          return null
        }
      }
      return null
    }
  },

  async updateProfile(updates) {
    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      return { data, error }
    } else {
      // Mock update profile
      const currentUser = await this.getCurrentUser()
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          user_metadata: {
            ...currentUser.user_metadata,
            ...updates
          }
        }
        
        const savedUsers = localStorage.getItem('mockUsers')
        const allUsers = savedUsers ? JSON.parse(savedUsers) : mockUsers
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id)
        if (userIndex !== -1) {
          allUsers[userIndex] = updatedUser
          localStorage.setItem('mockUsers', JSON.stringify(allUsers))
        }
        
        return { data: { user: updatedUser }, error: null }
      }
      return { data: null, error: { message: 'No user found' } }
    }
  },

  isAdmin(user) {
    return user?.email === 'nisjet.lapi@gmail.com'
  },

  // Check if Supabase is configured
  isConfigured() {
    return !!supabase
  }
}