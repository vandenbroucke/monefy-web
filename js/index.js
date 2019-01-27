import Vue from 'vue'
import App from './../components/App.vue'
import router from './../js/router/index.js'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons';
import store from './store'
UIkit.use(Icons)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})