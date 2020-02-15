import Vue from 'vue'
import countTo from 'vue-count-to'
import { throttle } from 'throttle-debounce'

import { common } from '/common'

const VueScrollTo = require('vue-scrollto')
const dayjs = require('dayjs')
const marked = require('marked')
const MobileDetect = require('mobile-detect')

import ContactUs from '/components/ContactUs.vue'
import Navbar from '/components/Navbar.vue'
import TopProgressBar from '/components/TopProgressBar.vue'

Vue.use(VueScrollTo)

new Vue({
  el: '#app',
  mixins: [common],
  data () {
    return {
      // 頁面動畫: 根據滾動位置判斷
      isShrink: {
        lineApp: true,
        payment: true,
        backstage: true,
      },
      // 數字累加動畫
      isCountedTo: false,
      // 最新消息
      isArticleEnd: false,
    }
  },
  mounted () {
    this.setOnScroll()
    this.fetchArticleList()
  },
  methods: {
    // 根據目前捲軸位置，決定是否播放動畫
    setOnScroll () {
      const throttled = throttle(300, () => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        const { lineAppSection, paymentSection, backstageSection } = this.$refs
        const getElementTop = this.getElementTop
        const isShrink = this.isShrink
 
        if (isShrink.lineApp) this.isShrink.lineApp = getElementTop(lineAppSection) > 200
        if (isShrink.payment) this.isShrink.payment = getElementTop(paymentSection) > 250
        if (isShrink.backstage) this.isShrink.backstage = getElementTop(backstageSection) > 250

        if (top > 100 && !this.isCountedTo) this.startCountTo()
      })
      
      window.addEventListener('scroll', throttled)
      this.$once('hook:beforeDestroy', () => window.removeEventListener('scroll', throttled))
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
      [`count-to-user`, `count-to-partner`].forEach(name => {
        this.$refs[name] && this.$refs[name].start()
      })
      this.isCountedTo = true
    },
    // 將 timestamp 轉換為字串
    convertTime (_) {
      return dayjs(_).format('YYYY年MM月DD日')
    },
    // 將 md 語法轉換為 html
    convertMarkdown (_) {
      return marked(_)
    },
    // 關閉文章視窗
    hideArticleModal () {
      this.$refs[`article-modal`].close()
    },
  },
  components: {
		countTo,
    'contact-us': ContactUs,
    navbar: Navbar,
    'top-progress-bar': TopProgressBar,
	}
})