<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Create Contract" desc="Enter the values used to generate the sales contract document.">
      <form class="space-y-5" @submit.prevent="submitContract">
        <div>
          <label :class="labelClass">Order</label>
          <select v-model="form.order_id" required :class="inputClass" @change="fillFromSelectedOrder">
            <option value="">Select an order</option>
            <option v-for="order in orders" :key="order.id" :value="String(order.id)">Order #{{ order.id }}{{ order.status ? ` - ${order.status}` : '' }}</option>
          </select>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div><label :class="labelClass">Seller name</label><input v-model="form.seller_name" :class="inputClass" /></div>
          <div><label :class="labelClass">Seller address</label><input v-model="form.seller_address" :class="inputClass" /></div>
          <div><label :class="labelClass">Customer name</label><input v-model="form.customer_name" :class="inputClass" /></div>
          <div><label :class="labelClass">Customer address</label><input v-model="form.customer_address" :class="inputClass" /></div>
          <div class="md:col-span-2"><label :class="labelClass">Customer details</label><textarea v-model="form.customer_details" rows="3" :class="inputClass" /></div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div><label :class="labelClass">Purchase price before VAT</label><div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span><input v-model.number="form.purchase_price_before_vat" type="number" min="0" step="0.01" :class="`${inputClass} pl-8`" /></div></div>
          <div><label :class="labelClass">Total purchase price</label><div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span><input v-model.number="form.total_purchase_price" type="number" min="0" step="0.01" :class="`${inputClass} pl-8`" /></div></div>
          <div><label :class="labelClass">Total purchase price in words</label><input v-model="form.total_purchase_price_in_words" :class="inputClass" /></div>
          <label class="flex items-center gap-2 cursor-pointer pt-2"><input v-model="form.vat_inclusive" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" /><span class="text-sm text-gray-700 dark:text-gray-400">VAT inclusive</span></label>
          <div><label :class="labelClass">VAT percentage</label><input v-model.number="form.vat_amount_percentage" type="number" min="0" step="0.01" :class="inputClass" /></div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div><label :class="labelClass">Initial deposit</label><div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span><input v-model.number="form.initial_deposit" type="number" min="0" step="0.01" :class="`${inputClass} pl-8`" /></div></div>
          <div><label :class="labelClass">Initial deposit in words</label><input v-model="form.initial_deposit_in_words" :class="inputClass" /></div>
          <div><label :class="labelClass">Initial deposit date</label><input v-model="form.initial_deposit_date" type="date" :class="inputClass" /></div>
          <div><label :class="labelClass">Contract date</label><input v-model="form.contract_date" type="date" :class="inputClass" /></div>
          <div><label :class="labelClass">Balance due</label><div class="relative"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span><input v-model.number="form.balance_due" type="number" min="0" step="0.01" :class="`${inputClass} pl-8`" /></div></div>
          <div><label :class="labelClass">Balance due in words</label><input v-model="form.balance_due_in_words" :class="inputClass" /></div>
          <div class="md:col-span-2"><label :class="labelClass">Balance terms</label><textarea v-model="form.balance_terms" rows="3" :class="inputClass" /></div>
        </div>

        <p v-if="errorMessage" class="text-sm text-error-600">{{ errorMessage }}</p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/contracts" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</router-link>
          <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">{{ isSaving ? 'Generating...' : 'Generate Contract' }}</button>
        </div>
      </form>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getApiErrorMessage, getResponseErrorMessage, isNonNegativeNumber, isValidDate } from '@/utils/validation'

type OrderOption = { id?: number | string; status?: string | null }
type OrderDetails = {
  deposit_amount?: number | string | null
  order_date?: string | null
  expected_delivery_date?: string | null
  customer_detail?: { customer_name?: string; company_name?: string; name?: string; address?: string; phone_number?: string; email?: string }
  vehicle_detail?: { make?: string; model?: string }
  salesperson_detail?: { salesperson_name?: string; username?: string }
}

const router = useRouter()
const currentPageTitle = ref('Create Contract')
const orders = ref<OrderOption[]>([])
const isSaving = ref(false)
const errorMessage = ref('')
const inputClass = 'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800'
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400'

const form = reactive({
  order_id: '', seller_name: '', seller_address: '', customer_name: '', customer_details: '', customer_address: '',
  purchase_price_before_vat: null as number | null, total_purchase_price: null as number | null, total_purchase_price_in_words: '', vat_inclusive: false, vat_amount_percentage: null as number | null,
  initial_deposit: null as number | null, initial_deposit_in_words: '', initial_deposit_date: '', balance_due: null as number | null,
  balance_due_in_words: '', balance_terms: '', contract_date: '',
})

const toDateTime = (value: string) => (value ? `${value}T00:00:00.000Z` : null)
const toNullableText = (value: string) => value.trim() || null
const toDateInput = (value: string | null | undefined) => (value ? value.slice(0, 10) : '')

const fillFromSelectedOrder = async () => {
  if (!form.order_id) return
  errorMessage.value = ''
  try {
    const response = await fetch(`${API_BASE}/orders/${form.order_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!response.ok) throw new Error(await getResponseErrorMessage(response, 'Unable to load the selected order.'))
    const order = await response.json() as OrderDetails
    const customer = order.customer_detail || {}
    const vehicle = order.vehicle_detail || {}
    const salesperson = order.salesperson_detail || {}

    form.seller_name = salesperson.salesperson_name || salesperson.username || form.seller_name
    form.customer_name = customer.company_name || customer.customer_name || customer.name || form.customer_name
    form.customer_address = customer.address || form.customer_address
    form.customer_details = [customer.phone_number, customer.email].filter(Boolean).join(' | ') || form.customer_details
    form.initial_deposit = order.deposit_amount === null || order.deposit_amount === undefined ? form.initial_deposit : Number(order.deposit_amount)
    form.initial_deposit_date = toDateInput(order.order_date)
    form.balance_terms = order.expected_delivery_date ? `Expected delivery: ${toDateInput(order.expected_delivery_date)}` : form.balance_terms

    if (vehicle.make || vehicle.model) {
      form.customer_details = [form.customer_details, `Vehicle: ${[vehicle.make, vehicle.model].filter(Boolean).join(' ')}`].filter(Boolean).join(' | ')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load selected order'
  }
}

const submitContract = async () => {
  if (!form.order_id) {
    errorMessage.value = 'Select an order before generating the contract.'
    return
  }
  const amountFields: Array<[string, number | null]> = [
    ['Purchase price before VAT', form.purchase_price_before_vat],
    ['Total purchase price', form.total_purchase_price],
    ['Initial deposit', form.initial_deposit],
    ['Balance due', form.balance_due],
  ]
  const invalidAmount = amountFields.find(([, value]) => value !== null && !isNonNegativeNumber(value))
  if (invalidAmount) {
    errorMessage.value = `${invalidAmount[0]} must be zero or greater.`
    return
  }
  if (form.vat_amount_percentage !== null && (form.vat_amount_percentage < 0 || form.vat_amount_percentage > 100)) {
    errorMessage.value = 'VAT percentage must be between 0 and 100.'
    return
  }
  const dateFields: Array<[string, string]> = [
    ['Initial deposit date', form.initial_deposit_date],
    ['Contract date', form.contract_date],
  ]
  const invalidDate = dateFields.find(([, value]) => value && !isValidDate(value))
  if (invalidDate) {
    errorMessage.value = `${invalidDate[0]} is invalid.`
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  try {
    const payload = {
      order_id: Number(form.order_id), seller_name: toNullableText(form.seller_name), seller_address: toNullableText(form.seller_address),
      customer_name: toNullableText(form.customer_name), customer_details: toNullableText(form.customer_details), customer_address: toNullableText(form.customer_address),
      purchase_price_before_vat: form.purchase_price_before_vat, vat_inclusive: form.vat_inclusive,
      vat_amount_percentage: form.vat_amount_percentage, total_purchase_price: form.total_purchase_price, total_purchase_price_in_words: toNullableText(form.total_purchase_price_in_words), initial_deposit: form.initial_deposit, initial_deposit_in_words: toNullableText(form.initial_deposit_in_words),
      initial_deposit_date: toDateTime(form.initial_deposit_date), balance_due: form.balance_due, balance_due_in_words: toNullableText(form.balance_due_in_words),
      balance_terms: toNullableText(form.balance_terms), contract_date: toDateTime(form.contract_date),
    }
    const response = await fetch(`${API_BASE}/contracts/create`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(getApiErrorMessage(errorBody, 'Failed to generate contract.'))
    }
    const createdContract = await response.json()
    const existingContracts = JSON.parse(localStorage.getItem('contracts') || '[]')
    localStorage.setItem('contracts', JSON.stringify([createdContract, ...existingContracts]))
    router.push(`/contracts/${createdContract.id}/sign`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to generate contract'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${API_BASE}/orders/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    if (!response.ok) throw new Error(await getResponseErrorMessage(response, 'Unable to load orders.'))
    orders.value = await response.json()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load orders'
  }
})
</script>
