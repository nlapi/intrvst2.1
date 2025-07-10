<template>
  <div class="customize-container">
<template>
  <div class="customize-container">
    <div class="modern-page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="header-text">
          <h1 class="header-title">Build Your Profile</h1>
          <p class="header-subtitle">Add your resume and job details for personalized interview coaching</p>
        </div>
      </div>
    </div>

    <div class="profile-sections">
      <!-- Resume Section -->
      <div class="modern-card">
        <div class="card-header">
          <div class="card-icon resume-icon">
            <i class="el-icon-document"></i>
          </div>
          <div class="card-title-section">
            <h2 class="card-title">Resume Information</h2>
            <p class="card-subtitle">Your professional background and experience</p>
          </div>
        </div>
      
        <div class="card-content">
          <div class="resume-input-section">
            <div class="input-header">
              <label class="input-label">Paste Resume</label>
              <span class="char-counter">{{ resumeText.length }} characters</span>
            </div>
            <div class="modern-textarea-container">
              <el-input
                type="textarea"
                placeholder="Paste your complete resume here... Include your experience, skills, education, and achievements."
                v-model="resumeText"
                @change="onResumeTextChange"
                class="modern-textarea"
              />
            </div>
            <div class="input-tip">
              <i class="el-icon-info"></i>
              <span>Your resume will be used to provide personalized interview coaching and talking points</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Information Section -->
      <div class="modern-card">
        <div class="card-header">
          <div class="card-icon job-icon">
            <i class="el-icon-suitcase"></i>
          </div>
          <div class="card-title-section">
            <h2 class="card-title">Target Position</h2>
            <p class="card-subtitle">Details about the role you're interviewing for</p>
          </div>
        </div>
      
        <div class="card-content">
          <div class="modern-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Job Position</label>
                <el-input 
                  v-model="jobInfo.position" 
                  placeholder="e.g., Senior Software Engineer"
                  @change="onJobInfoChange"
                  class="modern-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Company</label>
                <el-input 
                  v-model="jobInfo.company" 
                  placeholder="e.g., Google, Microsoft, etc."
                  @change="onJobInfoChange"
                  class="modern-input"
                />
              </div>
            </div>
        
            <div class="form-group">
              <label class="form-label">Job Description</label>
              <el-input
                type="textarea"
                v-model="jobInfo.description"
                placeholder="Paste the complete job description here..."
                :rows="4"
                @change="onJobInfoChange"
                class="modern-textarea"
              />
            </div>
        
            <div class="form-group">
              <label class="form-label">Requirements</label>
              <el-input
                type="textarea"
                v-model="jobInfo.requirements"
                placeholder="List the key requirements and qualifications..."
                :rows="3"
                @change="onJobInfoChange"
                class="modern-textarea"
              />
            </div>
        
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Responsibilities</label>
                <el-input
                  type="textarea"
                  v-model="jobInfo.responsibilities"
                  placeholder="Main responsibilities and duties..."
                  :rows="3"
                  @change="onJobInfoChange"
                  class="modern-textarea"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Qualifications</label>
                <el-input
                  type="textarea"
                  v-model="jobInfo.qualifications"
                  placeholder="Required qualifications, skills, experience..."
                  :rows="3"
                  @change="onJobInfoChange"
                  class="modern-textarea"
                />
              </div>
            </div>
        
            <div class="form-group">
              <label class="form-label">Additional Notes</label>
              <el-input
                type="textarea"
                v-model="jobInfo.notes"
                placeholder="Any additional notes or information about the role..."
                :rows="2"
                @change="onJobInfoChange"
                class="modern-textarea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-center">
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large"
          @click="saveCustomization"
          :disabled="!isDataValid"
          class="save-btn"
        >
          <i class="el-icon-check"></i>
          Save Profile
        </el-button>
        
        <el-button 
          type="danger" 
          size="large"
          plain
          @click="clearAllData"
          class="clear-btn"
        >
          <i class="el-icon-delete"></i>
          Clear All Data
        </el-button>
      </div>
    </div>

    <!-- Status Section -->
    <div v-if="savedStatus" class="status-notification">
      <el-alert
        :title="savedStatus.title"
        :type="savedStatus.type"
        :description="savedStatus.description"
        show-icon
        :closable="false"
      />
    </div>
  </div>

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
      const hasResume = this.resumeText.trim();
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
        title: 'Customization Saved Successfully!',
        type: 'success',
        description: 'Your resume and job information have been saved. The interview assistant will now provide personalized responses based on this information.'
      };
      
      setTimeout(() => {
        this.savedStatus = null;
      }, 5000);
    },
    
    clearAllData() {
      this.$confirm('This will clear all your customization data. Continue?', 'Warning', {
        confirmButtonText: 'Yes, Clear All',
        cancelButtonText: 'Cancel',
        type: 'warning'
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
        this.$message.success('All data cleared successfully');
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
    },
    
  }
}
</script>

<style scoped>
.customize-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background: #f3f2ef;
  min-height: calc(100vh - 88px);
}

.modern-page-header {
  background: linear-gradient(135deg, #0a66c2, #004182);
  color: white;
  padding: 48px 0;
  margin: -24px -24px 32px -24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.modern-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #fafafa, #f5f5f5);
  border-bottom: 1px solid #e0e0e0;
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
  background: linear-gradient(135deg, #52c41a, #389e0d);
}

.job-icon {
  background: linear-gradient(135deg, #1890ff, #096dd9);
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.card-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.card-content {
  padding: 32px;
}

.resume-input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.char-counter {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.modern-textarea-container {
  position: relative;
}

.modern-textarea .el-textarea__inner {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 320px;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #fafafa;
}

.modern-textarea .el-textarea__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.input-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  color: #0050b3;
  font-size: 13px;
}

.input-tip .el-icon-info {
  color: #1890ff;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.modern-input .el-input__inner {
  height: 48px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 0 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.modern-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.modern-textarea .el-textarea__inner {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s ease;
  background: #fafafa;
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.save-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
  justify-content: center;
}

.clear-btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
  justify-content: center;
  border: 2px solid #ff4d4f;
  color: #ff4d4f;
}

.clear-btn:hover {
  background: #ff4d4f;
  color: white;
}

.status-notification {
  margin-top: 24px;
}

/* Responsive design */
@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-page-header {
    padding: 32px 0;
  }
  
  .header-content {
    padding: 0 16px;
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .header-subtitle {
    font-size: 14px;
  }
  
  .card-header {
    padding: 20px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .save-btn, .clear-btn {
    width: 100%;
    max-width: 280px;
  }
}

.resume-textarea-container {
  position: relative;
}

.resume-textarea {
  width: 100%;
}

.resume-textarea .el-textarea__inner {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  border-radius: 6px;
  border: 2px solid #dcdfe6;
  transition: border-color 0.3s;
  resize: vertical;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.resume-textarea .el-textarea__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.format-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  color: #0369a1;
  font-size: 12px;
}

.format-tips .el-icon-info {
  color: #0ea5e9;
}

.job-form {
  margin-top: 16px;
}

.job-form .el-form-item {
  margin-bottom: 20px;
}

.action-section {
  text-align: center;
  margin: 30px 0;
}

.action-section .el-button {
  margin: 0 10px;
}

.status-section {
  margin-top: 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .customize-container {
    padding: 10px;
  }
  
  .section-card {
    padding: 16px;
  }
  
  .job-form {
    margin-top: 12px;
  }
  
  .action-section .el-button {
    display: block;
    width: 100%;
    margin: 10px 0;
  }
}
</style>