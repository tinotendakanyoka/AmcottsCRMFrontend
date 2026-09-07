<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Orders" desc="View and manage customer orders.">
      <div v-if="successMessage" class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
        {{ successMessage }}
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
            <tr v-if="orders.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No orders found.
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="text-sm text-gray-700 dark:text-gray-300">
              <td class="px-4 py-3">#{{ order.id }}</td>
              <td class="px-4 py-3">{{ getCustomerName(order.customer_id) }}</td>
              <td class="px-4 py-3">{{ getVehicleName(order.vehicle_id) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const currentPageTitle = ref('Orders')
const orders = ref<any[]>([])
const customers = ref<any[]>([])
const vehicles = ref<any[]>([])
const successMessage = ref('')

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(value)

const formatDate = (value: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getCustomerName = (customerId: number) => {
  const customer = customers.value.find((item) => Number(item.id) === Number(customerId))
  return customer?.company_name || customer?.customer_name || 'Unknown customer'
}

const getVehicleName = (vehicleId: number) => {
  const vehicle = vehicles.value.find((item) => Number(item.id) === Number(vehicleId))
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle'
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
  } catch (error) {
    console.error('Error loading orders:', error)
  }
})
</script>
