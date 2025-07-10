<template>
  <div class="pricing-workspace">
    <div class="pricing-header">
      <h1 class="pricing-title">Choose Your Plan</h1>
      <p class="pricing-subtitle">Unlock your interview potential with AI-powered coaching</p>
    </div>

    <div class="pricing-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="pricing-card"
        :class="{ featured: product.id === 'prod_SenkSGBMNl20WT' }"
      >
        <div v-if="product.id === 'prod_SenkSGBMNl20WT'" class="featured-badge">
          <span>Most Popular</span>
        </div>
        
        <div class="card-header">
          <h3 class="plan-name">{{ product.name }}</h3>
          <div class="plan-price">
            <span class="price-amount">${{ product.price }}</span>
            <span class="price-period" v-if="product.mode === 'subscription'">/month</span>
          </div>
        </div>
        
        <div class="card-content">
          <p class="plan-description">{{ product.description }}</p>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="feature-text">Real-time speech recognition</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="feature-text">AI-powered interview coaching</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="feature-text">Personalized response suggestions</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="feature-text">Resume-based coaching</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="feature-text">Job-specific guidance</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <el-button
            type="primary"
            size="large"
            @click="handleSubscribe(product)"
            :loading="loadingStates[product.id]"
            :disabled="loadingStates[product.id]"
            class="subscribe-button"
            :class="{ featured: product.id === 'prod_SenkSGBMNl20WT' }"
          >
            <span v-if="!loadingStates[product.id]">
              {{ product.mode === 'subscription' ? 'Start Subscription' : 'Buy Now' }}
            </span>
            <span v-else>Processing...</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-notification">
      <div class="notification-content error">
        <div class="notification-icon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="notification-text">
          <div class="notification-title">Payment Error</div>
          <div class="notification-message">{{ errorMessage }}</div>
        </div>
        <el-button 
          type="text" 
          @click="errorMessage = ''"
          class="close-button"
        >
          <i class="el-icon-close"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { products } from '../stripe-config'
import { supabase } from '../utils/supabase'

export default {
  name: 'Pricing',
  data() {
    return {
      products,
      loadingStates: {},
      errorMessage: ''
    }
  },
  methods: {
    async handleSubscribe(product) {
      this.errorMessage = ''
      this.$set(this.loadingStates, product.id, true)

      try {
        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          this.$router.push('/login')
          return
        }

        // Create checkout session
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_id: product.priceId,
            mode: product.mode,
            success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/pricing`
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error('No checkout URL received')
        }

      } catch (error) {
        console.error('Checkout error:', error)
        this.errorMessage = error.message || 'Failed to start checkout process. Please try again.'
      } finally {
        this.$set(this.loadingStates, product.id, false)
      }
    }
  }
}
</script>

<style scoped>
.pricing-workspace {
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 100%;
}

.pricing-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.pricing-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.pricing-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 2px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.pricing-card.featured {
  border-color: #0a66c2;
  box-shadow: 0 10px 15px -3px rgba(10, 102, 194, 0.1), 0 4px 6px -2px rgba(10, 102, 194, 0.05);
}

.featured-badge {
  position: absolute;
  top: 20px;
  right: -30px;
  background: linear-gradient(135deg, #0a66c2, #004182);
  color: white;
  padding: 8px 40px;
  font-size: 12px;
  font-weight: 600;
  transform: rotate(45deg);
  z-index: 1;
}

.card-header {
  padding: 32px 32px 24px 32px;
  text-align: center;
  background: #f8fafc;
}

.plan-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-amount {
  font-size: 48px;
  font-weight: 800;
  color: #0a66c2;
  line-height: 1;
}

.price-period {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
}

.card-content {
  padding: 32px;
  flex: 1;
}

.plan-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  text-align: center;
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.feature-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}

.card-footer {
  padding: 24px 32px 32px 32px;
}

.subscribe-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  border: none;
  transition: all 0.2s ease;
}

.subscribe-button.featured {
  background: linear-gradient(135deg, #0a66c2, #004182);
}

.subscribe-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.error-notification {
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
  border-left: 4px solid #ef4444;
  min-width: 350px;
  max-width: 400px;
}

.notification-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  font-size: 16px;
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

.close-button {
  color: #9ca3af;
  padding: 4px;
}

.close-button:hover {
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
@media (max-width: 768px) {
  .pricing-workspace {
    gap: 32px;
  }
  
  .pricing-title {
    font-size: 28px;
  }
  
  .pricing-subtitle {
    font-size: 16px;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .card-header {
    padding: 24px 24px 20px 24px;
  }
  
  .plan-name {
    font-size: 20px;
  }
  
  .price-amount {
    font-size: 36px;
  }
  
  .card-content {
    padding: 24px;
  }
  
  .card-footer {
    padding: 20px 24px 24px 24px;
  }
  
  .error-notification {
    right: 16px;
    left: 16px;
  }
  
  .notification-content {
    min-width: auto;
  }
}
</style>