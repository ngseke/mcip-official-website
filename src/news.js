import Vue from 'vue'
import axios from 'axios'

const dayjs = require('dayjs')
const marked = require('marked')
const queryString = require('query-string')
 
import Navbar from '/components/Navbar.vue'
import TopProgressBar from '/components/TopProgressBar.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
 
library.add(faAngleLeft)
Vue.component('fa', FontAwesomeIcon)

new Vue({
  el: '#app',
  data () {
    return {
      percentage: 0,
      data: null,
    }
  },
  mounted () {
    if (!this.id) this.goToIndex()
    this.fetch()
  },
  methods: {
    async fetch () {
      const { id } = this
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/article/app`
      this.percentage = .5
      
      this.data = (await axios.get(url, { params: { id } })).data
      
      const { title, article } = this.data
 
      this.setTitle(title.trim())
      this.setMeta(article.replace(title, '').replace(/\n/g, ' ').substr(0, 150).trim())
      
      this.percentage = 1
    },
    convertTime (_, format = 'YYYY年MM月DD日') {
      return dayjs(_).format(format)
    },
    convertMarkdown (_) {
      return marked(_)
    },
    goToIndex () {
      window.location.href = '/'
    },
    setTitle (_) {
      document.title = `${_} - 最新消息 - 樂台計畫`
    },
    setMeta (_) {
      document.getElementsByTagName('meta')['description'].content = _
    },
  },
  computed: {
    id () {
      const parsed = queryString.parse(location.search)
      return parsed.id
    },
  },
  components: {
    navbar: Navbar,
    'top-progress-bar': TopProgressBar,
	}
})