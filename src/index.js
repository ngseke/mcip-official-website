import Vue from 'vue'
import { SweetModal } from 'sweet-modal-vue'
import countTo from 'vue-count-to'
import axios from 'axios'
import { throttle, debounce } from 'throttle-debounce'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const VueScrollTo = require('vue-scrollto')
const dayjs = require('dayjs')
const marked = require('marked')

import ContactUs from '/components/ContactUs.vue'

Vue.use(VueScrollTo)
Vue.component('fa', FontAwesomeIcon)

library.add(faBars)

new Vue({
  el: '#app',
  data () {
    return {
      // 頁面動畫: 根據滾動位置判斷
      isShrink: {
        nav: false,
        lineApp: true,
        payment: true,
        backstage: true,
      },
      // 數字累加動畫
      isCountedTo: false,
      // 最新消息
      articleList: null,
      currentArticle: null,
      isFetchingArticle: false,
      isArticleEnd: false,
      // Navbar
      isNavbarShow: false,
    }
  },
  mounted () {
    this.setShrink()
    this.fetchArticle()
    this.setBodyClickHandler()
  },
  methods: {
    // 根據目前捲軸位置，決定是否播放動畫
    setShrink () {
      const throttled = throttle(300, () => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        const refs = this.$refs
        const getElementTop = this.getElementTop
        const isShrink = this.isShrink

        this.isShrink = {
          ...isShrink,
          nav: document.documentElement.scrollTop > 250,
        }

        if (isShrink.lineApp) this.isShrink.lineApp = getElementTop(refs.lineAppSection) > 200
        if (isShrink.payment) this.isShrink.payment = getElementTop(refs.paymentSection) > 250
        if (isShrink.backstage) this.isShrink.backstage = getElementTop(refs.backstageSection) > 250

        if (top > 100 && !this.isCountedTo) this.startCountTo()
      })
      
      window.addEventListener('scroll', throttled)
      this.$once('hook:beforeDestroy', () => window.removeEventListener('scroll', throttled))
    },
    setBodyClickHandler () {
      const handler = e => {
        const { navbarContent } = this.$refs
        if (!navbarContent.contains(e.target)) this.isNavbarShow = false
      }
      document.addEventListener('click', handler)
      this.$once('hook:beforeDestroy', () => document.removeEventListener('click', handler))
    },
    getElementTop (_) {
      return _ ? _.getBoundingClientRect().top : null
    },
    // 根據裝置取得不同的 Facebook 粉專連結(為了使用預設內置 app 開啟)
    getFacebookLink (id) {
      const device = new MobileDetect(window.navigator.userAgent)

      if (device.is(`iOS`)) return `fb://page/?id=${id}`
      else if (device.is(`AndroidOS`)) return `fb://page/${id}`
      else return `https://www.facebook.com/${id}`
    },
    // 播放數字累加動畫
    startCountTo () {
      this.$refs[`count-to-user`].start()
      this.$refs[`count-to-partner`].start()
      this.isCountedTo = true
    },
    // 取得最新消息
    async fetchArticle (after = null) {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/article/app`
      const limit = 3

      if (this.isFetchingArticle) return
      this.isFetchingArticle = true

      const list = (await axios.get(url, { params: { after, limit } })).data
        .sort((a, b) => b.timestamp - a.timestamp)

      if (!this.articleList) this.articleList = list
      else this.articleList = [...this.articleList, ...list]

      if (list.length < 3) this.isArticleEnd = true
      this.isFetchingArticle = false
    },
    // 將 timestamp 轉換為字串
    convertTime (_) {
      return dayjs(_).format('YYYY年MM月DD日')
    },
    // 將 md 語法轉換為 html
    convertMarkdown (_) {
      return marked(_)
    },
    // 彈出文章視窗
    async showArticleModal (index) {
      this.currentArticle = null
      await this.$nextTick()
      this.currentArticle = { ...this.articleList[index] }
      await this.$nextTick()
      this.$refs[`article-modal`].open()
    },
    // 關閉文章視窗
    hideArticleModal () {
      this.$refs[`article-modal`].close()
    },
  },
  components: {
		SweetModal,
		countTo,
    'contact-us': ContactUs,
	}
})