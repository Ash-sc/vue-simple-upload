import Vue from 'vue'
import App from './App.vue'
import VueSimpleUpload from './lib/index.js'

Vue.use(VueSimpleUpload)

new Vue({
  el: '#app',
  render: h => h(App)
})
