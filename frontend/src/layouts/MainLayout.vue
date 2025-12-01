<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-deep-purple-12">
        <q-toolbar-title>
          Printer Emulator
        </q-toolbar-title>

        <q-btn flat dense color="primary" @click="GoToGitHub" class=" text-white q-mr-s"><q-icon class="text-h4"
            name="code" />
          @github/Dchupp</q-btn>
        <q-btn dense flat color="primary" class="text-white" @click="GoToLinkedin"><q-icon class="text-h4"
            name="perm_contact_calendar" />
          @linkedin/Dchupp</q-btn>
        <div>
          <q-icon name="electric_bolt" /> v2.2.2
        </div>
      </q-toolbar>

      <!-- Navigation Bar -->
      <q-tabs v-model="currentTab" class="bg-deep-purple-10" active-color="white" indicator-color="white" align="left">
        <q-tab name="emulator" label="Printer Emulator" icon="print" @click="navigateToEmulator" />
        <q-tab name="designer" label="Label Designer" icon="design_services" @click="navigateToDesigner" />
      </q-tabs>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BrowserOpenURL } from 'app/wailsjs/runtime/runtime';

const router = useRouter()
const route = useRoute()
const currentTab = ref('emulator')

// Set initial tab based on current route
onMounted(() => {
  updateTabFromRoute()
})

// Watch for route changes to update active tab
watch(() => route.path, () => {
  updateTabFromRoute()
})

function updateTabFromRoute() {
  if (route.path === '/designer') {
    currentTab.value = 'designer'
  } else {
    currentTab.value = 'emulator'
  }
}

function navigateToEmulator() {
  router.push('/')
  currentTab.value = 'emulator'
}

function navigateToDesigner() {
  router.push('/designer')
  currentTab.value = 'designer'
}

function GoToLinkedin() {
  BrowserOpenURL('https://www.linkedin.com/in/david-chupp/')
}

function GoToGitHub() {
  BrowserOpenURL('https://github.com/dchupp/printerEmulator')
}
</script>
