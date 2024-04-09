import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export * from './modules/account'
export * from './modules/permission'

const pinia = createPinia()
pinia.use(persist)

export default pinia
