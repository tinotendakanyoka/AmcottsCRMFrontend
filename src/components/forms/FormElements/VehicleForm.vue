<template>
  <div class="space-y-5 p-2">
    <div class="space-y-2">
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Select vehicle</label>
      <select v-model="selectedVehicleId" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
        <option value="">Select a vehicle</option>
        <option value="new">Add New Vehicle</option>
        <option v-for="vehicle in vehicles" :key="vehicle.id" :value="String(vehicle.id)">
          {{ vehicle.make }} {{ vehicle.model }}
        </option>
      </select>
    </div>

    <div v-if="newVehicle" class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Make</label>
        <input v-model="form.make" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Model</label>
        <input v-model="form.model" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Engine number</label>
        <input v-model="form.engine" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Transmission</label>
        <input v-model="form.transmission" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Colour</label>
        <input v-model="form.color" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Tyre size / make</label>
        <input v-model="form.tyre_size_and_make" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div class="md:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Modifications / special instructions</label>
        <textarea v-model="form.modifications_special_instructions" rows="3" class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
      </div>

      <div class="md:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Extra options</label>
        <input v-model="form.extra_options" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div class="md:col-span-2">
        <fieldset class="space-y-3">
          <legend class="text-sm font-medium text-gray-700 dark:text-gray-400">Vehicle Specifications</legend>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.vid_or_cof" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
              <span class="text-sm text-gray-700 dark:text-gray-400">VID or COF</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.sign_writing" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
              <span class="text-sm text-gray-700 dark:text-gray-400">Sign Writing</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.reflective_tape" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
              <span class="text-sm text-gray-700 dark:text-gray-400">Reflective Tape</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.multi_functional_steering" type="checkbox" class="rounded border-gray-300 bg-white text-brand-500 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900" />
              <span class="text-sm text-gray-700 dark:text-gray-400">Multi-function Steering Wheel</span>
            </label>
          </div>
        </fieldset>
      </div>
    </div>

    <div v-if="newVehicle" class="flex items-center justify-end pt-2">
      <button type="button" @click="saveVehicle" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
        Save Vehicle
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { API_BASE } from '@/config'
import { useAppDataStore } from '@/stores/appData'

const appDataStore = useAppDataStore()
const { selectedVehicle } = storeToRefs(appDataStore)

const vehicles = ref<any[]>([])
const selectedVehicleId = ref('')
const newVehicle = ref(false)

const form = reactive({
  make: '',
  model: '',
  engine: '',
  transmission: '',
  color: '',
  tyre_size_and_make: '',
  modifications_special_instructions: '',
  extra_options: '',
  vid_or_cof: false,
  sign_writing: false,
  reflective_tape: false,
  multi_functional_steering: false,
})

watch(
  () => selectedVehicle.value,
  (vehicle) => {
    selectedVehicleId.value = vehicle ? String(vehicle.id ?? '') : ''
    newVehicle.value = !vehicle
  },
  { immediate: true }
)

watch(selectedVehicleId, (vehicleId) => {
  if (!vehicleId) {
    appDataStore.setSelectedVehicle(null)
    newVehicle.value = true
    return
  }

  if (vehicleId === 'new') {
    appDataStore.setSelectedVehicle(null)
    newVehicle.value = true
    return
  }

  const vehicle = vehicles.value.find((item) => String(item.id ?? '') === String(vehicleId))
  appDataStore.setSelectedVehicle(vehicle || null)
  newVehicle.value = false
})

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

const saveVehicle = async () => {
  const token = localStorage.getItem('token')
  const payload = {
    make: form.make,
    model: form.model,
    engine: form.engine,
    transmission: form.transmission,
    color: form.color,
    vid_or_cof: form.vid_or_cof,
    sign_writing: form.sign_writing,
    reflective_tape: form.reflective_tape,
    extra_options: form.extra_options || null,
    tyre_size_and_make: form.tyre_size_and_make || null,
    multi_functional_steering: form.multi_functional_steering,
    modifications_special_instructions: form.modifications_special_instructions || null,
  }

  const response = await fetch(`${API_BASE}/vehicles/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('Failed to create vehicle:', text)
    return
  }

  const savedVehicle = await response.json()
  await fetchVehicles()
  selectedVehicleId.value = String(savedVehicle.id ?? '')
  appDataStore.setSelectedVehicle(savedVehicle)
  newVehicle.value = false
}

onMounted(async () => {
  await fetchVehicles()
})
</script>
