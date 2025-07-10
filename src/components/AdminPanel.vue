<template>
  <el-dialog
    :visible.sync="visible"
    title="Admin Panel"
    width="800px"
    :close-on-click-modal="false"
    custom-class="admin-modal"
  >
    <div class="admin-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="admin-icon">
          <i class="el-icon-key"></i>
        </div>
        <div class="admin-info">
          <h3 class="admin-title">User Management</h3>
          <p class="admin-subtitle">Manage registered users and their access</p>
        </div>
        <div class="admin-stats">
          <div class="stat-item">
            <div class="stat-number">{{ users.length }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="admin-controls">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search users by email or name..."
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
          />
        </div>
        <div class="filter-section">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="loadUsers"
            :loading="loading"
            class="refresh-button"
          >
            Refresh
          </el-button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-section">
        <div v-if="loading" class="loading-state">
          <i class="el-icon-loading"></i>
          <span>Loading users...</span>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-user"></i>
          </div>
          <h4 class="empty-title">No Users Found</h4>
          <p class="empty-description">
            {{ searchQuery ? 'No users match your search criteria.' : 'No users have registered yet.' }}
          </p>
        </div>

        <div v-else class="users-table">
          <div class="table-header">
            <div class="header-cell user-col">User</div>
            <div class="header-cell email-col">Email</div>
            <div class="header-cell date-col">Joined</div>
            <div class="header-cell status-col">Status</div>
            <div class="header-cell actions-col">Actions</div>
          </div>

          <div class="table-body">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="table-row"
              :class="{ 'admin-row': isUserAdmin(user) }"
            >
              <div class="table-cell user-col">
                <div class="user-info">
                  <div class="user-avatar">
                    <span class="avatar-text">{{ getUserInitials(user) }}</span>
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.user_metadata?.full_name || 'Unknown' }}</div>
                    <div class="user-role">{{ user.user_metadata?.current_role || 'Member' }}</div>
                  </div>
                </div>
              </div>

              <div class="table-cell email-col">
                <div class="email-info">
                  <span class="email-text">{{ user.email }}</span>
                  <span v-if="isUserAdmin(user)" class="admin-badge">ADMIN</span>
                </div>
              </div>

              <div class="table-cell date-col">
                <span class="date-text">{{ formatDate(user.created_at) }}</span>
              </div>

              <div class="table-cell status-col">
                <div class="status-badge" :class="getStatusClass(user)">
                  <div class="status-dot"></div>
                  <span class="status-text">{{ getStatusText(user) }}</span>
                </div>
              </div>

              <div class="table-cell actions-col">
                <div class="action-buttons">
                  <el-button
                    v-if="!isUserAdmin(user)"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="confirmDeleteUser(user)"
                    :loading="deletingUsers.includes(user.id)"
                    class="delete-button"
                  >
                    Delete
                  </el-button>
                  <span v-else class="protected-text">Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { supabase, authHelpers } from '@/utils/supabase'

export default {
  name: 'AdminPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      users: [],
      loading: false,
      searchQuery: '',
      deletingUsers: []
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users
      
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.email.toLowerCase().includes(query) ||
        (user.user_metadata?.full_name || '').toLowerCase().includes(query)
      )
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadUsers()
      }
    }
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        // Note: In a real app, you'd need a server-side endpoint to list users
        // as the Supabase client doesn't allow listing all users for security
        // For demo purposes, we'll show a placeholder
        this.users = [
          {
            id: '1',
            email: 'nisjet.lapi@gmail.com',
            created_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              full_name: 'Admin User',
              current_role: 'Administrator'
            }
          }
        ]
      } catch (error) {
        console.error('Error loading users:', error)
        this.$message.error('Failed to load users')
      } finally {
        this.loading = false
      }
    },

    isUserAdmin(user) {
      return authHelpers.isAdmin(user)
    },

    getUserInitials(user) {
      const name = user.user_metadata?.full_name || user.email || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    getStatusClass(user) {
      return user.email_confirmed_at ? 'status-active' : 'status-pending'
    },

    getStatusText(user) {
      return user.email_confirmed_at ? 'Active' : 'Pending'
    },

    confirmDeleteUser(user) {
      this.$confirm(
        `This will permanently delete the user "${user.email}". Continue?`,
        'Delete User',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      ).then(() => {
        this.deleteUser(user)
      }).catch(() => {
        // User cancelled
      })
    },

    async deleteUser(user) {
      this.deletingUsers.push(user.id)
      
      try {
        // Note: In a real app, you'd need a server-side endpoint to delete users
        // as the Supabase client doesn't allow deleting other users for security
        // For demo purposes, we'll simulate the deletion
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.users = this.users.filter(u => u.id !== user.id)
        this.$message.success(`User ${user.email} has been deleted`)
      } catch (error) {
        console.error('Error deleting user:', error)
        this.$message.error('Failed to delete user')
      } finally {
        this.deletingUsers = this.deletingUsers.filter(id => id !== user.id)
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.admin-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.admin-info {
  flex: 1;
}

.admin-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.admin-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.admin-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #0a66c2;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.admin-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-section {
  flex: 1;
}

.search-input .el-input__inner {
  height: 40px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
}

.search-input .el-input__inner:focus {
  border-color: #0a66c2;
  background: white;
}

.refresh-button {
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #64748b;
}

.loading-state {
  gap: 12px;
}

.loading-state i {
  font-size: 24px;
  animation: spin 1s linear infinite;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon i {
  font-size: 28px;
  color: #94a3b8;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.users-table {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-cell {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.admin-row {
  background: #fef3e2;
  border-left: 4px solid #f59e0b;
}

.admin-row:hover {
  background: #fef3e2;
}

.table-cell {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.user-details {
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
}

.user-role {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.email-text {
  font-size: 14px;
  color: #374151;
}

.admin-badge {
  font-size: 10px;
  font-weight: 700;
  color: #f59e0b;
  background: #fef3e2;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

.date-text {
  font-size: 14px;
  color: #64748b;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #f0fdf4;
  color: #16a34a;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.delete-button {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border-radius: 6px;
}

.protected-text {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<style>
.admin-modal .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.admin-modal .el-dialog__header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.admin-modal .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.admin-modal .el-dialog__body {
  padding: 24px;
}
</style>