import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootswatch/dist/brite/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './assets/styles.css'
import i18n from './locales'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
