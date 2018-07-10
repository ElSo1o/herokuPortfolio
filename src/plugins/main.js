import('animate.css/animate.css')
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import VueProgressBar from 'vue-progressbar'
const parseJwt = (token) => {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}
// vue.use(vuescroll)
export default ({ app, router, Vue }) => {
  // console.log(parseJwt())
  // something to do
  Vue.use(VueProgressBar, {
    color: '#21ba45',
    failedColor: 'red',
    thickness: '4px',
    location: 'bottom'
  })
  Vue.use(vuescroll)
  router.beforeEach((to, from, next) => {
    // console.log(to)
    if (to.name === 'index' || to.name === 'home' || to.name === 'skills' || to.name === 'contacts' || to.name === 'portfolio') {
      if (localStorage.getItem('token') === null) {
        next({name: 'login'})
      } else {
        try {
          const token = parseJwt(localStorage.getItem('token'))
          if (token.id) {
            // console.log(token)
            next()
          } else {
            next({name: 'login'})
          }
        } catch (err) {
          if (err) {
            console.log(err)
            next({name: 'login'})
          }
        }
        // next()
      }
    } else if (to.name === 'login') {
      try {
        const token = parseJwt(localStorage.getItem('token'))
        if (token) {
          next({name: 'home'})
        }
      } catch (err) {
        if (err) {
          console.log(err)
          next()
        }
      }
      next()
    } else {
      next()
    }
  })
}
