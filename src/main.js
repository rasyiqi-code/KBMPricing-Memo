import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupDragScroll } from './directives/dragScroll.js'

setupDragScroll()

createApp(App).mount('#app')

