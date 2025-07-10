<template>
  <div class="profile-workspace">
    <!-- Profile Sections -->
    <div class="profile-grid">
      <!-- Resume Section -->
      <div class="profile-card resume-card">
        <div class="card-header">
          <div class="card-icon resume-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">Resume & Experience</h3>
            <p class="card-subtitle">Your professional background and achievements</p>
          </div>
          <div class="card-stats">
            <span class="char-count">{{ resumeText.length }} chars</span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="input-section">
            <div class="input-wrapper">
              <el-input
                type="textarea"
                v-model="resumeText"
                @input="onResumeTextChange"
                placeholder="Paste your complete resume here...

Include:
• Work experience and achievements
• Technical skills and certifications  
• Education background
• Notable projects and contributions
• Any relevant accomplishments

The more detailed your resume, the better the AI can provide personalized coaching advice."
                class="resume-textarea"
                :autosize="{ minRows: 12, maxRows: 20 }"
              />
            </div>
            
            <div class="input-tip">
              <div class="tip-icon">
                <i class="el-icon-info"></i>
              </div>
              <p class="tip-text">
                Your resume will be used to provide personalized interview coaching and suggest relevant talking points based on your experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Information Section -->
      <div class="profile-card job-card">
        <div class="card-header">
          <div class="card-icon job-icon">
            <i class="el-icon-suitcase"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">Target Position</h3>
            <p class="card-subtitle">Details about the role you're interviewing for</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="job-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Job Title</label>
                <el-input 
                  v-model="jobInfo.position" 
                  @input="onJobInfoChange"
                  placeholder="e.g., Senior Software Engineer"
                  class="modern-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <el-input 
                  v-model="jobInfo.company" 
                  @input="onJobInfoChange"
                  placeholder="e.g., Google, Microsoft, etc."
                  class="modern-input"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Job Description</label>
              <el-input
                type="textarea"
                v-model="jobInfo.description"
                @input="onJobInfoChange"
                placeholder="Paste the complete job description here..."
                :autosize="{ minRows: 4, maxRows: 8 }"
                class="modern-textarea"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Key Requirements</label>
              <el-input
                type="textarea"
                v-model="jobInfo.requirements"
                @input="onJobInfoChange"
                placeholder="List the key requirements and qualifications..."
                :autosize="{ minRows: 3, maxRows: 6 }"
                class="modern-textarea"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Responsibilities</label>
                <el-input
                  type="textarea"
                  v-model="jobInfo.responsibilities"
                  @input="onJobInfoChange"
                  placeholder="Main responsibilities and duties..."
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  class="modern-textarea"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Qualifications</label>
                <el-input
                  type="textarea"
                  v-model="jobInfo.qualifications"
                  @input="onJobInfoChange"
                  placeholder="Required qualifications, skills, experience..."
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  class="modern-textarea"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Additional Notes</label>
              <el-input
                type="textarea"
                v-model="jobInfo.notes"
                @input="onJobInfoChange"
                placeholder="Any additional notes or information about the role..."
                :autosize="{ minRows: 2, maxRows: 4 }"
                class="modern-textarea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Center -->
    <div class="action-center">
      <div class="action-content">
        <div class="action-info">
          <h4 class="action-title">Profile Status</h4>
          <p class="action-description">
            {{ isDataValid ? 'Your profile is complete and ready for personalized coaching!' : 'Add your resume and job details to enable personalized coaching.' }}
          </p>
        </div>
        
        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large"
            @click="saveCustomization"
            :disabled="!isDataValid"
            class="save-button"
          >
            <i class="el-icon-check"></i>
            <span>Save Profile</span>
          </el-button>
          
          <el-button 
            type="danger" 
            size="large"
            plain
            @click="clearAllData"
            class="clear-button"
          >
            <i class="el-icon-delete"></i>
            <span>Clear All</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Status Notification -->
    <div v-if="savedStatus" class="status-notification">
      <div class="notification-content" :class="savedStatus.type">
        <div class="notification-icon">
          <i :class="savedStatus.type === 'success' ? 'el-icon-check' : 'el-icon-warning'"></i>
        </div>
        <div class="notification-text">
          <div class="notification-title">{{ savedStatus.title }}</div>
          <div class="notification-message">{{ savedStatus.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Customize',
  data() {
    return {
      resumeText: '',
      jobInfo: {
        position: '',
        company: '',
        description: '',
        requirements: '',
        responsibilities: '',
        qualifications: '',
        notes: ''
      },
      savedStatus: null
    }
  },
  computed: {
    isDataValid() {
      const hasResume = this.resumeText.trim().length > 50;
      const hasJobInfo = this.jobInfo.position.trim() || this.jobInfo.description.trim();
      return hasResume && hasJobInfo;
    }
  },
  mounted() {
    this.loadSavedData();
  },
  methods: {
    onResumeTextChange() {
      this.saveToLocalStorage();
    },
    
    onJobInfoChange() {
      this.saveToLocalStorage();
    },
    
    saveCustomization() {
      const customizationData = {
        resume: this.resumeText,
        jobInfo: this.jobInfo,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('interview_customization', JSON.stringify(customizationData));
      
      this.savedStatus = {
        title: 'Profile Saved Successfully!',
        type: 'success',
        description: 'Your resume and job information have been saved. The AI coach will now provide personalized responses based on this information.'
      };
      
      setTimeout(() => {
        this.savedStatus = null;
      }, 5000);
    },
    
    clearAllData() {
      this.$confirm('This will permanently delete all your profile data. Continue?', 'Clear Profile Data', {
        confirmButtonText: 'Yes, Clear All',
        cancelButtonText: 'Cancel',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }).then(() => {
        this.resumeText = '';
        this.jobInfo = {
          position: '',
          company: '',
          description: '',
          requirements: '',
          responsibilities: '',
          qualifications: '',
          notes: ''
        };
        localStorage.removeItem('interview_customization');
        this.$message.success('All profile data cleared successfully');
      }).catch(() => {
        // User cancelled
      });
    },
    
    loadSavedData() {
      const saved = localStorage.getItem('interview_customization');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.resume) {
            this.resumeText = data.resume;
          }
          if (data.jobInfo) {
            this.jobInfo = { ...this.jobInfo, ...data.jobInfo };
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    },
    
    saveToLocalStorage() {
      // Auto-save functionality
      const customizationData = {
        resume: this.resumeText,
        jobInfo: this.jobInfo,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('interview_customization', JSON.stringify(customizationData));
    }
  }
}
</script>

<style scoped>
.profile-workspace {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.resume-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.job-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
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

.card-stats {
  display: flex;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.card-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.input-wrapper {
  flex: 1;
}

.resume-textarea .el-textarea__inner {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
  background: #f8fafc;
  resize: vertical;
}

.resume-textarea .el-textarea__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.input-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #e7f3ff;
  border: 1px solid #0a66c2;
  border-radius: 12px;
}

.tip-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a66c2;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-text {
  font-size: 13px;
  color: #004182;
  margin: 0;
  line-height: 1.5;
}

.job-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.modern-input .el-input__inner {
  height: 44px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 0 14px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.modern-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.modern-textarea .el-textarea__inner {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease;
  background: #f8fafc;
  resize: vertical;
}

.modern-textarea .el-textarea__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.action-center {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  padding: 32px;
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.action-info {
  flex: 1;
}

.action-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.action-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.save-button {
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-button {
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #ef4444;
  color: #ef4444;
}

.clear-button:hover {
  background: #d93025;
  color: white;
}

.status-notification {
  position: fixed;
  top: 100px;
  right: 32px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #0a66c2;
  min-width: 320px;
}

.notification-content.error {
  border-left-color: #ef4444;
}

.notification-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a66c2;
  font-size: 16px;
}

.notification-content.error .notification-icon {
  color: #ef4444;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-workspace {
    gap: 24px;
  }
  
  .card-header {
    padding: 20px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .action-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .save-button, .clear-button {
    width: 100%;
    justify-content: center;
  }
  
  .status-notification {
    right: 16px;
    left: 16px;
  }
  
  .notification-content {
    min-width: auto;
  }
}
</style>