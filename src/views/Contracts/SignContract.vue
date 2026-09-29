<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ComponentCard title="Generated Contract" :desc="`Contract #${contractId}`">
      <div v-if="contract" class="space-y-5">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
          <p class="text-sm text-gray-600 dark:text-gray-300">Order: <span class="font-medium text-gray-800 dark:text-white/90">#{{ contract.order_id }}</span></p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Generated: <span class="font-medium text-gray-800 dark:text-white/90">{{ formatDate(contract.contract_date) }}</span></p>
        </div>

        <div>
          <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-400">Contract document</p>
          <div v-if="contract.file_attachments.length" class="space-y-3">
            <div v-for="file in contract.file_attachments" :key="file.id" class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <span class="min-w-0 truncate text-sm text-gray-700 dark:text-gray-300">{{ file.file_name }}</span>
              <button type="button" :disabled="downloadingFileId === file.id" @click="downloadFile(file)" class="shrink-0 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-60">
                {{ downloadingFileId === file.id ? 'Downloading...' : 'Download' }}
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">No generated file is attached to this contract.</p>
          <p v-if="errorMessage" class="mt-3 text-sm text-error-600">{{ errorMessage }}</p>
        </div>
      </div>
      <p v-else-if="errorMessage" class="text-sm text-error-600">{{ errorMessage }}</p>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400">Loading contract...</p>
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
const currentPageTitle = ref('Sign Contract')
type ContractFile = { id: number; file_name: string }
type Contract = { id: number; order_id: number; contract_date: string; file_attachments: ContractFile[] }

const contract = ref<Contract | null>(null)
const contractId = computed(() => Number(route.params.id))
const downloadingFileId = ref<number | null>(null)
const errorMessage = ref('')

const formatDate = (value: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadContract = async () => {
  const response = await fetch(`${API_BASE}/contracts/${contractId.value}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  if (!response.ok) throw new Error('Failed to load contract')
  const data = await response.json()
  contract.value = { ...data, file_attachments: data.file_attachments || [] }
}

const downloadFile = async (file: ContractFile) => {
  if (!contract.value) return
  downloadingFileId.value = file.id
  errorMessage.value = ''
  try {
    const response = await fetch(`${API_BASE}/files/orders/${contract.value.order_id}/${file.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!response.ok) throw new Error('Failed to download contract')
    const blobUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = file.file_name
    link.click()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to download contract'
  } finally {
    downloadingFileId.value = null
  }
}

onMounted(async () => {
  try {
    await loadContract()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load contract'
  }
})
</script>
