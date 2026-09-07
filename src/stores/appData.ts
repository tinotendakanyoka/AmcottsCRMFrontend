import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE } from '@/config'

export type AppDataRecord = Record<string, unknown>

export const useAppDataStore = defineStore('appData', () => {
    const selectedCustomer = ref<AppDataRecord | null>(null)
    const selectedVehicle = ref<AppDataRecord | null>(null)
    const userData = ref<AppDataRecord | null>(null)

    const fetchUserData = async (token?: string) => {
        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            const data = await response.json()
            userData.value = data
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const setSelectedCustomer = (customer: AppDataRecord | null) => {
        selectedCustomer.value = customer
    }

    const setSelectedVehicle = (vehicle: AppDataRecord | null) => {
        selectedVehicle.value = vehicle
    }
    const isLoading = ref(false)

    const loadAppData = async (token?: string) => {
        isLoading.value = true
        await fetchUserData(token)
        isLoading.value = false
    }

    const clearAppData = () => {
        selectedCustomer.value = null
        selectedVehicle.value = null
        userData.value = null
    }

    return {
        selectedCustomer,
        selectedVehicle,
        setSelectedCustomer,
        setSelectedVehicle,
        fetchUserData,
        userData,
        loadAppData,
        clearAppData,
    }
})