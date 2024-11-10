import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import Vue3TouchEvents, {
    type Vue3TouchEventsOptions,
  } from "vue3-touch-events";
  

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false
    // any other global options...
  })
app.use(router)
app.use(VueTailwindDatepicker)

app.mount('#app')






