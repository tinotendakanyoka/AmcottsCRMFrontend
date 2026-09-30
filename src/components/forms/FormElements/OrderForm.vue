<template>
  <form class="space-y-5" @submit.prevent="saveOrder">
    <div v-if="errorMessage" role="alert" class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-800 dark:bg-error-500/10 dark:text-error-400">
      {{ errorMessage }}
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Customer</label>
        <select v-model="form.customer_id" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
          <option value="">Select customer</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.company_name || customer.name || 'Customer' }}
          </option>
        </select>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Salesperson</label>
        <select v-model="form.salesperson_id" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
          <option value="">Select salesperson</option>
          <option v-for="person in salespeople" :key="person.id" :value="person.id">
            {{ person.salesperson_name || person.username || 'Salesperson' }}
          </option>
        </select>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deposit amount</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span>
          <input v-model="form.deposit_amount" type="number" step="0.01" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-8 pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Expected delivery date</label>
        <input v-model="form.expected_delivery_date" type="date" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
      </div>

      <div class="md:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Port to be shipped to</label>
        <input v-model="form.port_to_be_shipped" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" placeholder="Port of Durban" />
      </div>

      <div class="md:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deposit receipt reference number</label>
        <input v-model="form.deposit_receipt_referrence_number" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <router-link to="/orders" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Cancel
      </router-link>
      <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
        {{ isSaving ? 'Creating...' : 'Create Order' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { API_BASE } from '@/config'
import { useAppDataStore } from '@/stores/appData'
import { getApiErrorMessage, isNonNegativeNumber, isValidDate } from '@/utils/validation'

type OptionRecord = {
  id?: number | string
  company_name?: string
  name?: string
  salesperson_name?: string
  username?: string
}

const router = useRouter()
const appData = useAppDataStore()
const { selectedCustomer, selectedVehicle } = storeToRefs(appData)

const customers = ref<OptionRecord[]>([])
const salespeople = ref<OptionRecord[]>([])
const errorMessage = ref('')
const isSaving = ref(false)

const form = reactive({
  customer_id: '',
  salesperson_id: '',
  vehicle_id: '',
  deposit_amount: '',
  expected_delivery_date: '',
  port_to_be_shipped: '',
  deposit_receipt_referrence_number: '',
})

watch(selectedCustomer, (customer) => {
  if (customer) {
    form.customer_id = String(customer.id ?? '')
  }
}, { immediate: true })

watch(selectedVehicle, (vehicle) => {
  if (vehicle) {
    form.vehicle_id = String(vehicle.id ?? '')
  }
}, { immediate: true })

const fetchCustomers = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}/customers/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.ok) {
    customers.value = await response.json()
  }
}

const fetchSalespeople = async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  salespeople.value = [{
    id: currentUser.id || 1,
    salesperson_name: currentUser.username || 'Current User',
  }]

  if (!form.salesperson_id && currentUser.id) {
    form.salesperson_id = String(currentUser.id)
  }
}

const saveOrder = async () => {
  if (isSaving.value) return

  errorMessage.value = ''
  if (!form.customer_id || !form.salesperson_id || !form.vehicle_id) {
    errorMessage.value = 'Select a customer, salesperson, and vehicle.'
    return
  }
  if (form.deposit_amount && !isNonNegativeNumber(form.deposit_amount)) {
    errorMessage.value = 'Deposit amount must be zero or greater.'
    return
  }
  if (form.expected_delivery_date && !isValidDate(form.expected_delivery_date)) {
    errorMessage.value = 'Enter a valid expected delivery date.'
    return
  }

  isSaving.value = true
  const token = localStorage.getItem('token')
  const payload = {
    customer_id: Number(form.customer_id) || null,
    salesperson_id: Number(form.salesperson_id) || null,
    vehicle_id: Number(form.vehicle_id) || null,
    deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : null,
    port_to_be_shipped: form.port_to_be_shipped || null,
    expected_delivery_date: form.expected_delivery_date ? `${form.expected_delivery_date}T00:00:00.000Z` : null,
    deposit_receipt_referrence_number: form.deposit_receipt_referrence_number || null,
  }

  try {
    const response = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(getApiErrorMessage(errorBody, 'Unable to create the order.', response.status))
    }

    localStorage.setItem('orderSuccessMessage', 'Order created successfully.')
    router.push('/orders')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to create the order. Please try again.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCustomers(), fetchSalespeople()])
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  if (currentUser.id && !form.salesperson_id) {
    form.salesperson_id = String(currentUser.id)
  }
})
</script>
