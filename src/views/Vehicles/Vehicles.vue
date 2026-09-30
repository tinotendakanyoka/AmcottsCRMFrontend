<template>
  <AdminLayout>
    <PageBreadcrumb page-title="Vehicles" />

    <ComponentCard title="Vehicles" desc="View and edit vehicle records.">
      <div v-if="errorMessage" class="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {{ successMessage }}
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr class="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Make</th>
              <th class="px-4 py-3">Model</th>
              <th class="px-4 py-3">Engine</th>
              <th class="px-4 py-3">VIN / Chassis</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading vehicles...</td>
            </tr>
            <tr v-else-if="vehicles.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No vehicles found.</td>
            </tr>
            <tr v-for="vehicle in vehicles" :key="vehicle.id" class="text-sm text-gray-700 dark:text-gray-300">
              <td class="px-4 py-3">#{{ vehicle.id }}</td>
              <td class="px-4 py-3">{{ vehicle.make || '—' }}</td>
              <td class="px-4 py-3">{{ vehicle.model || '—' }}</td>
              <td class="px-4 py-3">{{ vehicle.engine || '—' }}</td>
              <td class="px-4 py-3">{{ vehicle.chassis_number || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <button type="button" class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800" @click="openEdit(vehicle)">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ComponentCard>

    <div v-if="editingVehicle" class="fixed inset-0 z-[99999] overflow-y-auto bg-gray-900/50 p-4" @click.self="closeEdit">
      <div class="mx-auto my-8 w-full max-w-5xl rounded-xl bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Edit vehicle #{{ editingVehicle.id }}</h2>
          <button type="button" aria-label="Close vehicle editor" class="text-2xl leading-none text-gray-500 hover:text-gray-800 dark:hover:text-white" @click="closeEdit">&times;</button>
        </div>
        <VehicleForm :vehicle="editingVehicle" @saved="handleSaved" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_BASE } from '@/config'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import VehicleForm from '@/components/forms/FormElements/VehicleForm.vue'
import { getResponseErrorMessage } from '@/utils/validation'

type VehicleRecord = {
  id?: number | string
  make?: string
  model?: string
  engine?: string
  chassis_number?: string | null
  [key: string]: unknown
}

const vehicles = ref<VehicleRecord[]>([])
const editingVehicle = ref<VehicleRecord | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const fetchVehicles = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch(`${API_BASE}/vehicles/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!response.ok) throw new Error(await getResponseErrorMessage(response, 'Unable to load vehicles.'))
    vehicles.value = await response.json()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch vehicles'
  } finally {
    isLoading.value = false
  }
}

const openEdit = (vehicle: VehicleRecord) => {
  successMessage.value = ''
  errorMessage.value = ''
  editingVehicle.value = vehicle
}

const closeEdit = () => {
  editingVehicle.value = null
}

const handleSaved = (savedVehicle: VehicleRecord) => {
  const index = vehicles.value.findIndex((vehicle) => vehicle.id === savedVehicle.id)
  if (index !== -1) vehicles.value[index] = savedVehicle
  successMessage.value = 'Vehicle updated successfully.'
  closeEdit()
}

onMounted(fetchVehicles)
</script>