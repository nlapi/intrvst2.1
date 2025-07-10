<template>
  <div class="success-workspace">
    <div class="success-container">
      <div class="success-icon">
        <div class="icon-circle">
          <i class="el-icon-check"></i>
        </div>
      </div>
      
      <div class="success-content">
        <h1 class="success-title">Payment Successful!</h1>
        <p class="success-message">
          Thank you for subscribing to InterviewSignal. Your AI interview coach is now ready to help you succeed.
        </p>
        
        <div class="success-details" v-if="sessionDetails">
          <div class="detail-item">
            <span class="detail-label">Plan:</span>
            <span class="detail-value">{{ sessionDetails.planName }}</span>
          </div>
          <div class="detail-item" v-if="sessionDetails.amount">
            <span class="detail-label">Amount:</span>
            <span class="detail-value">${{ (sessionDetails.amount / 100).toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="success-actions">
          <el-button
            type="primary"
            size="large"
            @click="goToInterview"
            class="primary-action"
          >
            <i class="el-icon-chat-dot-round"></i>
            <span>Start Interview Session</span>
          </el-button>
          
          <el-button
            size="large"
            @click="goToProfile"
            class="secondary-action"
          >
            <i class="el-icon-user"></i>
            <span>Complete Your Profile</span>
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="next-steps">
      <h3 class="steps-title">What's Next?</h3>
      <div class="steps-grid">
        <div class="step-item">
          <div class="step-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="step-content">
            <h4 class="step-title">Complete Your Profile</h4>
            <p class="step-description">Add your resume and target job details for personalized coaching</p>
          </div>
        </div>
        
        <div class="step-item">
          <div class="step-icon">
            <i class="el-icon-setting"></i>
          </div>
          <div class="step-content">
            <h4 class="step-title">Configure Settings</h4>
            <p class="step-description">Set up your OpenAI and Azure Speech service credentials</p>
          </div>
        </div>
        
        <div class="step-item">
          <div class="step-icon">
            <i class="el-icon-chat-dot-round"></i>
          </div>
          <div class="step-content">
            <h4 class="step-title">Start Practicing</h4>
            <p class="step-description">Begin your interview sessions with AI-powered coaching</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductByPriceId } from '../stripe-config'

export default {
  name: 'Success',
  data() {
    return {
      sessionDetails: null
    }
  },
  mounted() {
    this.loadSessionDetails()
  },
  methods: {
    loadSessionDetails() {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get('session_id')
      
      if (sessionId) {
        // In a real implementation, you might fetch session details from your backend
        // For now, we'll show basic success information
        this.sessionDetails = {
          planName: 'InterviewSignal',
          sessionId: sessionId
        }
      }
    },
    
    goToInterview() {
      this.$router.push('/')
    },
    
    goToProfile() {
      this.$router.push('/customize')
    }
  }
}
</script>

<style scoped>
.success-workspace {
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}

.success-container {
  text-align: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 48px 40px;
}

.success-icon {
  margin-bottom: 32px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 32px;
  animation: successPulse 2s ease-in-out infinite;
}

.success-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.success-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.success-message {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.success-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin: 0 auto;
  max-width: 300px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.primary-action {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #0a66c2, #004182);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.secondary-action {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.secondary-action:hover {
  border-color: #0a66c2;
  color: #0a66c2;
}

.next-steps {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 40px;
}

.steps-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 32px 0;
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.step-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .success-workspace {
    gap: 32px;
    padding: 20px 0;
  }
  
  .success-container {
    padding: 32px 24px;
  }
  
  .success-title {
    font-size: 24px;
  }
  
  .success-message {
    font-size: 16px;
  }
  
  .success-actions {
    gap: 16px;
  }
  
  .primary-action,
  .secondary-action {
    width: 100%;
  }
  
  .next-steps {
    padding: 32px 24px;
  }
  
  .steps-title {
    font-size: 20px;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .step-item {
    padding: 16px;
  }
}
</style>