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
            <div class="stat-number">{{ referralCodes.length }}</div>
            <div class="stat-label">Referral Codes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeReferralCodes.length }}</div>
            <div class="stat-label">Active Codes</div>
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
          placeholder="Search users or referral codes..."
          prefix-icon="el-icon-search"
          class="search-input"
          clearable
        />
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="showCreateReferralModal = true"
          class="create-button"
        >
          Create Referral Code
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="refreshData"
          class="refresh-button"
        >
          Refresh
        </el-button>
      </div>

      <!-- Referral Codes Section -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="el-icon-key"></i>
            Referral Codes ({{ filteredReferralCodes.length }})
          </h3>
          <p class="section-subtitle">Manage registration referral codes</p>
        </div>
        
        <div v-if="filteredReferralCodes.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-key"></i>
          </div>
          <p class="empty-text">No referral codes created</p>
        </div>
        
        <div v-else class="referral-grid">
          <div 
            v-for="code in filteredReferralCodes" 
            :key="code.id" 
            class="referral-card"
            :class="{ used: code.used, inactive: !code.active }"
          >
            <div class="referral-info">
              <div class="referral-code">{{ code.code }}</div>
              <div class="referral-details">
                <div class="referral-status">
                  <span v-if="code.used" class="status-badge used">Used</span>
                  <span v-else-if="code.active" class="status-badge active">Active</span>
                  <span v-else class="status-badge inactive">Inactive</span>
                </div>
                <div class="referral-meta">
                  <div class="meta-item">Created: {{ formatDate(code.createdAt) }}</div>
                  <div class="meta-item" v-if="code.used">Used: {{ formatDate(code.usedAt) }}</div>
                  <div class="meta-item" v-if="code.description">{{ code.description }}</div>
                </div>
              </div>
            </div>
            <div class="referral-actions">
              <el-button 
                v-if="!code.used"
                :type="code.active ? 'warning' : 'success'"
                size="small" 
                @click="toggleReferralCode(code)"
                :loading="processingCodes.includes(code.id)"
              >
                <i :class="code.active ? 'el-icon-close' : 'el-icon-check'"></i> 
                {{ code.active ? 'Deactivate' : 'Activate' }}
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="deleteReferralCode(code)"
                :loading="processingCodes.includes(code.id)"
              >
                <i class="el-icon-delete"></i> Delete
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Section -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="el-icon-user"></i>
            Registered Users ({{ filteredUsers.length }})
          </h3>
          <p class="section-subtitle">All registered users</p>
        </div>
        
        <div v-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-user"></i>
          </div>
          <p class="empty-text">No users found</p>
        </div>
        
        <div v-else class="user-grid">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id" 
            class="user-card"
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
                <div class="user-referral" v-if="user.referralCode">Referral: {{ user.referralCode }}</div>
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

    <!-- Create Referral Code Modal -->
    <el-dialog
      :visible.sync="showCreateReferralModal"
      title="Create Referral Code"
      width="400px"
      :close-on-click-modal="false"
      :append-to-body="true"
      custom-class="create-referral-dialog"
    >
      <div class="create-referral-form">
        <div class="form-group">
          <label>Referral Code</label>
          <el-input
            v-model="newReferralCode.code"
            placeholder="Enter custom code or leave blank for auto-generation"
          />
        </div>
        <div class="form-group">
          <label>Description (Optional)</label>
          <el-input
            v-model="newReferralCode.description"
            placeholder="e.g., For beta testers, Marketing campaign"
          />
        </div>
        <div class="form-actions">
          <el-button @click="showCreateReferralModal = false">Cancel</el-button>
          <el-button type="primary" @click="createReferralCode" :loading="creatingCode">
            Create Code
          </el-button>
        </div>
      </div>
    </el-dialog>
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
      processingUsers: [],
      processingCodes: [],
      showCreateReferralModal: false,
      creatingCode: false,
      newReferralCode: {
        code: '',
        description: ''
      }
    }
  },
  computed: {
    allUsers() {
      return this.getUsers()
    },
    
    referralCodes() {
      return JSON.parse(localStorage.getItem('referralCodes') || '[]')
    },
    
    activeReferralCodes() {
      return this.referralCodes.filter(code => code.active && !code.used)
    },
    
    filteredReferralCodes() {
      if (!this.searchQuery) return this.referralCodes
      
      const query = this.searchQuery.toLowerCase()
      return this.referralCodes.filter(code => 
        code.code.toLowerCase().includes(query) ||
        (code.description && code.description.toLowerCase().includes(query))
      )
    },
    
    filteredUsers() {
      if (!this.searchQuery) return this.allUsers
      
      const query = this.searchQuery.toLowerCase()
      return this.allUsers.filter(user => 
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
      if (!name) return 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    async createReferralCode() {
      this.creatingCode = true
      
      try {
        let code = this.newReferralCode.code.trim()
        
        // Auto-generate code if not provided
        if (!code) {
          code = this.generateReferralCode()
        }
        
        // Check if code already exists
        const existingCodes = this.referralCodes
        if (existingCodes.some(c => c.code === code)) {
          throw new Error('Referral code already exists')
        }
        
        const newCode = {
          id: 'ref-' + Date.now(),
          code: code,
          description: this.newReferralCode.description.trim() || '',
          active: true,
          used: false,
          createdAt: new Date().toISOString(),
          usedAt: null
        }
        
        existingCodes.push(newCode)
        localStorage.setItem('referralCodes', JSON.stringify(existingCodes))
        
        this.$message.success(`Referral code "${code}" created successfully!`)
        this.showCreateReferralModal = false
        this.newReferralCode = { code: '', description: '' }
      } catch (error) {
        this.$message.error(error.message || 'Failed to create referral code')
      } finally {
        this.creatingCode = false
      }
    },
    
    generateReferralCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },
    
    async toggleReferralCode(code) {
      this.processingCodes.push(code.id)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const codes = this.referralCodes
        const codeIndex = codes.findIndex(c => c.id === code.id)
        if (codeIndex !== -1) {
          codes[codeIndex].active = !codes[codeIndex].active
          localStorage.setItem('referralCodes', JSON.stringify(codes))
          
          const action = codes[codeIndex].active ? 'activated' : 'deactivated'
          this.$message.success(`Referral code ${action} successfully`)
        }
      } catch (error) {
        this.$message.error('Failed to update referral code')
      } finally {
        this.processingCodes = this.processingCodes.filter(id => id !== code.id)
      }
    },
    
    async deleteReferralCode(code) {
      this.$confirm(
        `Delete referral code "${code.code}"? This action cannot be undone.`,
        'Delete Referral Code',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error',
          confirmButtonClass: 'el-button--danger'
        }
      ).then(async () => {
        this.processingCodes.push(code.id)
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const codes = this.referralCodes
          const filteredCodes = codes.filter(c => c.id !== code.id)
          localStorage.setItem('referralCodes', JSON.stringify(filteredCodes))
          
          this.$message.success(`Referral code "${code.code}" deleted successfully`)
        } catch (error) {
          this.$message.error('Failed to delete referral code')
        } finally {
          this.processingCodes = this.processingCodes.filter(id => id !== code.id)
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

.user-card.admin {
  border-left: 4px solid #8b5cf6;
  background: #faf5ff;
}

.referral-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.referral-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  border-left: 4px solid #22c55e;
}

.referral-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.referral-card.used {
  border-left-color: #6b7280;
  background: #f9fafb;
}

.referral-card.inactive {
  border-left-color: #f59e0b;
  background: #fefbf3;
}

.referral-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.referral-code {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #1e293b;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
}

.referral-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.referral-status {
  display: flex;
  justify-content: center;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.used {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.inactive {
  background: #fef3c7;
  color: #f59e0b;
}

.referral-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.referral-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.create-button {
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
}

.create-referral-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.create-referral-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.create-referral-form label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

.user-referral {
  font-size: 11px;
  color: #16a34a;
  font-weight: 500;
  font-family: 'Courier New', monospace;
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

.create-referral-dialog .el-dialog {
  border-radius: 12px;
  z-index: 3000;
}

.create-referral-dialog .el-dialog__header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 20px;
}

.create-referral-dialog .el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.create-referral-dialog .el-dialog__body {
  padding: 20px;
}
</style>