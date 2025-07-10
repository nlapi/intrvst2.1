<template>
  <div class="modern-homeview">
    <div class="interview-header">
      <h1 class="page-title">Live Interview Assistant</h1>
      <p class="page-subtitle">Real-time speech recognition with AI-powered coaching</p>
    </div>
    
    <div class="interview-panels">
      <div class="panel speech-panel">
        <div class="panel-header">
          <i class="el-icon-microphone"></i>
          <span class="panel-title">Speech Recognition</span>
          <div class="panel-status" :class="{ active: state === 'ing' }"></div>
        </div>
        <div class="panel-content">
          <div v-if="!currentText" class="empty-state">
            <i class="el-icon-chat-dot-round"></i>
            <p>Conversation will appear here...</p>
          </div>
          <div v-else class="transcript-content">{{ currentText }}</div>
        </div>
        <div class="panel-actions">
          <el-button 
            type="text" 
            icon="el-icon-delete" 
            :disabled="!currentText" 
            @click="clearASRContent"
            class="action-btn"
          >
            Clear Text
          </el-button>
        </div>
      </div>
      
      <div class="panel ai-panel">
        <div class="panel-header">
          <i class="el-icon-s-custom"></i>
          <span class="panel-title">AI Coaching</span>
          <div v-if="show_ai_thinking_effect" class="thinking-indicator">
            <div class="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div class="panel-content">
          <div v-if="!ai_result && !show_ai_thinking_effect" class="empty-state">
            <i class="el-icon-lightbulb"></i>
            <p>AI coaching suggestions will appear here...</p>
          </div>
          <div v-else class="ai-response">{{ ai_result }}</div>
        </div>
        <div class="panel-actions">
          <el-button 
            type="primary" 
            icon="el-icon-magic-stick" 
            @click="askCurrentText" 
            :disabled="!isGetGPTAnswerAvailable"
            :loading="show_ai_thinking_effect"
            class="action-btn primary"
          >
            Get AI Coaching
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="control-center">
      <div class="control-panel">
        <div class="timer-section">
          <MyTimer ref="MyTimer"/>
        </div>
        <div class="control-buttons">
          <el-button
            size="large"
            type="success"
            @click="startCopilot" 
            v-show="state==='end'" 
            :loading="copilot_starting"
            :disabled="copilot_starting"
            class="control-btn start-btn"
          >
            <i class="el-icon-video-play"></i>
            Start Interview
          </el-button>
          <el-button
            size="large"
            type="danger"
            :loading="copilot_stopping"
            @click="userStopCopilot" 
            v-show="state==='ing'"
            class="control-btn stop-btn"
          >
            <i class="el-icon-video-pause"></i>
            Stop Interview
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Assert from "assert-js"
import LoadingIcon from "@/components/LoadingIcon.vue";
import MyTimer from "@/components/MyTimer.vue";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import OpenAI from "openai";
import config_util from "../utils/config_util"

export default {
  name: 'HomeView',
  props: {},
  computed: {
    isDevMode() {
      return (process.env.NODE_ENV === 'development')
    },
    isGetGPTAnswerAvailable() {
      // return this.state === "ing" && !!this.currentText
      return !!this.currentText

    }
  },
  components: {LoadingIcon, MyTimer},
  data() {
    return {
      currentText: "",
      state: "end", //end\ing
      ai_result: null,
      copilot_starting: false, //显示loading
      copilot_stopping: false,
      show_ai_thinking_effect: false,
      popStyle: {},
    }
  },
  async mounted() {
    console.log("mounted")
    if (this.isDevMode) {
      // this.currentText = demo_text
    }
  },
  beforeDestroy() {
  },
  methods: {
    async askCurrentText() {
      const apiKey = localStorage.getItem("openai_key")
      let content = this.currentText
      this.ai_result = ""
      this.show_ai_thinking_effect = true
      const model = config_util.gpt_model()
      const gpt_system_prompt = config_util.gpt_system_prompt()
      
      // Get customization data
      const customizationData = this.getCustomizationData()
      
      // Build comprehensive prompt with context
      let fullPrompt = gpt_system_prompt
      
      if (customizationData.hasData) {
        fullPrompt += "\n\n=== CANDIDATE CONTEXT ===\n"
        
        if (customizationData.resume) {
          fullPrompt += "MY RESUME:\n" + customizationData.resume + "\n\n"
        }
        
        if (customizationData.jobInfo.position || customizationData.jobInfo.company) {
          fullPrompt += "TARGET POSITION: " + customizationData.jobInfo.position
          if (customizationData.jobInfo.company) {
            fullPrompt += " at " + customizationData.jobInfo.company
          }
          fullPrompt += "\n\n"
        }
        
        if (customizationData.jobInfo.description) {
          fullPrompt += "JOB DESCRIPTION:\n" + customizationData.jobInfo.description + "\n\n"
        }
        
        if (customizationData.jobInfo.requirements) {
          fullPrompt += "JOB REQUIREMENTS:\n" + customizationData.jobInfo.requirements + "\n\n"
        }
        
        if (customizationData.jobInfo.responsibilities) {
          fullPrompt += "KEY RESPONSIBILITIES:\n" + customizationData.jobInfo.responsibilities + "\n\n"
        }
        
        if (customizationData.jobInfo.qualifications) {
          fullPrompt += "REQUIRED QUALIFICATIONS:\n" + customizationData.jobInfo.qualifications + "\n\n"
        }
        
        fullPrompt += "=== END CONTEXT ===\n\n"
      }
      
      fullPrompt += "INTERVIEW TRANSCRIPT:\n" + content

      try {
        if (!apiKey) {
          throw new Error("You should setup an Open AI Key!")
        }

        const openai = new OpenAI({apiKey: apiKey, dangerouslyAllowBrowser: true})
        const stream = await openai.chat.completions.create({
          model: model,
          messages: [{role: "user", content: fullPrompt}],
          stream: true,
        });
        this.show_ai_thinking_effect = false

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          this.ai_result += text
        }
      } catch (e) {
        this.show_ai_thinking_effect = false
        this.ai_result = "" + e
      }
    },
    getCustomizationData() {
      const saved = localStorage.getItem('interview_customization')
      if (!saved) {
        return { hasData: false }
      }
      
      try {
        const data = JSON.parse(saved)
        return {
          hasData: true,
          resume: data.resume || '',
          jobInfo: data.jobInfo || {}
        }
      } catch (error) {
        console.error('Error loading customization data:', error)
        return { hasData: false }
      }
    },
    clearASRContent() {
      this.currentText = ""
    },
    async startCopilot() {
      this.copilot_starting = true
      const token = localStorage.getItem("azure_token")
      const region = config_util.azure_region()
      const language = config_util.azure_language()
      const openai_key = localStorage.getItem("openai_key")
      console.log({region, language})
      try {
        if (!openai_key) {
          throw new Error("You should setup Open AI API Token")
        }
        if (!token) {
          throw new Error("You should setup Azure token")
        }
        if (!region) {
          throw new Error("You should setup Azure region")
        }

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
        speechConfig.speechRecognitionLanguage = language;
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      } catch (e) {
        this.currentText = e
        this.copilot_starting = false
        return
      }

      const recognizer = this.recognizer
      const sdk = SpeechSDK


      recognizer.recognized = (sender, event) => {
        if (sdk.ResultReason.RecognizedSpeech === event.result.reason && event.result.text.length > 0) {
          const text = event.result.text
          this.currentText = this.currentText + "\n" + text
        } else if (sdk.ResultReason.NoMatch === event.result.reason) {
          console.log("Speech could not be recognized")
        }
      };

      recognizer.startContinuousRecognitionAsync(
          () => {
            this.copilot_starting = false
            this.state = "ing"
            this.$refs.MyTimer.start()
            window.console.log("recognition started");
          },
          (err) => {
            this.copilot_starting = false
            this.currentText = "Start Failed:" + err
            window.console.error("recogniton start failed", err);
          })
    },
    userStopCopilot() {
      this.copilot_stopping = true
      this.recognizer.stopContinuousRecognitionAsync(() => {
        console.log("stoped")
        this.copilot_stopping = false
        this.state = "end"
        this.$refs.MyTimer.stop()
      }, (err) => {
        console.log("err:", err)
      })
    }
  }
}


const demo_text = `
Hello, thank you for coming for the interview. Please introduce yourself.

I'm Jhon, currently an undergraduate student majoring in Data Science at HK University. I am in the top 10% of my class, specializing in deep learning and proficient in web development. Additionally, I have contributed to several well-known open-source projects as mentioned in my resume.

Alright, let me ask you a machine learning question.

Sure, go ahead.

Can you explain the Hidden Markov Model?
`

async function sleep(ms) {
  return new Promise((resolve => setTimeout(resolve, ms)))
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.modern-homeview {
  background: #f3f2ef;
  min-height: calc(100vh - 88px);
  padding: 0;
}

.interview-header {
  background: linear-gradient(135deg, #0a66c2, #004182);
  color: white;
  padding: 40px 0;
  text-align: center;
  margin: -24px -24px 32px -24px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.interview-panels {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.panel-header i {
  font-size: 20px;
  color: #0a66c2;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.panel-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  margin-left: auto;
}

.panel-status.active {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.thinking-indicator {
  margin-left: auto;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a66c2;
  animation: thinking 1.4s infinite ease-in-out both;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes thinking {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.panel-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.transcript-content, .ai-response {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #2c3e50;
}

.panel-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.action-btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
}

.control-center {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  padding: 24px;
}

.control-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.timer-section {
  font-size: 24px;
  font-weight: 600;
  color: #0a66c2;
  font-family: 'Courier New', monospace;
}

.control-buttons {
  display: flex;
  gap: 16px;
}

.control-btn {
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
}

.start-btn {
  background: linear-gradient(135deg, #52c41a, #389e0d);
  border: none;
}

.stop-btn {
  background: linear-gradient(135deg, #ff4d4f, #cf1322);
  border: none;
}

/* Responsive design */
@media (max-width: 1024px) {
  .interview-panels {
    flex-direction: column;
  }
  
  .panel {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .interview-header {
    padding: 24px 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .control-panel {
    flex-direction: column;
    gap: 16px;
  text-align: center;
  }
  
  .control-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .control-btn {
    flex: 1;
    min-width: auto;
  }
  
  .panel-content {
    padding: 16px;
  }
  
  .panel-header {
    padding: 16px;
  }
}
</style>

.single_part_bottom_bar {
  display: flex;
}

.single_part_bottom_bar > .el-button {
  flex-grow: 1;
}


.ai_result_content {
  overflow-y: auto;
  flex-grow: 1;
}

.popup-tag {
  position: absolute;
  display: none;
  background-color: #785448d4;
  color: white;
  padding: 5px;
  font-size: 15px;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  -webkit-filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8));
}

.error_msg {
  color: red;
  text-align: center;
}

</style>
