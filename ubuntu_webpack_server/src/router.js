import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'
import Gallery from './views/Gallery.vue'
import LoginComponent from "./views/Login.vue"
import CameraComponent from "./components/Camera.vue"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginComponent
    },
    { 
      path: '/Gallery',
      name: 'Gallery',
      component: Gallery
    },
    {
      path: "/Camera/:Username",
      name: "Camera",
      component: CameraComponent
    }
  ]
})
