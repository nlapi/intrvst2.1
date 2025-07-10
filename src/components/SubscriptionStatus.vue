<template>
  <div v-if="subscription" class="subscription-status">
    <div class="status-content">
      <div class="status-icon">
        <i class="el-icon-crown" v-if="isActive"></i>
        <i class="el-icon-warning" v-else></i>
      </div>
      <div class="status-info">
        <div class="status-title">{{ statusTitle }}</div>
        <div class="status-subtitle">{{ statusSubtitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserSubscription } from '../utils/supabase'
import { getProductByPriceId } from '../stripe-config'

export default {
  name: 'SubscriptionStatus',
  data() {
    return {
      subscription: null,
      loading: true
    }
  },
  computed: {
    isActive() {
      return this.subscription && ['active', 'trialing'].includes(this.subscription.subscription_status)
    },
    statusTitle() {
      if (!this.subscription) return ''
      
      const product = getProductByPriceId(this.subscription.price_id)
      const planName = product ? product.name : 'Premium Plan'
      
      if (this.isActive) {
        return `${planName} Active`
      } else {
        return 'Subscription Inactive'
      }
    },
    statusSubtitle() {
      if (!this.subscription) return ''
      
      if (this.isActive) {
        const endDate = new Date(this.subscription.current_period_end * 1000)
        return `Renews ${endDate.toLocaleDateString()}`
      } else {
        return 'Please check your subscription status'
      }
    }
  },
  async mounted() {
    await this.loadSubscription()
  },
  methods: {
    async loadSubscription() {
      try {
        const { data, error } = await getUserSubscription()
        
        if (error) {
          console.error('Error loading subscription:', error)
        } else {
          this.subscription = data
        }
      } catch (error) {
        console.error('Error loading subscription:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.subscription-status {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 16px;
  margin-bottom: 16px;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.status-subtitle {
  font-size: 12px;
  color: #64748b;
}
</style>