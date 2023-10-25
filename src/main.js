import { createApp } from 'vue'
import App from 'src/App.vue'
import store from 'src/store/index'
import router from './router/routes'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#main')
