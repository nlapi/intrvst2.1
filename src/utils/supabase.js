import { createClient } from '@supabase/supabase-js'

// Check if Supabase environment variables are properly configured
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// Create Supabase client - will be null if env vars not set
export const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Auth helpers
export const authHelpers = {
  async signUp(email, password, userData = {}) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    if (!supabase) {
      return null
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async updateProfile(updates) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  },

  isAdmin(user) {
    return user?.email === 'nisjet.lapi@gmail.com'
  },

  // Check if Supabase is configured
  isConfigured() {
    return !!supabase
  }
}