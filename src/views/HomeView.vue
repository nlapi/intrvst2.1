<template>
  <div class="interview-workspace">
    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Speech Recognition Panel -->
      <div class="panel speech-panel">
        <div class="panel-header">
          <div class="panel-title-section">
            <div class="panel-icon speech-icon">
              <i class="el-icon-microphone"></i>
            </div>
            <div class="panel-info">
              <h3 class="panel-title">Speech Recognition</h3>
              <p class="panel-subtitle">Live conversation transcript</p>
            </div>
          </div>
          <div class="panel-controls" v-if="state === 'ing'">
            <div class="recording-indicator">
              <div class="recording-dot"></div>
              <span class="recording-text">Recording</span>
              <MyTimer ref="MyTimer" class="session-timer"/>
            </div>
            <el-button 
              type="text" 
              icon="el-icon-delete" 
              :disabled="!currentText" 
              @click="clearASRContent"
              class="control-button"
              size="small"
            >
              Clear
            </el-button>
          </div>
          <div class="panel-controls" v-else>
            <el-button 
              type="text" 
              icon="el-icon-delete" 
              :disabled="!currentText" 
              @click="clearASRContent"
              class="control-button"
              size="small"
            >
              Clear
            </el-button>
          </div>
        </div>
        
        <div class="panel-content">
          <div v-if="!currentText" class="empty-state">
            <div class="empty-icon">
              <i class="el-icon-headset"></i>
            </div>
            <h4 class="empty-title">Ready to Listen</h4>
            <p class="empty-description">Click the start button to begin recording</p>
            
            <!-- Prominent Start Button -->
            <div class="start-button-container" v-if="state === 'end'">
              <el-button
                size="large"
                type="success"
                @click="startCopilot" 
                :loading="copilot_starting"
                :disabled="copilot_starting"
                class="prominent-start-button"
              >
                <i class="el-icon-video-play"></i>
                <span>Start Interview Session</span>
              </el-button>
            </div>
          </div>
          <div v-else class="transcript-content">
            <div class="transcript-text">{{ currentText }}</div>
          </div>
        </div>
      </div>

      <!-- AI Coaching Panel -->
      <div class="panel ai-panel">
        <div class="panel-header">
          <div class="panel-title-section">
            <div class="panel-icon ai-icon">
              <i class="el-icon-magic-stick"></i>
            </div>
            <div class="panel-info">
              <h3 class="panel-title">AI Coaching</h3>
              <p class="panel-subtitle">Personalized interview guidance</p>
            </div>
          </div>
          <div class="panel-controls">
            <el-button 
              type="primary" 
              icon="el-icon-magic-stick" 
              @click="askCurrentText" 
              :disabled="!isGetGPTAnswerAvailable"
              :loading="show_ai_thinking_effect"
              class="coaching-button"
              size="small"
            >
              Get Coaching
            </el-button>
          </div>
        </div>
        
        <div class="panel-content">
          <div v-if="!ai_result && !show_ai_thinking_effect" class="empty-state">
            <div class="empty-icon">
              <i class="el-icon-user-solid"></i>
            </div>
            <h4 class="empty-title">AI Coach Ready</h4>
            <p class="empty-description">Click "Get Coaching" to receive personalized interview guidance based on your profile</p>
          </div>
          
          <div v-else-if="show_ai_thinking_effect" class="thinking-state">
            <div class="thinking-animation">
              <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <p class="thinking-text">Analyzing conversation and generating personalized coaching...</p>
          </div>
          
          <div v-else class="ai-response">
            <div class="response-content">{{ ai_result }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Stop Button (when recording) -->
    <div class="compact-stop-control" v-if="state === 'ing'">
      <div class="stop-control-content">
        <div class="stop-info">
          <span class="stop-text">Recording in progress...</span>
        </div>
        <el-button
          type="danger"
          :loading="copilot_stopping"
          @click="userStopCopilot"
          class="compact-stop-button"
        >
          <i class="el-icon-video-pause"></i>
          <span>Stop</span>
        </el-button>
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
      return !!this.currentText
    }
  },
  components: {LoadingIcon, MyTimer},
  data() {
    return {
      currentText: "",
      state: "end", //end\ing
      ai_result: null,
      copilot_starting: false,
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
            if (this.$refs.MyTimer) {
              this.$refs.MyTimer.start()
            }
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
        if (this.$refs.MyTimer) {
          this.$refs.MyTimer.stop()
        }
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

<style scoped>
.interview-workspace {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 100%;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #0a66c2;
  margin-right: 16px;
}

.recording-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0a66c2;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.recording-text {
  font-weight: 600;
}

.panel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.session-timer {
  font-size: 13px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #0a66c2;
  background: rgba(10, 102, 194, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  margin-left: 8px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.panel-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.panel-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.speech-icon {
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.ai-icon {
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.panel-info {
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.panel-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.control-button {
  color: #64748b;
  font-weight: 500;
}

.control-button:hover {
  color: #3b82f6;
}

.coaching-button {
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  font-weight: 600;
}

.panel-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
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
  max-width: 280px;
  line-height: 1.5;
}

.start-button-container {
  margin-top: 16px;
}

.prominent-start-button {
  height: 56px;
  padding: 0 32px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  box-shadow: 0 4px 6px -1px rgba(10, 102, 194, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.prominent-start-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(10, 102, 194, 0.4);
}

.thinking-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.thinking-animation {
  margin-bottom: 16px;
}

.thinking-dots {
  display: flex;
  gap: 8px;
}

.thinking-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0a66c2;
  animation: thinking 1.4s infinite ease-in-out both;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

.thinking-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.transcript-content, .ai-response {
  flex: 1;
}

.transcript-text, .response-content {
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.compact-stop-control {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.stop-control-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
}

.stop-info {
  display: flex;
  flex-direction: column;
}

.stop-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.compact-stop-button {
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #d93025, #b52d20);
  border: none;
  box-shadow: 0 2px 4px -1px rgba(217, 48, 37, 0.3);
}

.compact-stop-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(217, 48, 37, 0.4);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes thinking {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .panel {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .interview-workspace {
    gap: 24px;
  }
  
  .recording-indicator {
    flex-direction: column;
    gap: 8px;
    margin-right: 8px;
  }
  
  .panel-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .panel-content {
    padding: 20px;
  }
  
  .stop-control-center {
    padding: 24px;
  }
  
  .stop-button, .prominent-start-button {
    width: 100%;
  }
}
</style>