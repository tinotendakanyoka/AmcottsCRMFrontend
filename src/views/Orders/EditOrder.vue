<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Edit Order" desc="Update order status and approval information.">
      <form class="space-y-5" @submit.prevent="saveOrder">
        <!-- Read-only order info section -->
        <div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Customer</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ customerName || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Vehicle</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ vehicleName || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Salesperson</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ salespersonName || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Deposit Amount</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ formatCurrency(orderData?.deposit_amount) }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Expected Delivery</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ orderData?.expected_delivery_date || '—' }}</p>
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Port to Ship</p>
              <p class="mt-2 text-sm text-gray-800 dark:text-white/90">{{ orderData?.port_to_be_shipped || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Editable fields: status and approval -->
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Order status</label>
            <input v-model="form.status" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" placeholder="Draft" />
          </div>

          <div class="flex items-end gap-3">
            <label class="flex items-center gap-2">
              <input v-model="form.accounts_approved" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Accounts Approved</span>
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Sign-off Status</h3>
          <div class="grid gap-5 md:grid-cols-2">
            <div class="flex items-end gap-3">
              <label class="flex items-center gap-2">
                <input v-model="form.signed_by_seller" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Signed by Seller</span>
              </label>
            </div>

            <div class="flex items-end gap-3">
              <label class="flex items-center gap-2">
                <input v-model="form.signed_by_customer" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Signed by Customer</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/orders" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Cancel
          </router-link>
          <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
            Save Changes
          </button>
        </div>
      </form>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const route = useRoute()
const router = useRouter()
const currentPageTitle = ref('Edit Order')
const orderId = computed(() => Number(route.params.id))

// Store full order details for display
const orderData = ref<any>(null)

const form = reactive({
  status: '',
  signed_by_seller: false,
  signed_by_customer: false,
  accounts_approved: false,
})

// Computed properties for read-only display
const customerName = computed(() => {
  if (!orderData.value) return ''
  const customer = orderData.value.customer_detail || {}
  return customer.customer_name || customer.company_name || customer.name || ''
})

const vehicleName = computed(() => {
  if (!orderData.value) return ''
  const vehicle = orderData.value.vehicle_detail || {}
  return `${vehicle.make || ''} ${vehicle.model || ''}`.trim()
})

const salespersonName = computed(() => {
  if (!orderData.value) return ''
  const salesperson = orderData.value.salesperson_detail || {}
  return salesperson.salesperson_name || salesperson.username || ''
})

const formatCurrency = (value: number | string | null | undefined) => {
  if (!value && value !== 0) return '—'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const fetchOrder = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}/orders/${orderId.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load order')
  }

  const data = await response.json()
  orderData.value = data
  
  // Load editable fields from the order
  form.status = data.status || ''
  form.signed_by_seller = data.signed_by_seller || false
  form.signed_by_customer = data.signed_by_customer || false
  form.accounts_approved = data.accounts_approved || false
}

const saveOrder = async () => {
  const token = localStorage.getItem('token')

  // Only send fields that OrderUpdate schema accepts
  const payload = {
    status: form.status || null,
    signed_by_seller: form.signed_by_seller,
    signed_by_customer: form.signed_by_customer,
    accounts_approved: form.accounts_approved,
  }

  const response = await fetch(`${API_BASE}/orders/${orderId.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Failed to update order:', errorText)
    return
  }

  router.push('/orders')
}

onMounted(async () => {
  if (orderId.value) {
    await fetchOrder()
  }
})
</script>
