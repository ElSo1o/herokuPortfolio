<template>
  <vue-scroll :ops="ops">
    <loading v-if="loading">
      <template slot="toDo">
        <p>Loading...</p>
      </template>
    </loading>
    <div class="contentPortfolio">
        <div>
          <div style="margin-bottom: 40px;">
            <h3>This page displays my past work,since the data is downloaded from the database for the sake of interest, I allowed to vote for the project</h3>
          </div>
          <div class="portfolio-flex">
            <div class="card shadow-4" v-for="(item, i, key) in getProjects" :key="key">
              <div class="img">
                <img :src="`https://elsolo-api.herokuapp.com/images/projects/${item.img}`">
              </div>
              <div class="hr"></div>
              <div class="rating">
                <div class="titlePortfolio">
                  <h5>{{item.name}}</h5>
                  <p :data-link=item.src @click="redirectLink" class="links">Look at</p>
                </div>
                <div class="ratingContent">
                  <q-rating slot="subtitle" @input="changedRating(item.rating.data, item.id)" :data-id="item.id" v-model="item.rating.data" :max="5" />
                  <p>Voted: <span>{{item.rating.counter}}</span></p>
                </div>
              </div>
              <div class="description">
                <q-collapsible icon="info" label="About project" icon-toggle>
                  <div class="descriptionToggle">{{item.description}}</div>
                </q-collapsible>
              </div>
            </div>
          </div>
        </div>
    </div>
  </vue-scroll>
</template>

<script>
import gql from 'graphql-tag'
const loadPortfolio = gql`
      query projects{
      projects{
        id
        name
        img
        src
        description
        rating{
          data
          counter
        }
      }
    }
`
const changedRating = gql`
    mutation changedRating ($id: Int!, $value: Int!){
    changedRating (id:$id, rating:$value) {
      id
      name
      img
      src
      description
      rating{
        data
        counter
      }
    }
  }
`
import loading from 'src/components/UI_components/Loading'
export default {
  name: 'portfolio',
  components: {
    loading
  },
  data () {
    return {
      stars: 2,
      ops: {
        vuescroll: {
          mode: 'native'
        },
        scrollPanel: {
          scrollingX: false
        },
        scrollContent: {

        },
        vRail: {
          pos: 'right',
          opacity: 0.5,
          background: '#01a99a'
        }
      },
      loading: false,
      dataProjects: []
    }
  },
  methods: {
    toggleLoading () {
      this.loading = !this.loading
      return this.loading
    },
    changedRating (value, id) {
      console.log(value)
      console.log(id)
      this.$apollo.mutate({
        mutation: changedRating,
        variables: {
          id: id,
          value: value
        }
      }).then((response) => {
        console.log(response.data.changedRating)
        this.dataProjects.forEach(item => {
          if (item.id === response.data.changedRating.id) {
            item.rating = response.data.changedRating.rating
          }
        })
        console.log(this.dataProjects)
      }).catch((error) => {
        console.log(error.message)
        localStorage.removeItem('token')
        setTimeout(() => { this.$router.push({name: 'login'}) }, 0)
      })
    },
    redirectLink (e) {
      window.open(e.target.dataset.link)
    }
  },
  computed: {
    getProjects () {
      let sortArray = this.dataProjects
      sortArray.sort((a, b) => {
        return a.id - b.id
      })
      return sortArray
    }
  },
  mounted: function () {
    this.toggleLoading()
    this.$apollo.query({
      query: loadPortfolio
    }).then((response) => {
      response = JSON.parse(JSON.stringify(response))
      console.log(response.data)
      this.dataProjects = response.data.projects
      this.toggleLoading()
    }).catch((error) => {
      console.log(error)
      localStorage.removeItem('token')
      setTimeout(() => { this.$router.push({name: 'login'}) }, 0)
      // if (error.networkError.statusCode === 401) {
      // }
      // if (error.networkError.statusCode === 500) {
      // }
    })
  }
}
</script>

<style scoped>
  .card{
    box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    max-width: 300px;
    background: rgba(223,226,226,0.239);
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }
  h3{
    text-transform: uppercase;
    font-size: 24px;
    font-weight: 200;
  }
  img{
    width: 100%;
  }
  .rating{
    text-align: left;
    padding: 8px 16px;
    font-size: 21px;
  }
  .descriptionToggle{
    text-align: left;
    font-size: 18px;
    font-weight: 400;
  }
  .ratingContent{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ratingContent > p{
    font-size: 16px;
    font-weight: 200;
  }
  .ratingContent > p > span{
    font-weight: 600;
    font-size: 18px;
  }
  .portfolio-flex{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .titlePortfolio{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .titlePortfolio > p{
    cursor: pointer;
    margin: 0;
  }
  .titlePortfolio > h5{
    font-size: 21px;
  }
</style>
