<template>
  <div
  v-if="customers.length > 0"
  class="space-y-4 flex flex-row flex-wrap gap-2 gap-x-12 p-6"
>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Select Customer
      </label>
      <select
        v-model="selectedCustomer"
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
      <div>
      <button class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
        Save Customer
      </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import 'flatpickr/dist/flatpickr.css'
import { API_BASE } from '@/config'

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

const customers = ref<any[]>([])
const newCustomer = ref(true)
const selectedCustomer = ref('')
const selectedCustomerData = ref<any>(null)

watch(selectedCustomer, (customerId) => {
  if (!customerId) {
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
    (item) => String(item.id) === String(customerId)
  )

  selectedCustomerData.value = customer || null

  if (customer) {
    formData.name = customer.name || ''
    formData.companyDetails = customer.company_name || ''
    formData.vatNumber = customer.vat_number || ''
    formData.tinNumber = customer.tin_number || ''
    formData.address = customer.address || ''
    formData.phone = customer.phone || ''
    formData.cell = customer.cell || ''
    formData.email = customer.email || ''
    formData.preferredContactEmail = customer.preferred_contact_email || ''
  }
  newCustomer.value = false
})

const getCustomerData = async () => {
  try {
    // Simulate fetching customer data from an API
    const token = localStorage.getItem('token') // Retrieve the token from local storage
    const response = await fetch(`${API_BASE}/customers/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    const data = await response.json()
    customers.value = data  
    console.log('Fetched customer data:', data) // Log the fetched data for debugging
  } catch (error) {
    console.error('Error fetching customer data:', error)
  }
}

onMounted(() => {
  getCustomerData()
})

</script>
