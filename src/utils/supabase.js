// Supabase client configuration and authentication helpers
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY || 'your-anon-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://your-project.supabase.co' && 
                            supabaseKey !== 'your-anon-key' &&
                            supabaseUrl.includes('supabase.co')

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null

// Authentication helper functions
export const authHelpers = {
  // Check if Supabase is configured
  isConfigured() {
    return isSupabaseConfigured
  },

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    if (!isSupabaseConfigured) {
      // Fallback to mock authentication
      return this.mockSignUp(email, password, userData)
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { data: { user: data.user, session: data.session }, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      // Fallback to mock authentication
      return this.mockSignIn(email, password)
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data: { user: data.user, session: data.session }, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // Sign out
  async signOut() {
    if (!isSupabaseConfigured) {
      // Fallback to mock sign out
      localStorage.removeItem('currentUser')
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Get current user
  async getCurrentUser() {
    if (!isSupabaseConfigured) {
      // Fallback to mock user
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          if (userData.expiresAt && Date.now() < userData.expiresAt) {
            // Load users from localStorage to get latest data
            const savedUsers = localStorage.getItem('mockUsers')
            const allUsers = savedUsers ? JSON.parse(savedUsers) : []
            const user = allUsers.find(u => u.id === userData.id)
            return user || null
          }
        } catch (error) {
          console.error('Error loading saved user:', error)
          localStorage.removeItem('currentUser')
        }
      }
      return null
    }

    try {
      const { data } = await supabase.auth.getUser()
      return data.user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  // Get current session
  async getCurrentSession() {
    if (!isSupabaseConfigured) {
      return null
    }

    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    return supabase.auth.onAuthStateChange(callback)
  },

  // Check if user is admin
  isAdmin(user) {
    if (!user) return false
    return user.isAdmin || 
           (user.user_metadata && user.user_metadata.isAdmin) ||
           user.email === 'nisjet.lapi@gmail.com'
  },

  // Mock authentication methods for fallback
  async mockSignUp(email, password, userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get existing users
    const savedUsers = localStorage.getItem('mockUsers')
    const allUsers = savedUsers ? JSON.parse(savedUsers) : []
    
    // Check if user already exists
    if (allUsers.some(u => u.email === email)) {
      throw new Error('User already registered')
    }
    
    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      email,
      password, // In real app, this would be hashed
      fullName: userData.full_name || '',
      role: userData.current_role || '',
      company: userData.company || '',
      referralCode: userData.referral_code || '',
      status: userData.status || 'approved',
      isAdmin: false,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      user_metadata: userData
    }
    
    allUsers.push(newUser)
    localStorage.setItem('mockUsers', JSON.stringify(allUsers))
    
    return { data: { user: newUser, session: null }, error: null }
  },

  async mockSignIn(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get existing users
    const savedUsers = localStorage.getItem('mockUsers')
    const allUsers = savedUsers ? JSON.parse(savedUsers) : []
    
    // Find user
    const user = allUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid login credentials')
    }
    
    return { data: { user, session: null }, error: null }
  }
}

export default supabase