import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import VueApollo from 'vue-apollo'
// leave the export, even if you don't use it
// console.log(sessionStorage.getItem('token'))

export default ({ app, router, Vue }) => {
  // Vue.localStorage.set('someNumber', 123)
  // console.log(Vue.localStorage.get('someNumber'))
  // something to do
  const httpLink = new HttpLink({
    // You should use an absolute URL here
    // 'https://elsolo-api.herokuapp.com/api'
    // 'http://localhost:3000/api'
    uri: 'https://elsolo-api.herokuapp.com/api',
    credentials: 'include'
  })
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from session storage if it exists
    let token = localStorage.getItem('token')
    // try {
    //   token = document.cookie.slice('access_token='.length, document.cookie.length)
    // } catch (e) {
    //   token = ''
    // }
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
    connectToDevTools: true
  })
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient
  })
  Vue.use(VueApollo)
  Vue.use(apolloClient)
  app.provide = apolloProvider.provide()
}
