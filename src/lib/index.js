import VueSimpleUpload from './Upload.vue'
const VueComponent = {
  install: function(Vue) {
    Vue.component('vue-simple-upload', VueSimpleUpload)
  }
}
// 这里的判断很重要
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueComponent)
}
export default VueComponent

export { VueSimpleUpload }
