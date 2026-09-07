<template>
  <div
  v-if="customers.length > 0"
  class="space-y-4 flex flex-row flex-wrap gap-2 gap-x-12 p-6"
>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Select Customer
      </label>
      <select
        v-model="selectedCustomerId"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      >
        <option value="">Select a customer</option>
        <option value="new">Add New Customer</option>
        <option
          v-for="customer in customers"
          :key="customer.id"
          :value="customer.id"
        >
          {{ customer.company_name }}
        </option>
      </select>
    </div>
  <div v-if="newCustomer" class="space-y-4 flex flex-row flex-wrap gap-2 gap-x-12 p-6">
    <!-- Text Input -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Name
      </label>
      <input
        type="text"
        v-model="formData.name"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Company Details
      </label>
      <input
        type="text"
        v-model="formData.companyDetails"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        VAT Number
      </label>
      <input
        type="text"
        v-model="formData.vatNumber"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        TIN Number
      </label>
      <input
        type="text"
        v-model="formData.tinNumber"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Address
      </label>
      <input
        type="text"
        v-model="formData.address"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Phone
      </label>
      <input
        type="text"
        v-model="formData.phone"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Cell
      </label>
      <input
        type="text"
        v-model="formData.cell"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Email
      </label>
      <input
        type="text"
        v-model="formData.email"
        placeholder="info@example.com"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
        <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Preffered Contact Email
      </label>
      <input
        type="text"
        v-model="formData.preferredContactEmail"
        placeholder="info@example.com"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>

  </div>
      <div v-if="newCustomer" class="space-y-4 flex flex-row flex-wrap gap-2 gap-x-12 p-6">
      <button @click="saveCustomer" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
        Save Customer
      </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import 'flatpickr/dist/flatpickr.css'
import { API_BASE } from '@/config'
import { storeToRefs } from 'pinia'
import { useAppDataStore } from '@/stores/appData'

type CustomerRecord = {
  id?: number
  name?: string
  company_name?: string
  customer_name?: string
  vat_number?: string
  tin_number?: string
  address?: string
  phone?: string
  phone_number?: string
  cell?: string
  cell_number?: string
  email?: string
  preferred_contact_email?: string
  user_id?: number | null
}

const appDataStore = useAppDataStore()
const { selectedCustomer } = storeToRefs(appDataStore)

const formData = reactive({
  name: '',
  companyDetails: '',
  vatNumber: '',
  tinNumber: '',
  address: '',
  phone: '',
  cell: '',
  email: '',
  preferredContactEmail: '',
})

const customers = ref<CustomerRecord[]>([])
const newCustomer = ref(true)
const selectedCustomerId = ref('')
const selectedCustomerData = ref<CustomerRecord | null>(null)

watch(
  () => selectedCustomer.value,
  (customer) => {
    const customerRecord = customer as CustomerRecord | null
    selectedCustomerId.value = customerRecord ? String(customerRecord.id ?? '') : ''
    if (!customerRecord) {
      selectedCustomerData.value = null
      Object.assign(formData, {
        name: '',
        companyDetails: '',
        vatNumber: '',
        tinNumber: '',
        address: '',
        phone: '',
        cell: '',
        email: '',
        preferredContactEmail: '',
      })
      return
    }

    selectedCustomerData.value = customerRecord
    formData.name = customerRecord.customer_name || customerRecord.name || ''
    formData.companyDetails = customerRecord.company_name || ''
    formData.vatNumber = customerRecord.vat_number || ''
    formData.tinNumber = customerRecord.tin_number || ''
    formData.address = customerRecord.address || ''
    formData.phone = customerRecord.phone_number || customerRecord.phone || ''
    formData.cell = customerRecord.cell_number || customerRecord.cell || ''
    formData.email = customerRecord.email || ''
    formData.preferredContactEmail = customerRecord.preferred_contact_email || ''
    newCustomer.value = false
  },
  { immediate: true }
)

watch(selectedCustomerId, (customerId) => {
  if (!customerId) {
    appDataStore.setSelectedCustomer(null)
    selectedCustomerData.value = null
    Object.assign(formData, {
      name: '',
      companyDetails: '',
      vatNumber: '',
      tinNumber: '',
      address: '',
      phone: '',
      cell: '',
      email: '',
      preferredContactEmail: '',
    })
    return
  }

  if (customerId === 'new') {
    appDataStore.setSelectedCustomer(null)
    newCustomer.value = true
    selectedCustomerData.value = null
    Object.assign(formData, {
      name: '',
      companyDetails: '',
      vatNumber: '',
      tinNumber: '',
      address: '',
      phone: '',
      cell: '',
      email: '',
      preferredContactEmail: '',
    })
    return
  }

  const customer = customers.value.find(
    (item) => String(item.id ?? '') === String(customerId)
  )

  selectedCustomerData.value = customer || null
  appDataStore.setSelectedCustomer(customer || null)

  if (customer) {
    formData.name = customer.customer_name || customer.name || ''
    formData.companyDetails = customer.company_name || ''
    formData.vatNumber = customer.vat_number || ''
    formData.tinNumber = customer.tin_number || ''
    formData.address = customer.address || ''
    formData.phone = customer.phone_number || customer.phone || ''
    formData.cell = customer.cell_number || customer.cell || ''
    formData.email = customer.email || ''
    formData.preferredContactEmail = customer.preferred_contact_email || ''
  }

  newCustomer.value = false
})

const getCustomerData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/customers/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    customers.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching customer data:', error)
  }
}

const saveCustomer = async () => {
  try {
    const token = localStorage.getItem('token')
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    const payload = {
      user_id: Number(currentUser.id ?? 0),
      customer_name: formData.name || formData.companyDetails || '',
      company_name: formData.companyDetails || formData.name || '',
      address: formData.address || null,
      phone_number: formData.phone || null,
      cell_number: formData.cell || null,
      email: formData.email || null,
      preferred_contact_email: formData.preferredContactEmail || null,
      vat_number: formData.vatNumber || null,
      tin_number: formData.tinNumber || null,
    }

    const response = await fetch(`${API_BASE}/customers/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (response.ok) {
      await getCustomerData()
      selectedCustomerId.value = String(data.id ?? '')
    } else {
      console.error('Error saving customer:', data)
    }
  } catch (error) {
    console.error('Error saving customer:', error)
  }
}

onMounted(() => {
  getCustomerData()
})
</script>
