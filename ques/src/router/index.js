import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import HomeUsers from '@/components/HomeUsers.vue'
import HomeMenus from '@/components/HomeMenus.vue'
import UserAdd from '@/components/UserAdd.vue'
import UserEdit from '@/components/UserEdit.vue'
import HomeOutlines from '@/components/HomeOutlines.vue'
import Register from '@/components/Register.vue'
import HomeItems from '@/components/HomeItems.vue'
import HomeClasses from '@/components/HomeClasses.vue'
import HomePapers from '@/components/HomePapers.vue'
import PapersAdd from '@/components/PapersAdd.vue'
import PapersEdit from '@/components/PapersEdit.vue'
import Publish from '@/components/Publish.vue'
import Personal from '@/components/Personal.vue'
import Analysis from '@/components/Analysis.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:{name:'users'}
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect:{name:'users'},
      children:[
        {
          path: 'users',
          name: 'users',
          component: HomeUsers
        },
        {
          path: 'users/add',
          name: 'usersAdd',
          component: UserAdd
        },
        {
          path: 'users/edit/:id',
          name: 'usersEdit',
          component: UserEdit,
          props:true,
        },
        {
          path: 'menus',
          name: 'menus',
          component: HomeMenus
        },
        {
          path: 'outlines',
          name: 'outlines',
          component: HomeOutlines
        },
        {
          path: 'items',
          name: 'items',
          component: HomeItems
        },
        {
          path: 'classes',
          name: 'classes',
          component: HomeClasses
        },
        {
          path: 'papers',
          name: 'papers',
          component: HomePapers
        },
        {
          path: 'paperadd',
          name: 'PapersAdd',
          component: PapersAdd
        },
        {
          path: 'paperedit/:id',
          name: 'PapersEdit',
          component: PapersEdit,
          props:true,
        },
        {
          path: 'personalcenter',
          name: 'personal',
          component: Personal,
          props:true,
        },
        {
          path: 'analysis/:id',
          name: 'analysis',
          component: Analysis,
          props:true,
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/regist',
      name: 'regist',
      component:Register
    },
    {
      path: '/publish/:id',
      name: 'publish',
      component:Publish,
      props:true,
    }    
  ]
})
