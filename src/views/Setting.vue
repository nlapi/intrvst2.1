<template>
  <div class="settings-workspace">
    <!-- Settings Sections -->
    <div class="settings-grid">
      <!-- OpenAI Configuration -->
      <div class="settings-card">
        <div class="card-header">
          <div class="card-icon openai-icon">
            <i class="el-icon-magic-stick"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">OpenAI Configuration</h3>
            <p class="card-subtitle">Configure GPT for AI-powered interview coaching</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="info-banner">
            <div class="banner-icon">
              <i class="el-icon-info"></i>
            </div>
            <div class="banner-content">
              <p class="banner-text">
                Get your API key from <a :href="open_ai_api_url" target="_blank" class="banner-link">OpenAI Platform</a>
              </p>
            </div>
          </div>
          
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">API Key</label>
              <el-input 
                v-model="openai_key" 
                @change="onKeyChange('openai_key')"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                type="password"
                show-password
                class="modern-input"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">GPT Model</label>
              <div class="model-selector-grid">
                <div class="model-row">
                  <div 
                    v-for="model in availableModels" 
                    :key="model.value"
                    class="model-option"
                    :class="{ selected: gpt_model === model.value }"
                    @click="selectModel(model.value)"
                  >
                    <div class="model-radio">
                      <div class="radio-dot" :class="{ active: gpt_model === model.value }"></div>
                    </div>
                    <div class="model-info">
                      <div class="model-name">{{ model.name }}</div>
                      <div class="model-desc">{{ model.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">System Prompt</label>
              <p class="form-description">Customize how the AI coach responds to interview questions</p>
              <el-input
                type="textarea"
                v-model="gpt_system_prompt"
                @change="onKeyChange('gpt_system_prompt')"
                placeholder="Enter your custom system prompt..."
                :rows="6"
                class="modern-textarea"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Azure Speech Configuration -->
      <div class="settings-card">
        <div class="card-header">
          <div class="card-icon azure-icon">
            <i class="el-icon-microphone"></i>
          </div>
          <div class="card-info">
            <h3 class="card-title">Azure Speech Service</h3>
            <p class="card-subtitle">Configure speech recognition for live transcription</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="info-banner">
            <div class="banner-icon">
              <i class="el-icon-info"></i>
            </div>
            <div class="banner-content">
              <p class="banner-text">
                Follow our <a :href="azure_application_url" target="_blank" class="banner-link">setup tutorial</a> to get your free Azure Speech token
              </p>
            </div>
          </div>
          
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Speech Resource Key</label>
              <el-input 
                v-model="azure_token"
                @change="onKeyChange('azure_token')"
                placeholder="Enter your Azure Speech Resource Key (KEY 1)"
                type="password"
                show-password
                class="modern-input"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Region</label>
                <el-input 
                  v-model="azure_region" 
                  @change="onKeyChange('azure_region')"
                  placeholder="e.g., eastasia, westus2"
                  class="modern-input"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Language</label>
                <el-input 
                  v-model="azure_language" 
                  @change="onKeyChange('azure_language')"
                  placeholder="e.g., en-US, zh-CN"
                  class="modern-input"
                />
              </div>
            </div>
            
            <div class="language-help">
              <div class="help-content">
                <span class="help-text">Common languages: </span>
                <span class="language-tag">en-US</span>
                <span class="language-tag">zh-CN</span>
                <span class="language-tag">es-ES</span>
                <span class="language-tag">fr-FR</span>
                <a :href="full_language_codec_url" target="_blank" class="help-link">View all supported languages</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Status -->
    <div v-if="saveStatus" class="save-notification">
      <div class="notification-content" :class="saveStatus.type">
        <div class="notification-icon">
          <i :class="saveStatus.type === 'success' ? 'el-icon-check' : 'el-icon-warning'"></i>
        </div>
        <div class="notification-text">
          <div class="notification-title">{{ saveStatus.title }}</div>
          <div class="notification-message">{{ saveStatus.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config_util from "../utils/config_util"

export default {
  name: 'Setting',
  data() {
    return {
      openai_key: "",
      gpt_model: "gpt-4o",
      gpt_system_prompt: "",
      azure_token: "",
      azure_region: "",
      azure_language: "",
      saveStatus: null,
      open_ai_api_url: "https://platform.openai.com/api-keys",
      azure_application_url: "https://github.com/interview-copilot/Interview-Copilot/blob/main/docs/azure_speech_service_tutorial.md",
      full_language_codec_url: "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt#speech-to-text",
      availableModels: [
        {
          value: "gpt-4o",
          name: "GPT-4o",
          description: "Most capable model with excellent reasoning and multimodal capabilities"
        },
        {
          value: "o3",
          name: "o3",
          description: "Latest reasoning model with advanced problem-solving capabilities"
        }
      ]
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      this.openai_key = localStorage.getItem("openai_key") || ""
      this.gpt_system_prompt = config_util.gpt_system_prompt()
      this.gpt_model = config_util.gpt_model()
      this.azure_token = localStorage.getItem("azure_token") || ""
      this.azure_region = config_util.azure_region()
      this.azure_language = config_util.azure_language()
    },
    
    onKeyChange(key_name) {
      localStorage.setItem(key_name, this[key_name])
      this.showSaveStatus('success', 'Settings Saved', 'Your configuration has been saved successfully')
    },
    
    selectModel(modelValue) {
      this.gpt_model = modelValue
      this.onKeyChange('gpt_model')
    },
    
    showSaveStatus(type, title, message) {
      this.saveStatus = { type, title, message }
      setTimeout(() => {
        this.saveStatus = null
      }, 3000)
    }
  }
}
</script>

<style scoped>
.settings-workspace {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
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

.openai-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.azure-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 20px;
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

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #e7f3ff;
  border: 1px solid #0a66c2;
  border-radius: 12px;
  margin-bottom: 24px;
}

.banner-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a66c2;
  flex-shrink: 0;
  margin-top: 2px;
}

.banner-content {
  flex: 1;
}

.banner-text {
  font-size: 14px;
  color: #004182;
  margin: 0;
  line-height: 1.5;
}

.banner-link {
  color: #0a66c2;
  text-decoration: none;
  font-weight: 600;
}

.banner-link:hover {
  text-decoration: underline;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.form-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.modern-input .el-input__inner {
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.modern-input .el-input__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.modern-textarea .el-textarea__inner {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.2s ease;
  background: #f8fafc;
  resize: vertical;
}

.modern-textarea .el-textarea__inner:focus {
  border-color: #0a66c2;
  box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
  background: white;
}

.model-selector-grid {
  width: 100%;
}

.model-row {
  display: flex;
  gap: 16px;
}

.model-row .model-option {
  flex: 1;
}

.model-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.model-option:hover {
  border-color: #0a66c2;
  background: white;
}

.model-option.selected {
  border-color: #0a66c2;
  background: #e7f3ff;
}

.model-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.model-option.selected .model-radio {
  border-color: #0a66c2;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
}

.radio-dot.active {
  background: #0a66c2;
}

.model-info {
  flex: 1;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.model-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.language-help {
  padding: 16px;
  background: #f1f5f9;
  border-radius: 12px;
}

.help-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.help-text {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.language-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #e2e8f0;
  color: #475569;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.help-link {
  color: #0a66c2;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
}

.save-notification {
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
  min-width: 300px;
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
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
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
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .model-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .settings-workspace {
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
  
  .save-notification {
    right: 16px;
    left: 16px;
  }
  
  .notification-content {
    min-width: auto;
  }
}
</style>