import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)


// if (import.meta.env.PROD) {
//     app.config.devtools = false // 배포환경에서 devtools 비활성화
// }

app.config.devtools = false // ← 항상 끄기 (개발/배포 모두)


app.use(router)

app.mount('#app')
