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
            placeholder="Any additional information about the role or company..."
            :rows="3"
            @change="onJobInfoChange"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <el-button type="primary" size="large" @click="saveCustomization" :disabled="!isDataValid">
        <i class="el-icon-check"></i>
        Save Customization
      </el-button>
      <el-button size="large" @click="clearAllData">
        <i class="el-icon-delete"></i>
        Clear All Data
      </el-button>
    </div>

    <!-- Status Display -->
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
      resumeInputMethod: 'text',
      resumeText: '',
      pdfText: '',
      fileList: [],
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
      const hasResume = this.resumeText.trim() || this.pdfText.trim();
      const hasJobInfo = this.jobInfo.position.trim() || this.jobInfo.description.trim();
      return hasResume && hasJobInfo;
    },
    currentResumeContent() {
      return this.resumeInputMethod === 'upload' ? this.pdfText : this.resumeText;
    }
  },
  mounted() {
    this.loadSavedData();
  },
  methods: {
    handleResumeTabClick(tab) {
      this.resumeInputMethod = tab.name;
    },
    
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      if (file.raw && file.raw.type === 'application/pdf') {
        this.extractPdfText(file.raw);
      }
    },
    
    async extractPdfText(file) {
      try {
        // For now, we'll simulate PDF text extraction
        // In a real implementation, you'd use a library like pdf-parse or PDF.js
        this.pdfText = `[PDF Content Extracted from: ${file.name}]\n\nNote: PDF text extraction is simulated. In a real implementation, this would contain the actual extracted text from your PDF resume.\n\nTo implement actual PDF parsing, you would need to integrate a PDF parsing library.`;
        
        this.$message.success('PDF uploaded successfully! (Text extraction simulated)');
      } catch (error) {
        this.$message.error('Failed to extract text from PDF');
        console.error('PDF extraction error:', error);
      }
    },
    
    clearPdfContent() {
      this.pdfText = '';
      this.fileList = [];
    },
    
    onResumeTextChange() {
      this.saveToLocalStorage();
    },
    
    onJobInfoChange() {
      this.saveToLocalStorage();
    },
    
    saveCustomization() {
      const customizationData = {
        resume: this.currentResumeContent,
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
        this.pdfText = '';
        this.fileList = [];
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
        resume: this.currentResumeContent,
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

.upload-section {
  margin-top: 16px;
}

.upload-dragger {
  width: 100%;
}

.pdf-preview {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.pdf-preview h4 {
  margin-bottom: 12px;
  color: #2c3e50;
}

.pdf-content {
  background: white;
  padding: 12px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  border: 1px solid #ddd;
  margin-bottom: 12px;
}

.text-input-section {
  margin-top: 16px;
}

.char-count {
  text-align: right;
  color: #999;
  font-size: 12px;
  margin-top: 8px;
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