<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="Admin Panel - User Management"
    width="900px"
    :close-on-click-modal="false"
    custom-class="admin-dialog"
    @close="$emit('close')"
  >
    <div class="admin-content">
      <!-- Admin Header -->
      <div class="admin-header">
        <div class="admin-stats">
          <div class="stat-card">
            <div class="stat-number">{{ pendingUsers.length }}</div>
            <div class="stat-label">Pending Approval</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ approvedUsers.length }}</div>
            <div class="stat-label">Approved Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ allUsers.length }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
      </div>

      <!-- Search and Controls -->
      <div class="admin-controls">
        <el-input
          v-model="searchQuery"
          placeholder="Search users by name or email..."
          prefix-icon="el-icon-search"
          class="search-input"
          clearable
        />
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="refreshData"
          class="refresh-button"
        >
          Refresh
        </el-button>
      </div>

      <!-- Pending Approvals Section -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="el-icon-time"></i>
            Pending Approvals ({{ filteredPendingUsers.length }})
          </h3>
          <p class="section-subtitle">Users waiting for admin approval</p>
        </div>
        
        <div v-if="filteredPendingUsers.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-check"></i>
          </div>
          <p class="empty-text">No users pending approval</p>
        </div>
        
        <div v-else class="user-grid">
          <div 
            v-for="user in filteredPendingUsers" 
            :key="user.id" 
            class="user-card pending"
          >
            <div class="user-info">
              <div class="user-avatar">{{ getUserInitials(user.fullName) }}</div>
              <div class="user-details">
                <div class="user-name">{{ user.fullName }}</div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ user.role }}</div>
                <div class="user-company" v-if="user.company">{{ user.company }}</div>
                <div class="user-date">Joined {{ formatDate(user.createdAt) }}</div>
              </div>
            </div>
            <div class="user-actions">
              <el-button 
                type="success" 
                size="small" 
                @click="approveUser(user)"
                :loading="processingUsers.includes(user.id)"
              >
                <i class="el-icon-check"></i> Approve
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="rejectUser(user)"
                :loading="processingUsers.includes(user.id)"
              >
                <i class="el-icon-close"></i> Reject
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Approved Users Section -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="el-icon-user"></i>
            Approved Users ({{ filteredApprovedUsers.length }})
          </h3>
          <p class="section-subtitle">Active users with platform access</p>
        </div>
        
        <div v-if="filteredApprovedUsers.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-user"></i>
          </div>
          <p class="empty-text">No approved users found</p>
        </div>
        
        <div v-else class="user-grid">
          <div 
            v-for="user in filteredApprovedUsers" 
            :key="user.id" 
            class="user-card approved"
            :class="{ admin: user.isAdmin }"
          >
            <div class="user-info">
              <div class="user-avatar" :class="{ admin: user.isAdmin }">
                {{ getUserInitials(user.fullName) }}
              </div>
              <div class="user-details">
                <div class="user-name">
                  {{ user.fullName }}
                  <span v-if="user.isAdmin" class="admin-badge">ADMIN</span>
                </div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ user.role }}</div>
                <div class="user-company" v-if="user.company">{{ user.company }}</div>
                <div class="user-date">Joined {{ formatDate(user.createdAt) }}</div>
              </div>
            </div>
            <div class="user-actions">
              <el-button 
                v-if="!user.isAdmin"
                type="danger" 
                size="small" 
                @click="handleDeleteUser(user)"
                :loading="processingUsers.includes(user.id)"
              >
                <i class="el-icon-delete"></i> Delete
              </el-button>
              <span v-else class="protected-text">Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AdminPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  inject: ['getUsers', 'updateUser', 'deleteUser'],
  data() {
    return {
      searchQuery: '',
      processingUsers: []
    }
  },
  computed: {
    allUsers() {
      return this.getUsers()
    },
    
    pendingUsers() {
      return this.allUsers.filter(user => user.status === 'pending')
    },
    
    approvedUsers() {
      return this.allUsers.filter(user => user.status === 'approved')
    },
    
    filteredPendingUsers() {
      if (!this.searchQuery) return this.pendingUsers
      
      const query = this.searchQuery.toLowerCase()
      return this.pendingUsers.filter(user => 
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    },
    
    filteredApprovedUsers() {
      if (!this.searchQuery) return this.approvedUsers
      
      const query = this.searchQuery.toLowerCase()
      return this.approvedUsers.filter(user => 
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    },
    
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    getUserInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    async approveUser(user) {
      this.processingUsers.push(user.id)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.updateUser(user.id, { status: 'approved' })
        this.$message.success(`${user.fullName} has been approved!`)
      } catch (error) {
        this.$message.error('Failed to approve user')
      } finally {
        this.processingUsers = this.processingUsers.filter(id => id !== user.id)
      }
    },
    
    async rejectUser(user) {
      this.$confirm(
        `Reject ${user.fullName}'s application? They will not be able to access the platform.`,
        'Reject User Application',
        {
          confirmButtonText: 'Reject',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      ).then(async () => {
        this.processingUsers.push(user.id)
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.updateUser(user.id, { status: 'rejected' })
          this.$message.success(`${user.fullName}'s application has been rejected`)
        } catch (error) {
          this.$message.error('Failed to reject user')
        } finally {
          this.processingUsers = this.processingUsers.filter(id => id !== user.id)
        }
      })
    },
    
    async handleDeleteUser(user) {
      if (user.isAdmin) {
        this.$message.error('Cannot delete admin accounts')
        return
      }
      
      this.$confirm(
        `Permanently delete ${user.fullName}? This action cannot be undone.`,
        'Delete User Account',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error',
          confirmButtonClass: 'el-button--danger'
        }
      ).then(async () => {
        this.processingUsers.push(user.id)
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.deleteUser(user.id)
          this.$message.success(`${user.fullName} has been deleted`)
          this.$emit('user-deleted')
        } catch (error) {
          this.$message.error('Failed to delete user')
        } finally {
          this.processingUsers = this.processingUsers.filter(id => id !== user.id)
        }
      })
    },
    
    refreshData() {
      this.$message.success('Data refreshed')
    }
  }
}
</script>

<style scoped>
.admin-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.admin-header {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #0a66c2;
  margin-bottom: 4px;
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

.search-input {
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

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.section-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.empty-icon i {
  font-size: 20px;
  color: #94a3b8;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.user-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.user-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.user-card.pending {
  border-left: 4px solid #f59e0b;
  background: #fefbf3;
}

.user-card.approved {
  border-left: 4px solid #22c55e;
  background: #f0fdf4;
}

.user-card.admin {
  border-left: 4px solid #8b5cf6;
  background: #faf5ff;
}

.user-info {
  display: flex;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.user-avatar.admin {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-badge {
  font-size: 10px;
  font-weight: 700;
  color: #8b5cf6;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.user-email {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 2px;
}

.user-role {
  font-size: 13px;
  color: #0a66c2;
  font-weight: 500;
  margin-bottom: 2px;
}

.user-company {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.user-date {
  font-size: 11px;
  color: #94a3b8;
}

.user-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.protected-text {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
  align-self: center;
}
</style>

<style>
.admin-dialog .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.admin-dialog .el-dialog__header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.admin-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.admin-dialog .el-dialog__body {
  padding: 24px;
}
</style>