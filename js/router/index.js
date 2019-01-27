import Import from '../../components/Import.vue'
import Dashboard from '../../components/Dashboard.vue'
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [  
    {
        path: '/',
        name: 'import',
        component: Import       
    },
    {
      path:'/dash',
      name:'dashboard',
      component:Dashboard
    }
  ]
})
export default router