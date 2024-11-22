import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vueDoubleSlider from 'vue-double-slider' 
import './assets/main.css'
import 'vue-double-slider/dist/style.css' 
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import Vue3TouchEvents, {
    type Vue3TouchEventsOptions,
  } from "vue3-touch-events";

import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'
// Vuetify
import * as components from 'vuetify/components'
import LogRocket from 'logrocket';
import { supabase } from './lib/supabaseClient'
LogRocket.init('t47bce/synapse');
  const user =  supabase.auth.getUser().then((user) => {
  LogRocket.identify( user?.data?.user?.user_metadata?.sub, {
    name: user?.data?.user?.user_metadata?.username,
  });
  });


const app = createApp(App)
app.component('DefaultLayout', DashboardLayout)
app.component("vue-tailwind-datepicker",VueTailwindDatepicker)

app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false
  })
app.use(router)

app.use(vueDoubleSlider)
app.use(SnackbarService);

app.mount('#app')








