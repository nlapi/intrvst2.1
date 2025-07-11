<template>
  <div class="user-menu">
    <el-dropdown @command="handleCommand" trigger="click" class="user-dropdown">
      <div class="user-avatar-button">
        <div class="user-avatar">
          {{ getUserInitials() }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ getUserDisplayName() }}</div>
          <div class="user-role">{{ getUserRole() }}</div>
        </div>
        <i class="el-icon-arrow-down user-arrow"></i>
      </div>
      
      <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
        <el-dropdown-item command="profile" class="dropdown-item">
          <i class="el-icon-user"></i>
          <span>Profile Settings</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="customize" class="dropdown-item">
          <i class="el-icon-edit"></i>
          <span>Customize Profile</span>
        </el-dropdown-item>
        
        <el-dropdown-item 
          v-if="isAdmin" 
          command="settings" 
          class="dropdown-item"
        >
          <i class="el-icon-setting"></i>
          <span>Settings</span>
        </el-dropdown-item>
        
        <el-dropdown-item 
          v-if="isAdmin" 
          command="admin" 
          class="dropdown-item admin-item"
          divided
        >
          <i class="el-icon-key"></i>
          <span>Admin Panel</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="signout" class="dropdown-item signout-item" divided>
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
    isAdmin() {
      return authHelpers.isAdmin(this.user)
    }
  },
  methods: {
    getUserInitials() {
      const displayName = this.getUserDisplayName()
      if (!displayName) return 'U'
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    
    getUserDisplayName() {
      if (this.user.fullName) return this.user.fullName
      if (this.user.user_metadata && this.user.user_metadata.full_name) return this.user.user_metadata.full_name
      if (this.user.email) return this.user.email
      return 'Unknown User'
    },
    
    getUserRole() {
      if (this.user.role) return this.user.role
      if (this.user.user_metadata && this.user.user_metadata.current_role) return this.user.user_metadata.current_role
      if (this.isAdmin) return 'Administrator'
      return 'User'
    },
    
    handleCommand(command) {
      switch (command) {
        case 'profile':
          if (this.$route.path !== '/customize') {
            this.$router.push('/customize')
          }
          break
        case 'customize':
          if (this.$route.path !== '/customize') {
            this.$router.push('/customize')
          }
          break
        case 'settings':
          if (this.$route.path !== '/setting') {
            this.$router.push('/setting')
          }
          break
        case 'admin':
          this.$emit('show-admin')
          break
        case 'signout':
          this.$emit('signed-out')
          break
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

.user-dropdown {
  cursor: pointer;
}

.user-avatar-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  min-height: 52px;
}

.user-avatar-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(10, 102, 194, 0.2);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  line-height: 1.2;
  margin-top: 2px;
}

.user-arrow {
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 4px;
}

.user-dropdown.el-dropdown--active .user-arrow {
  transform: rotate(180deg);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 180px;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #0a66c2;
}

.dropdown-item i {
  font-size: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-item {
  color: #8b5cf6;
}

.admin-item:hover {
  background: #faf5ff;
  color: #7c3aed;
}

.signout-item {
  color: #ef4444;
}

.signout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-info {
    display: none;
  }
  
  .user-avatar-button {
    padding: 8px;
    gap: 0;
  }
}
</style>

<style>
.user-dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 8px 0;
  min-width: 220px;
  width: max-content;
  max-width: 280px;
  margin-top: 8px;
}

.user-dropdown-menu .el-dropdown-menu__item {
  padding: 0;
  line-height: normal;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown-menu .el-dropdown-menu__item:hover {
  background: transparent;
}

.user-dropdown-menu .el-dropdown-menu__item.is-divided {
  border-top: 1px solid #e2e8f0;
  margin-top: 8px;
  padding-top: 8px;
}
</style>