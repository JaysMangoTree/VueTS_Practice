import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './style.css' // keep your globals if you have them

createApp(App).use(vuetify).mount('#app')