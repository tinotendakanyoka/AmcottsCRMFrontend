<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" src="/images/logo/logo-light.png" alt="Logo" />
    <img class="hidden dark:block" src="/images/logo/logo-dark.png" alt="Logo" />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
