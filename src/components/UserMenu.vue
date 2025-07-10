<template>
  <div class="user-menu">
    <el-dropdown @command="handleCommand" trigger="click">
      <div class="user-avatar-section">
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.user_metadata?.full_name || 'User' }}</div>
          <div class="user-role">{{ user.user_metadata?.current_role || 'Member' }}</div>
        </div>
        <i class="el-icon-arrow-down user-dropdown-icon"></i>
      </div>
      
      <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
        <el-dropdown-item command="profile" class="dropdown-item">
          <i class="el-icon-user"></i>
          <span>Profile Settings</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="preferences" class="dropdown-item">
          <i class="el-icon-setting"></i>
          <span>Preferences</span>
        </el-dropdown-item>
        
        <el-dropdown-item v-if="isAdmin" command="admin" class="dropdown-item admin-item">
          <i class="el-icon-key"></i>
          <span>Admin Panel</span>
        </el-dropdown-item>
        
        <el-dropdown-item divided command="signout" class="dropdown-item signout-item">
          <i class="el-icon-switch-button"></i>
          <span>Sign Out</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { authHelpers } from '@/utils/supabase'

export default {
  name: 'UserMenu',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    userInitials() {
      const name = this.user.user_metadata?.full_name || this.user.email || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    isAdmin() {
      return authHelpers.isAdmin(this.user)
    }
  },
  methods: {
    async handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/customize')
          break
        case 'preferences':
          this.$router.push('/setting')
          break
        case 'admin':
          this.$emit('show-admin')
          break
        case 'signout':
          await this.handleSignOut()
          break
      }
    },

    async handleSignOut() {
      try {
        const { error } = await authHelpers.signOut()
        if (error) {
          this.$message.error('Error signing out: ' + error.message)
          return
        }
        
        this.$message.success('Successfully signed out')
        this.$emit('signed-out')
      } catch (error) {
        console.error('Sign out error:', error)
        this.$message.error('An error occurred while signing out')
      }
    }
  }
}
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.user-avatar-section:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-dropdown-icon {
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.user-avatar-section:hover .user-dropdown-icon {
  transform: rotate(180deg);
}
</style>

<style>
.user-dropdown-menu {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 8px;
}

.user-dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.user-dropdown-menu .dropdown-item:hover {
  background: #f8fafc;
  color: #0a66c2;
}

.user-dropdown-menu .admin-item {
  color: #8b5cf6;
}

.user-dropdown-menu .admin-item:hover {
  background: #f3f4f6;
  color: #7c3aed;
}

.user-dropdown-menu .signout-item {
  color: #dc2626;
}

.user-dropdown-menu .signout-item:hover {
  background: #fef2f2;
  color: #b91c1c;
}
</style>