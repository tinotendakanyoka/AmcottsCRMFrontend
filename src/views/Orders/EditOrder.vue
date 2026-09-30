<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Edit Order" desc="Update all order information.">
      <form class="space-y-5" @submit.prevent="saveOrder">
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Customer</label>
            <select v-model="form.customer_id" required :class="inputClasses">
              <option value="">Select customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="String(customer.id)">{{ customer.company_name || customer.customer_name || customer.name || 'Customer' }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Vehicle</label>
            <select v-model="form.vehicle_id" required :class="inputClasses">
              <option value="">Select vehicle</option>
              <option v-for="vehicle in vehicles" :key="vehicle.id" :value="String(vehicle.id)">{{ vehicle.make }} {{ vehicle.model }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Salesperson</label>
            <select v-model="form.salesperson_id" required :class="inputClasses">
              <option value="">Select salesperson</option>
              <option v-for="person in salespeople" :key="person.id" :value="String(person.id)">{{ person.salesperson_name || person.username || person.email || 'Salesperson' }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deposit amount</label>
            <input v-model="form.deposit_amount" type="number" step="0.01" :class="inputClasses" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Order date</label>
            <input v-model="form.order_date" type="date" :class="inputClasses" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Expected delivery date</label>
            <input v-model="form.expected_delivery_date" type="date" :class="inputClasses" />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Port to be shipped to</label>
            <input v-model="form.port_to_be_shipped" :class="inputClasses" />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Deposit receipt reference number</label>
            <input v-model="form.deposit_receipt_referrence_number" :class="inputClasses" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Order status</label>
            <select v-model="form.status" :class="inputClasses">
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

        <div class="grid gap-5 md:grid-cols-3">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Accounts approval date</label>
            <input v-model="form.accounts_approval_date" type="date" :class="inputClasses" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Seller sign date</label>
            <input v-model="form.seller_sign_date" type="date" :class="inputClasses" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Customer sign date</label>
            <input v-model="form.customer_sign_date" type="date" :class="inputClasses" />
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
                <button type="button" :disabled="downloadingFileId === file.id" @click="downloadFile(file)" class="min-w-0 truncate text-left font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-brand-400 dark:hover:text-brand-300">
                  {{ getFileName(file) }}
                </button>
                <span class="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  {{ downloadingFileId === file.id ? 'Downloading...' : 'Download' }}
                </span>
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
          <p v-if="downloadError" class="text-sm text-red-600 dark:text-red-400">{{ downloadError }}</p>
        </section>

        <p v-if="errorMessage" class="text-sm text-error-600">{{ errorMessage }}</p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/orders" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Cancel
          </router-link>
          <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-brand-900">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
import { getApiErrorMessage, getResponseErrorMessage, isNonNegativeNumber, isValidDate } from '@/utils/validation'

type OrderData = {
  id?: number | string
  customer_id?: number | string | null
  vehicle_id?: number | string | null
  salesperson_id?: number | string | null
  deposit_amount?: number | string | null
  deposit_receipt_referrence_number?: string | null
  order_date?: string | null
  expected_delivery_date?: string | null
  port_to_be_shipped?: string | null
  status?: string | null
  signed_by_seller?: boolean
  signed_by_customer?: boolean
  accounts_approved?: boolean
  accounts_approval_date?: string | null
  seller_sign_date?: string | null
  customer_sign_date?: string | null
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

type OptionRecord = {
  id?: number | string
  company_name?: string
  customer_name?: string
  name?: string
  make?: string
  model?: string
  salesperson_name?: string
  username?: string
  email?: string
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

const orderData = ref<OrderData | null>(null)
const customers = ref<OptionRecord[]>([])
const vehicles = ref<OptionRecord[]>([])
const salespeople = ref<OptionRecord[]>([])
const orderFiles = ref<OrderFile[]>([])
const selectedFile = ref<File | null>(null)
const uploadingFile = ref(false)
const uploadMessage = ref('')
const uploadError = ref(false)
const downloadingFileId = ref<number | string | null>(null)
const downloadError = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

const form = reactive({
  customer_id: '',
  vehicle_id: '',
  salesperson_id: '',
  deposit_amount: '',
  deposit_receipt_referrence_number: '',
  order_date: '',
  expected_delivery_date: '',
  port_to_be_shipped: '',
  status: '',
  signed_by_seller: false,
  signed_by_customer: false,
  accounts_approved: false,
  accounts_approval_date: '',
  seller_sign_date: '',
  customer_sign_date: '',
})

const dateInputValue = (value: string | null | undefined) => value ? value.slice(0, 10) : ''

const inputClasses = 'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'

const getFileName = (file: OrderFile) =>
  file.name || file.filename || file.original_name || file.file_name || `Document ${file.id || ''}`.trim()

const downloadFile = async (file: OrderFile) => {
  if (!file.id) return

  downloadingFileId.value = file.id
  downloadError.value = ''
  try {
    const response = await fetch(`${API_BASE}/files/orders/${orderId.value}/${file.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!response.ok) throw new Error(await getResponseErrorMessage(response, 'Unable to download the file.'))

    const blobUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = getFileName(file)
    link.click()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    downloadError.value = error instanceof Error ? error.message : 'Failed to download file'
  } finally {
    downloadingFileId.value = null
  }
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
      throw new Error(await getResponseErrorMessage(response, 'Unable to upload the file.'))
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
    throw new Error(await getResponseErrorMessage(response, 'Unable to load order files.'))
  }

  const data = await response.json() as OrderFile[] | { files?: OrderFile[]; documents?: OrderFile[] }
  orderFiles.value = Array.isArray(data) ? data : data.files || data.documents || []
}

const fetchOptions = async () => {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
  const [customersResponse, vehiclesResponse] = await Promise.all([
    fetch(`${API_BASE}/customers/`, { headers }),
    fetch(`${API_BASE}/vehicles/`, { headers }),
  ])

  if (customersResponse.ok) customers.value = await customersResponse.json()
  if (vehiclesResponse.ok) vehicles.value = await vehiclesResponse.json()

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  salespeople.value = [{
    id: currentUser.id,
    username: currentUser.username,
    email: currentUser.email,
  }]
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
    throw new Error(await getResponseErrorMessage(response, 'Unable to load the order.'))
  }

  const data = await response.json()
  orderData.value = data

  form.customer_id = String(data.customer_id || '')
  form.vehicle_id = String(data.vehicle_id || '')
  form.salesperson_id = String(data.salesperson_id || '')
  form.deposit_amount = data.deposit_amount === null || data.deposit_amount === undefined ? '' : String(data.deposit_amount)
  form.deposit_receipt_referrence_number = data.deposit_receipt_referrence_number || ''
  form.order_date = dateInputValue(data.order_date)
  form.expected_delivery_date = dateInputValue(data.expected_delivery_date)
  form.port_to_be_shipped = data.port_to_be_shipped || ''
  form.status = data.status || ''
  form.signed_by_seller = data.signed_by_seller || false
  form.signed_by_customer = data.signed_by_customer || false
  form.accounts_approved = data.accounts_approved || false
  form.accounts_approval_date = dateInputValue(data.accounts_approval_date)
  form.seller_sign_date = dateInputValue(data.seller_sign_date)
  form.customer_sign_date = dateInputValue(data.customer_sign_date)
}

const saveOrder = async () => {
  if (isSaving.value) return
  errorMessage.value = ''
  if (!form.customer_id || !form.vehicle_id || !form.salesperson_id) {
    errorMessage.value = 'Select a customer, vehicle, and salesperson.'
    return
  }
  if (form.deposit_amount && !isNonNegativeNumber(form.deposit_amount)) {
    errorMessage.value = 'Deposit amount must be zero or greater.'
    return
  }
  const dateFields: Array<[string, string]> = [
    ['Order date', form.order_date],
    ['Expected delivery date', form.expected_delivery_date],
    ['Accounts approval date', form.accounts_approval_date],
    ['Seller sign date', form.seller_sign_date],
    ['Customer sign date', form.customer_sign_date],
  ]
  const invalidDate = dateFields.find(([, value]) => value && !isValidDate(value))
  if (invalidDate) {
    errorMessage.value = `${invalidDate[0]} is invalid.`
    return
  }

  isSaving.value = true
  const token = localStorage.getItem('token')

  const payload = {
    customer_id: Number(form.customer_id) || null,
    vehicle_id: Number(form.vehicle_id) || null,
    salesperson_id: Number(form.salesperson_id) || null,
    deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : null,
    deposit_receipt_referrence_number: form.deposit_receipt_referrence_number || null,
    order_date: form.order_date ? `${form.order_date}T00:00:00.000Z` : null,
    expected_delivery_date: form.expected_delivery_date ? `${form.expected_delivery_date}T00:00:00.000Z` : null,
    port_to_be_shipped: form.port_to_be_shipped || null,
    status: form.status || null,
    signed_by_seller: form.signed_by_seller,
    signed_by_customer: form.signed_by_customer,
    accounts_approved: form.accounts_approved,
    accounts_approval_date: form.accounts_approval_date ? `${form.accounts_approval_date}T00:00:00.000Z` : null,
    seller_sign_date: form.seller_sign_date ? `${form.seller_sign_date}T00:00:00.000Z` : null,
    customer_sign_date: form.customer_sign_date ? `${form.customer_sign_date}T00:00:00.000Z` : null,
  }

  try {
    const response = await fetch(`${API_BASE}/orders/${orderId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      errorMessage.value = await getResponseErrorMessage(response, 'Unable to update the order.')
      return
    }

    await router.push('/orders')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to update the order.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (orderId.value) {
    await Promise.all([fetchOrder(), fetchOrderFiles(), fetchOptions()])
  }
})
</script>
