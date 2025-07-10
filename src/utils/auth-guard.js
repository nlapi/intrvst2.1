import { authHelpers } from './supabase'

export const requireAuth = async () => {
  const user = await authHelpers.getCurrentUser()
  return !!user
}

export const requireAdmin = async () => {
  const user = await authHelpers.getCurrentUser()
  return user && authHelpers.isAdmin(user)
}

export const redirectIfNotAuthenticated = async (router) => {
  const isAuthenticated = await requireAuth()
  if (!isAuthenticated) {
    // Don't redirect, just return false to show auth modal
    return false
  }
  return true
}