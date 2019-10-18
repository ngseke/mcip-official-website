import { SweetModal } from 'sweet-modal-vue'

const VueScrollTo = require('vue-scrollto')
const VueCountTo = require('vue-count-to')
const axios = require('axios')
const dayjs = require('dayjs')
const marked = require('marked')

const mcip = new Vue({
  el: `#app`,
  data: {
    // 頁面動畫: 根據滾動位置判斷
    isShrink: {
      nav: false,
      lineApp: true,
      payment: true,
      backstage: true,
      envelope: true,
    },
    // 聯絡我們
    contact: {},
    contactStatus: 0,   // 0: 預設, 1: 傳送中, 2: 成功
    errorMessage: null,
    // 數字累加動畫
    isCountedTo: false,
    // 最新消息
    articleList: null,
    currentArticle: null,
    isFetchingArticle: false,
    isArticleEnd: false,
    // Navbar
    isNavbarShow: false,
  },
  mounted () {
    this.initContactField()
    this.setShrink()
    this.fetchArticle()
  },
  methods: {
    // 根據目前捲軸位置，決定是否播放動畫
    setShrink () {
      window.addEventListener('scroll', (e) => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        const refs = this.$refs
        const getElementTop = this.getElementTop
        const isShrink = this.isShrink

        this.isShrink = {
          ...isShrink,
          nav: getElementTop(refs.lineAppSection) < 300,
        }

        if (isShrink.lineApp) this.isShrink.lineApp = getElementTop(refs.lineAppSection) > 200
        if (isShrink.payment) this.isShrink.payment = getElementTop(refs.paymentSection) > 250
        if (isShrink.backstage) this.isShrink.backstage = getElementTop(refs.backstageSection) > 250
        if (isShrink.envelope) this.isShrink.envelope = getElementTop(refs.contactSection) > 300

        if (top > 200 && !this.isCountedTo) this.startCountTo()
      })
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
    // 初始化聯絡我們欄位內容
    initContactField () {
      const fieldNames = [`name`, `email`, `phone`, `content`]
      this.contact = {}
      fieldNames.forEach(_ => this.contact[_] = ``)
    },
    // 送出聯絡我們表單
    async submitContact () {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/firestoreContact`

      this.errorMessage = null
      this.contactStatus = 1

      try {
        const res = await axios.post(url, { ...this.contact, source: 2, type: 2 })
        // await (new Promise(resolve => setTimeout(resolve, 1000)))
        this.contactStatus = 2
      } catch (e) {
        this.errorMessage = `發生了一些問題，請稍後再試`
        this.contactStatus = 0
      }
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
    showArticleModal (index) {
      this.currentArticle = null
      this.$nextTick(() => {
        this.currentArticle = { ...this.articleList[index] }
        this.$nextTick(() => this.$refs[`article-modal`].open())
      })
    },
    // 關閉文章視窗
    hideArticleModal () {
      this.$refs[`article-modal`].close()
    },
  },
  components: {
		SweetModal,
	}
})
