<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Sign Contract" :desc="`Contract #${contractId}`">
      <div v-if="contract" class="space-y-5">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Customer</p>
          <p class="mt-2 text-base font-medium text-gray-800 dark:text-white/90">{{ contract.customer_name }}</p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
          <p class="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Vehicle</p>
          <p class="mt-2 text-base font-medium text-gray-800 dark:text-white/90">{{ contract.vehicle_name || 'Not specified' }}</p>
        </div>

        <div class="rounded-xl border border-dashed border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <p class="text-sm text-gray-600 dark:text-gray-300">Value: <span class="font-medium text-gray-800 dark:text-white/90">{{ formatCurrency(contract.contract_value) }}</span></p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Status: <span class="font-medium text-gray-800 dark:text-white/90">{{ contract.status || 'Draft' }}</span></p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button @click="signDocument" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600">
            Sign Contract
          </button>
        </div>
      </div>
    </ComponentCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const route = useRoute()
const currentPageTitle = ref('Sign Contract')
const contract = ref<any | null>(null)
const contractId = computed(() => Number(route.params.id))

const formatCurrency = (value: number | string | null) => {
  if (!value) return '—'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const loadContract = () => {
  const list = JSON.parse(localStorage.getItem('contracts') || '[]')
  contract.value = list.find((item: any) => Number(item.id) === contractId.value) || null
}

const signDocument = () => {
  const list = JSON.parse(localStorage.getItem('contracts') || '[]')
  const index = list.findIndex((item: any) => Number(item.id) === contractId.value)

  if (index >= 0) {
    list[index].status = 'Signed'
    localStorage.setItem('contracts', JSON.stringify(list))
  }

  loadContract()
}

onMounted(() => {
  loadContract()
})
</script>
