import { createApp } from 'vue'
import App from '@/App.vue'

import { router } from '@/router'
import { store } from '@/store/create-store'

import {
  I18nPlugin,
  VueGlobalPropertiesPlugin
} from '@/plugins'

import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

import '@/assets/styles/main.scss'
import '@/assets/styles/button-styles.scss'

const app = createApp(App)

const vueTelInputOptions = {
  mode: 'international',
  onlyCountries: [],
  preferredCountries: ['UA', 'US', 'GB', 'CA', 'AU'],
  enabledFlags: true,
  enabledCountryCode: true,
  enabledDialCode: true,
  disabledFetchingCountry: false,
  autoDefaultCountry: true,
  defaultCountry: 'UA',
  dropdownOptions: {
    showDialCodeInList: true,
    showFlags: true,
    showSearchBox: true,
  }
}

app
  .use(store)
  .use(router)
  .use(I18nPlugin)
  .use(VueGlobalPropertiesPlugin)
  .use(VueTelInput, vueTelInputOptions)

router.isReady().then(() => {
  app.mount('#app')
})

export {
  app
}
