<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Contracts" desc="View and manage customer contracts.">
      <div class="flex justify-end mb-4">
        <router-link to="/contracts/create" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Create Contract
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr class="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <th class="px-4 py-3">Contract</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Value</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="contracts.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No contracts yet.
              </td>
            </tr>
            <tr v-for="contract in contracts" :key="contract.id" class="text-sm text-gray-700 dark:text-gray-300">
              <td class="px-4 py-3">{{ contract.contract_number || `CT-${contract.id}` }}</td>
              <td class="px-4 py-3">{{ contract.customer_name }}</td>
              <td class="px-4 py-3">{{ formatCurrency(contract.contract_value) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="contract.status === 'Signed' ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400'">
                  {{ contract.status || 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(contract.start_date) }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <router-link :to="`/contracts/${contract.id}/sign`" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const currentPageTitle = ref('Contracts')
const contracts = ref<any[]>([])

const formatCurrency = (value: number | string | null) => {
  if (!value) return '—'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const loadContracts = () => {
  const saved = localStorage.getItem('contracts')
  contracts.value = saved ? JSON.parse(saved) : []
}

onMounted(() => {
  loadContracts()
})
</script>
