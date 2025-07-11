<template>
  <div class="admin-workspace">
    <!-- Admin Header -->
    <div class="admin-header-section">
      <div class="header-content">
        <div class="header-info">
          <h2 class="page-title">Admin Panel</h2>
          <p class="page-subtitle">Manage users and system administration</p>
        </div>
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
    </div>

    <!-- Search and Controls -->
    <div class="admin-controls-section">
      <div class="controls-content">
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
    </div>

    <!-- Admin Sections -->
    <div class="admin-sections">
      <!-- Pending Approvals Section -->
      <div class="admin-card">
        <div class="card-header">
          <div class="card-icon pending-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">Pending Approvals</h3>
            <p class="card-subtitle">Users waiting for admin approval ({{ filteredPendingUsers.length }})</p>
          </div>
        </div>
        
        <div class="card-content">
          <div v-if="filteredPendingUsers.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="el-icon-check"></i>
            </div>
            <h4 class="empty-title">No Pending Approvals</h4>
            <p class="empty-description">All users have been processed</p>
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
      </div>

      <!-- Approved Users Section -->
      <div class="admin-card">
        <div class="card-header">
          <div class="card-icon approved-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">Approved Users</h3>
            <p class="card-subtitle">Active users with platform access ({{ filteredApprovedUsers.length }})</p>
          </div>
        </div>
        
        <div class="card-content">
          <div v-if="filteredApprovedUsers.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="el-icon-user"></i>
            </div>
            <h4 class="empty-title">No Approved Users</h4>
            <p class="empty-description">No approved users found</p>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
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
.admin-workspace {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;
}

.admin-header-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.header-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-info {
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #0a66c2;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.admin-controls-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.controls-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  flex: 1;
}

.search-input .el-input__inner {
  height: 44px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  font-size: 15px;
}

.search-input .el-input__inner:focus {
  border-color: #0a66c2;
  background: white;
}

.refresh-button {
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  font-weight: 600;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.pending-icon {
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.approved-icon {
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.card-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.card-content {
  padding: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #64748b;
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
  background: #f8fafc;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .user-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-workspace {
    gap: 24px;
  }
  
  .header-content {
    padding: 24px;
  }
  
  .admin-stats {
    grid-template-columns: 1fr;
  }
  
  .controls-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .refresh-button {
    width: 100%;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-content {
    padding: 20px;
  }
}
</style>