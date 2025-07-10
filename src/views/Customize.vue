<template>
  <div class="customize-container">
    <div class="page-header">
      <h1>Customize Your Interview Preparation</h1>
      <p class="desc-text">Upload your resume and provide job details to get personalized interview assistance</p>
    </div>

    <!-- Resume Section -->
    <div class="section-card">
      <h2 class="section-title">
        <i class="el-icon-document"></i>
        Resume Information
      </h2>
      
      <el-tabs v-model="resumeInputMethod" @tab-click="handleResumeTabClick">
        <el-tab-pane label="Upload PDF" name="upload">
          <div class="upload-section">
            <el-upload
              class="upload-dragger"
              drag
              :action="''"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="fileList"
              accept=".pdf"
              :limit="1"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop PDF file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">Only PDF files are supported</div>
            </el-upload>
            
            <div v-if="pdfText" class="pdf-preview">
              <h4>Extracted Resume Content:</h4>
              <div class="pdf-content">{{ pdfText }}</div>
              <el-button @click="clearPdfContent" size="small" type="danger" plain>Clear</el-button>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="Paste Text" name="text">
          <div class="text-input-section">
            <el-input
              type="textarea"
              placeholder="Paste your resume content here..."
              v-model="resumeText"
              :rows="12"
              @change="onResumeTextChange"
            />
            <div class="char-count">{{ resumeText.length }} characters</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Job Information Section -->
    <div class="section-card">
      <h2 class="section-title">
        <i class="el-icon-suitcase"></i>
        Job Information
      </h2>
      
      <el-form :model="jobInfo" label-width="140px" class="job-form">
        <el-form-item label="Job Position">
          <el-input 
            v-model="jobInfo.position" 
            placeholder="e.g., Senior Software Engineer"
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Company">
          <el-input 
            v-model="jobInfo.company" 
            placeholder="e.g., Google, Microsoft, etc."
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Job Description">
          <el-input
            type="textarea"
            v-model="jobInfo.description"
            placeholder="Paste the job description here..."
            :rows="4"
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Requirements">
          <el-input
            type="textarea"
            v-model="jobInfo.requirements"
            placeholder="List the key requirements and qualifications..."
            :rows="4"
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Responsibilities">
          <el-input
            type="textarea"
            v-model="jobInfo.responsibilities"
            placeholder="Main responsibilities and duties..."
            :rows="4"
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Qualifications">
          <el-input
            type="textarea"
            v-model="jobInfo.qualifications"
            placeholder="Required qualifications, skills, experience..."
            :rows="4"
            @change="onJobInfoChange"
          />
        </el-form-item>
        
        <el-form-item label="Additional Notes">
          <el-input
            type="textarea"
            v-model="jobInfo.notes"
            placeholder="Any additional notes or information..."
            :rows="3"
            @change="onJobInfoChange"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <el-button 
        type="primary" 
        size="large"
        @click="saveCustomization"
        :disabled="!isDataValid"
      >
        Save Customization
      </el-button>
      
      <el-button 
        type="danger" 
        size="large"
        plain
        @click="clearAllData"
      >
        Clear All Data
      </el-button>
    </div>

    <!-- Status Section -->
    <div v-if="savedStatus" class="status-section">
      <el-alert
        :title="savedStatus.title"
        :type="savedStatus.type"
        :description="savedStatus.description"
        show-icon
        :closable="false"
      />
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
    }
  }
}
</script>

<style scoped>
.customize-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.desc-text {
  color: #666;
  font-size: 14px;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.resume-input-section {
  margin-top: 16px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.char-count {
  color: #999;
  font-size: 12px;
  font-weight: normal;
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