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
            <select v-model="form.status" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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

        <section class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Order Documents</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload documents related to this order.</p>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded files</h4>
            <p v-if="orderFiles.length === 0" class="text-sm text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
            <ul v-else class="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900/40">
              <li v-for="file in orderFiles" :key="file.id || file.url || file.file_url || getFileName(file)" class="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
                <span class="truncate text-gray-700 dark:text-gray-300">{{ getFileName(file) }}</span>
                <a v-if="getFileUrl(file)" :href="getFileUrl(file)" target="_blank" rel="noopener noreferrer" class="shrink-0 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                  View file
                </a>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div class="flex-1">
              <label for="order-document" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Choose a file</label>
              <input id="order-document" type="file" @change="handleFileChange" class="block h-11 w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-800 file:mr-4 file:h-full file:border-0 file:bg-gray-100 file:px-4 file:text-sm file:font-medium dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:file:bg-gray-800" />
            </div>
            <button type="button" :disabled="!selectedFile || uploadingFile" @click="uploadFile" class="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-brand-900">
              {{ uploadingFile ? 'Uploading...' : 'Upload File' }}
            </button>
          </div>

          <p v-if="uploadMessage" class="text-sm" :class="uploadError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
            {{ uploadMessage }}
          </p>
        </section>

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

type OrderData = {
  deposit_amount?: number | string | null
  expected_delivery_date?: string | null
  port_to_be_shipped?: string | null
  status?: string | null
  signed_by_seller?: boolean
  signed_by_customer?: boolean
  accounts_approved?: boolean
  customer_detail?: {
    customer_name?: string
    company_name?: string
    name?: string
  }
  vehicle_detail?: {
    make?: string
    model?: string
  }
  salesperson_detail?: {
    salesperson_name?: string
    username?: string
  }
}

type OrderFile = {
  id?: number | string
  name?: string
  filename?: string
  original_name?: string
  file_name?: string
  url?: string
  file_url?: string
  download_url?: string
  path?: string
}

const route = useRoute()
const router = useRouter()
const currentPageTitle = ref('Edit Order')
const orderId = computed(() => Number(route.params.id))

// Store full order details for display
const orderData = ref<OrderData | null>(null)
const orderFiles = ref<OrderFile[]>([])
const selectedFile = ref<File | null>(null)
const uploadingFile = ref(false)
const uploadMessage = ref('')
const uploadError = ref(false)

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

const getFileName = (file: OrderFile) =>
  file.name || file.filename || file.original_name || file.file_name || `Document ${file.id || ''}`.trim()

const getFileUrl = (file: OrderFile) => {
  const fileUrl = file.url || file.file_url || file.download_url || file.path
  if (!fileUrl) return ''
  return new URL(fileUrl, API_BASE).toString()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] || null
  uploadMessage.value = ''
  uploadError.value = false
}

const uploadFile = async () => {
  if (!selectedFile.value || !orderId.value) return

  uploadingFile.value = true
  uploadMessage.value = ''
  uploadError.value = false

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch(`${API_BASE}/files/orders/${orderId.value}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    selectedFile.value = null
    await fetchOrderFiles()
    uploadMessage.value = 'File uploaded successfully.'
  } catch (error) {
    console.error('Failed to upload order file:', error)
    uploadError.value = true
    uploadMessage.value = 'Unable to upload file. Please try again.'
  } finally {
    uploadingFile.value = false
  }
}

const fetchOrderFiles = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE}/files/orders/${orderId.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to load order files')
  }

  const data = await response.json() as OrderFile[] | { files?: OrderFile[]; documents?: OrderFile[] }
  orderFiles.value = Array.isArray(data) ? data : data.files || data.documents || []
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
    await Promise.all([fetchOrder(), fetchOrderFiles()])
  }
})
</script>
