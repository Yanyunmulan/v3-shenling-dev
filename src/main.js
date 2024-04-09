import { createApp } from 'vue'
import './styles/main.scss'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import Icons from './components/Icons'
import directive from './directive'
import './permission'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(directive)
app.use(Icons)

app.mount('#app')
