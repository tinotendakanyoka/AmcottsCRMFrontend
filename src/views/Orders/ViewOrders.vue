<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Orders" desc="View and manage customer orders.">
      <div v-if="successMessage" class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
        {{ successMessage }}
      </div>

      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label for="order-status-filter" class="text-sm font-medium text-gray-700 dark:text-gray-400">View orders by status</label>
        <select id="order-status-filter" v-model="selectedStatus" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 sm:max-w-xs">
          <option value="all">All statuses</option>
          <option v-for="status in availableStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr class="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Vehicle</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Deposit</th>
              <th class="px-4 py-3">Delivery</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No orders found for this status.
              </td>
            </tr>
            <tr v-for="order in filteredOrders" :key="order.id" class="text-sm text-gray-700 dark:text-gray-300">
              <td class="px-4 py-3">#{{ order.id }}</td>
              <td class="px-4 py-3">{{ getCustomerName(order.customer_id) }}</td>
              <td class="px-4 py-3">{{ getVehicleName(order.vehicle_id) }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusClasses(order.status)" class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                  {{ order.status || 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-3">{{ order.deposit_amount ? formatCurrency(order.deposit_amount) : '—' }}</td>
              <td class="px-4 py-3">{{ order.expected_delivery_date ? formatDate(order.expected_delivery_date) : '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <router-link :to="`/orders/${order.id}/edit`" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    Edit
                  </router-link>
                  <router-link :to="`/orders/${order.id}/sign`" class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
                    Sign
                  </router-link>
                  <button type="button" class="rounded-lg border border-brand-300 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-500/10" @click="openNotifyModal(order)">
                    Notify
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ComponentCard>

    <div v-if="orderToNotify" class="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/50 p-4" @click.self="closeNotifyModal">
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notify order #{{ orderToNotify.id }}</h2>
          <button type="button" aria-label="Close notification form" class="text-2xl leading-none text-gray-500 hover:text-gray-800 dark:hover:text-white" @click="closeNotifyModal">&times;</button>
        </div>
        <form class="space-y-4" @submit.prevent="notifyOrder">
          <div>
            <label for="notify-emails" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email addresses</label>
            <textarea id="notify-emails" v-model="notifyForm.emails" rows="3" placeholder="name@example.com, another@example.com" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple addresses with commas or new lines.</p>
          </div>
          <div v-if="currentUser.id">
            <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Users</p>
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input v-model="notifyForm.userIds" type="checkbox" :value="Number(currentUser.id)" class="rounded border-gray-300 text-brand-500" />
              {{ currentUser.username || currentUser.email }}
            </label>
          </div>
          <div>
            <label for="notify-message" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Message</label>
            <textarea id="notify-message" v-model="notifyForm.message" rows="4" required placeholder="Add a message for the recipients" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          </div>
          <p v-if="notifyError" class="text-sm text-error-600">{{ notifyError }}</p>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300" @click="closeNotifyModal">Cancel</button>
            <button type="submit" :disabled="isNotifying" class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">{{ isNotifying ? 'Sending...' : 'Send notification' }}</button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

type OrderRecord = {
  id?: number | string
  customer_id?: number | string | null
  vehicle_id?: number | string | null
  status?: string | null
  deposit_amount?: number | string | null
  expected_delivery_date?: string | null
}

type CustomerRecord = {
  id?: number | string
  company_name?: string
  customer_name?: string
}

type VehicleRecord = {
  id?: number | string
  make?: string
  model?: string
}

type UserRecord = {
  id?: number | string
  username?: string
  email?: string
}

const currentPageTitle = ref('Orders')
const orders = ref<OrderRecord[]>([])
const customers = ref<CustomerRecord[]>([])
const vehicles = ref<VehicleRecord[]>([])
const successMessage = ref('')
const selectedStatus = ref('all')
const orderToNotify = ref<OrderRecord | null>(null)
const isNotifying = ref(false)
const notifyError = ref('')
const currentUser = ref<UserRecord>({})
const notifyForm = ref({ emails: '', userIds: [] as number[], message: '' })

const availableStatuses = computed(() => {
  const statuses = new Set(['Draft', 'In Progress', 'Completed', 'Cancelled'])

  orders.value.forEach((order) => {
    const status = String(order.status || 'Draft').trim()
    if (status) statuses.add(status)
  })

  return [...statuses].sort((first, second) => first.localeCompare(second))
})

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') return orders.value

  return orders.value.filter((order) => {
    const status = String(order.status || 'Draft').trim()
    return status.toLowerCase() === selectedStatus.value.toLowerCase()
  })
})

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value))

const formatDate = (value: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getCustomerName = (customerId: number | string | null | undefined) => {
  const customer = customers.value.find((item) => Number(item.id) === Number(customerId))
  return customer?.company_name || customer?.customer_name || 'Unknown customer'
}

const getVehicleName = (vehicleId: number | string | null | undefined) => {
  const vehicle = vehicles.value.find((item) => Number(item.id) === Number(vehicleId))
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle'
}

const getStatusClasses = (status: string | null | undefined) => {
  switch (String(status || 'Draft').trim().toLowerCase()) {
    case 'completed':
      return 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400'
    case 'cancelled':
      return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400'
    case 'in progress':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400'
    case 'draft':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400'
    default:
      return 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
  }
}

const openNotifyModal = (order: OrderRecord) => {
  orderToNotify.value = order
  notifyError.value = ''
  notifyForm.value = { emails: '', userIds: [], message: '' }
}

const closeNotifyModal = () => {
  if (isNotifying.value) return
  orderToNotify.value = null
}

const notifyOrder = async () => {
  if (!orderToNotify.value?.id) return
  const emails = notifyForm.value.emails
    .split(/[\n,;]/)
    .map((email) => email.trim())
    .filter(Boolean)

  if (emails.length === 0 && notifyForm.value.userIds.length === 0) {
    notifyError.value = 'Add at least one email address or select a user.'
    return
  }

  isNotifying.value = true
  notifyError.value = ''
  try {
    const response = await fetch(`${API_BASE}/orders/${orderToNotify.value.id}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        order_id: Number(orderToNotify.value.id),
        message: notifyForm.value.message || null,
        emails: emails.length ? emails : null,
        user_ids: notifyForm.value.userIds.length ? notifyForm.value.userIds : null,
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    successMessage.value = 'Order notification sent.'
    closeNotifyModal()
  } catch (error) {
    notifyError.value = error instanceof Error ? error.message : 'Failed to send notification'
  } finally {
    isNotifying.value = false
  }
}

const fetchOrders = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE}/orders/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }

  orders.value = await response.json()
}

const fetchCustomers = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE}/customers/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch customers')
  }

  customers.value = await response.json()
}

const fetchVehicles = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE}/vehicles/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch vehicles')
  }

  vehicles.value = await response.json()
}

onMounted(async () => {
  try {
    const storedMessage = localStorage.getItem('orderSuccessMessage')
    if (storedMessage) {
      successMessage.value = storedMessage
      localStorage.removeItem('orderSuccessMessage')
    }

    await Promise.all([fetchCustomers(), fetchVehicles(), fetchOrders()])
    currentUser.value = JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    console.error('Error loading orders:', error)
  }
})
</script>
