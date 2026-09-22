<template>
  <fieldset :disabled="isSubmitted" class="space-y-5 p-2">
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Make</label>
        <select v-model="selectedMakeId" :disabled="isSubmitted" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
          <option value="">Select a make</option>
          <option v-for="make in makes" :key="make.id" :value="String(make.id)">{{ make.make_name }}</option>
        </select>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Model</label>
        <select v-model="form.model" :disabled="isSubmitted || !selectedMakeId || isLoadingModels" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
          <option value="">{{ isLoadingModels ? 'Loading models...' : 'Select a model' }}</option>
          <option v-for="model in models" :key="model.id" :value="model.model_name">{{ model.model_name }}</option>
        </select>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Engine number</label>
        <input v-model="form.engine" :disabled="isSubmitted" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Transmission</label>
        <select v-model="form.transmission" :disabled="isSubmitted" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
          <option value="">Select transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">VIN / Chassis number</label>
        <input v-model="form.chassis_number" :disabled="isSubmitted" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
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

    <div class="flex items-center justify-end pt-2">
      <p v-if="errorMessage" class="text-sm text-error-600">{{ errorMessage }}</p>
      <button type="button" :disabled="isSubmitted || isSaving" @click="saveVehicle" class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-900">
        {{ isSubmitted ? 'Vehicle Saved' : isSaving ? 'Saving...' : 'Save Vehicle' }}
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { API_BASE } from '@/config'
import { useAppDataStore } from '@/stores/appData'

const appDataStore = useAppDataStore()

type VehicleMake = { id: number; make_name: string }
type VehicleModel = { id: number; model_name: string; make_id: number }

const makes = ref<VehicleMake[]>([])
const models = ref<VehicleModel[]>([])
const selectedMakeId = ref('')
const isLoadingModels = ref(false)
const isSaving = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const form = reactive({
  make: '',
  model: '',
  engine: '',
  transmission: '',
  chassis_number: '',
  color: '',
  tyre_size_and_make: '',
  modifications_special_instructions: '',
  extra_options: '',
  vid_or_cof: false,
  sign_writing: false,
  reflective_tape: false,
  multi_functional_steering: false,
})

const fetchMakes = async () => {
  const response = await fetch(`${API_BASE}/vehicles/makes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  if (!response.ok) throw new Error('Failed to load vehicle makes')
  makes.value = await response.json()
}

const fetchModels = async (makeId: string) => {
  models.value = []
  form.model = ''
  if (!makeId) return

  isLoadingModels.value = true
  try {
    const response = await fetch(`${API_BASE}/vehicles/make/${makeId}/models`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!response.ok) throw new Error('Failed to load vehicle models')
    models.value = await response.json()
  } finally {
    isLoadingModels.value = false
  }
}

watch(selectedMakeId, fetchModels)

const saveVehicle = async () => {
  if (isSubmitted.value || isSaving.value) return
  errorMessage.value = ''
  isSaving.value = true
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
    chassis_number: form.chassis_number || null,
    extra_options: form.extra_options || null,
    tyre_size_and_make: form.tyre_size_and_make || null,
    multi_functional_steering: form.multi_functional_steering,
    modifications_special_instructions: form.modifications_special_instructions || null,
  }

  try {
    const response = await fetch(`${API_BASE}/vehicles/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const savedVehicle = await response.json()
    appDataStore.setSelectedVehicle(savedVehicle)
    isSubmitted.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save vehicle'
    console.error('Failed to create vehicle:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    await fetchMakes()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load vehicle makes'
  }
})
</script>
