<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="Customer Information">
          <CustomerForm />
        </ComponentCard>
      </div>
      <div class="space-y-6">
        <ComponentCard title="Vehicle Information"> <VehicleForm /> </ComponentCard>
      </div>
      
      
    </div>
    <div class="w-full p-6">
        <ComponentCard title="Order Information"> <OrderForm /> </ComponentCard>
      </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import OrderForm from '@/components/forms/FormElements/OrderForm.vue'
import CustomerForm from '@/components/forms/FormElements/CustomerForm.vue'
import VehicleForm from '@/components/forms/FormElements/VehicleForm.vue'

import { storeToRefs } from 'pinia'
import { useAppDataStore } from '@/stores/appData'

const appData = useAppDataStore()
const { selectedCustomer } = storeToRefs(appData)

watch(selectedCustomer, (newCustomer) => {
  if (newCustomer) {
    const customerName = newCustomer.company_name || newCustomer.customer_name || newCustomer.name || 'Customer'
    currentPageTitle.value = `Create Order for ${customerName}`
  } else {
    currentPageTitle.value = 'Create Order'
  }
})

const currentPageTitle = ref('Create Order')
</script>
