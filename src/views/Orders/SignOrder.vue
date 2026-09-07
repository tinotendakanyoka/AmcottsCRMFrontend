<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Sign Order" :desc="`Order #${orderId}`">
      <div v-if="order" class="space-y-5">
        <div class="grid gap-5 md:grid-cols-2">
          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
            <p class="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Customer</p>
            <p class="mt-2 text-base font-medium text-gray-800 dark:text-white/90">{{ getCustomerName(order.customer_id) }}</p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
            <p class="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Vehicle</p>
            <p class="mt-2 text-base font-medium text-gray-800 dark:text-white/90">{{ getVehicleName(order.vehicle_id) }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-dashed border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <p class="text-sm text-gray-600 dark:text-gray-300">Status: <span class="font-medium text-gray-800 dark:text-white/90">{{ order.status || 'Draft' }}</span></p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Seller signed: {{ order.signed_by_seller ? 'Yes' : 'No' }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Customer signed: {{ order.signed_by_customer ? 'Yes' : 'No' }}</p>
        </div>

        <div v-if="isInternalUser" class="flex flex-wrap gap-3">
          <button
            v-if="!order.signed_by_seller"
            @click="signDocument('seller')"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Internal Sign Off
          </button>
          <div v-else class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
            Internal sign-off complete.
          </div>
        </div>

        <div v-else class="flex flex-wrap gap-3">
          <button
            v-if="!order.signed_by_customer"
            @click="signDocument('customer')"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Customer Sign Off
          </button>
          <div v-else class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
            Customer sign-off complete.
          </div>
        </div>
      </div>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const route = useRoute()
const currentPageTitle = ref('Sign Order')
const order = ref<any | null>(null)
const customers = ref<any[]>([])
const vehicles = ref<any[]>([])
const currentUser = ref<Record<string, any>>({})
const orderId = computed(() => Number(route.params.id))

const getCurrentUser = async () => {
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser)
      return currentUser.value
    }
  } catch (error) {
    console.warn('Unable to parse stored user profile:', error)
  }

  const token = localStorage.getItem('token')
  if (!token) {
    return {}
  }

  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const user = await response.json()
      currentUser.value = user
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
  } catch (error) {
    console.warn('Unable to fetch /users/me for role detection:', error)
  }

  try {
    const payloadPart = token.split('.')[1]
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(normalized)
          .split('')
          .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      )
    )
    currentUser.value = decoded
    return decoded
  } catch (error) {
    console.warn('Unable to decode JWT for user role:', error)
    return {}
  }
}

const isInternalUser = computed(() => {
  const user = currentUser.value
  const role = String(user.role || user.user_type || user.type || '').toLowerCase()
  const claims = [
    user.is_admin,
    user.is_internal,
    user.is_staff,
    user.isSalesperson,
    user.isSeller,
  ]

  return (
    role === 'admin' ||
    role === 'internal' ||
    role === 'seller' ||
    role === 'salesperson' ||
    role === 'staff' ||
    claims.some(Boolean)
  )
})

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

const fetchVehicles = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}/vehicles/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (response.ok) {
    vehicles.value = await response.json()
  }
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

  order.value = await response.json()
}

const getCustomerName = (customerId: number) => {
  const customer = customers.value.find((item) => Number(item.id) === Number(customerId))
  return customer?.company_name || customer?.customer_name || 'Unknown customer'
}

const getVehicleName = (vehicleId: number) => {
  const vehicle = vehicles.value.find((item) => Number(item.id) === Number(vehicleId))
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle'
}

const signDocument = async (role: 'seller' | 'customer') => {
  const token = localStorage.getItem('token')
  const endpoint = role === 'seller'
    ? `${API_BASE}/orders/${orderId.value}/seller-sign`
    : `${API_BASE}/orders/${orderId.value}/customer-sign`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.error(`Failed to sign order as ${role}`)
    return
  }

  await fetchOrder()
}

onMounted(async () => {
  try {
    await getCurrentUser()
    await Promise.all([fetchCustomers(), fetchVehicles(), fetchOrder()])
  } catch (error) {
    console.error('Error loading order sign page:', error)
  }
})
</script>
