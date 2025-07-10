<template>
  <div>


    <h1>Open AI</h1>
    <div class="desc_text">To use GPT, you need an API Key from the <a :href="open_ai_api_url" target="_blank">Open
      AI</a>
    </div>

    <div>
      <el-input placeholder="sk-xxxx" v-model="openai_key" @change="onKeyChange('openai_key')">
        <template slot="prepend">API Key:</template>
      </el-input>
    </div>

    <div class="separator">
      GPT Model:
      <el-radio-group v-model="gpt_model" @change="onKeyChange('gpt_model')">
        <el-radio label="gpt-4o"></el-radio>
        <el-radio label="o3"></el-radio>
      </el-radio-group>
    </div>

    <div class="separator">
      <div class="desc_text">GPT Prompt:</div>
      <el-input type="textarea" placeholder="You can setup custom prompt here" :rows="5"
                v-model="gpt_system_prompt" @change="onKeyChange('gpt_system_prompt')"/>
    </div>


    <h1>Azure Speech Recognition</h1>
    <div class="desc_text">
      We use Microsoft Azure's speech recognition service. You can apply for a free Azure token by referring to <a
        :href="azure_application_url" target="_blank">this tutorial</a>:
    </div>
    <el-input placeholder="Input Your Azure Speech Resource Token (KEY 1)" v-model="azure_token"
              @change="onKeyChange('azure_token')">
      <template slot="prepend">Azure token:</template>
    </el-input>
    <div class="separator"></div>
    <el-input placeholder="e.g. eastasia" v-model="azure_region" @change="onKeyChange('azure_region')">
      <template slot="prepend">Location/Region</template>
    </el-input>
    <div class="separator"></div>
    <el-input placeholder="e.g. en-US" v-model="azure_language" @change="onKeyChange('azure_language')">
      <template slot="prepend">Recognition Language</template>
    </el-input>

    <div class="desc_text">
      <span style="text-decoration: gray">zh-CN</span> for Chinese, See <a :href="full_language_codec_url"
                                                                           target="_blank">here</a> for
      other language codes
    </div>

<!--    <div>-->
<!--      <el-button @click="toDef">set all setting to default</el-button>-->
<!--    </div>-->

  </div>
</template>

<script>
import config_util from "../utils/config_util"

export default {
  name: 'HelloWorld',
  props: {},
  data() {
    return {
      openai_key: "",
      gpt_model: "gpt-4o",
      gpt_system_prompt: "",
      azure_token: "",
      azure_region: "",
      azure_language: "",
      open_ai_api_url: "https://platform.openai.com/api-keys",
      github_url: "https://github.com/interview-copilot/Interview-Copilot",
      azure_application_url: "https://github.com/interview-copilot/Interview-Copilot/blob/main/docs/azure_speech_service_tutorial.md",
      full_language_codec_url: "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt#speech-to-text"
    }
  },
  mounted() {
    this.openai_key = localStorage.getItem("openai_key")
    this.gpt_system_prompt = config_util.gpt_system_prompt()
    this.gpt_model = config_util.gpt_model()
    this.azure_token = localStorage.getItem("azure_token")
    this.azure_region = config_util.azure_region()
    this.azure_language = config_util.azure_language()
  },
  methods: {
    onKeyChange(key_name) {
      console.log("setItem", key_name, this[key_name])
      localStorage.setItem(key_name, this[key_name])
    },
    toDef() {
      localStorage.clear();
    }
  }


}


</script>
<style scoped>

.settings-container {
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

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
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

.openai-icon {
  background: linear-gradient(135deg, #10a37f, #0d8f6b);
}

.azure-icon {
  background: linear-gradient(135deg, #0078d4, #106ebe);
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

.setting-group {
  margin-bottom: 32px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.setting-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.setting-description-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  margin-bottom: 24px;
  color: #0050b3;
}

.setting-description-box i {
  color: #1890ff;
  font-size: 16px;
  margin-top: 2px;
}

.setting-description-box p {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.setting-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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

.model-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.model-option {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.model-option:hover {
  border-color: #0a66c2;
  background: white;
}

.model-option.is-checked {
  border-color: #0a66c2;
  background: #e6f7ff;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 8px;
}

.model-name {
  font-weight: 600;
  color: #2c3e50;
}

.model-desc {
  font-size: 12px;
  color: #666;
}

.language-hint {
  margin-top: 8px;
}

.hint-text {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.link {
  color: #0a66c2;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 1024px) {
  .setting-row {
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
  
  .model-option {
    padding: 12px;
  }
}
</style>
