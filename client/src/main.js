import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import JsonViewer from 'vue-json-viewer'

createApp(App).use(router).use(JsonViewer).mount('#app')
