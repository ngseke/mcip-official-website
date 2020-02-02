import { SweetModal } from 'sweet-modal-vue'

const VueScrollTo = require('vue-scrollto')
const VueCountTo = require('vue-count-to')
const axios = require('axios')
const dayjs = require('dayjs')
const marked = require('marked')

const mcip = new Vue({
  el: `#app`,
  data () {
    this.fieldNames = [`name`, `email`, `phone`, `content`]
    return {
      // 頁面動畫: 根據滾動位置判斷
      isShrink: {
        nav: false,
        lineApp: true,
        payment: true,
        backstage: true,
        envelope: true,
      },
      // 聯絡我們
      contact: { name: '',  email: '', phone: '', content: '' },
      isCaptchaShow: false,
      captchaCode: null,
      captchaAnswer: null,
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
    }
  },
  mounted () {
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

        if (top > 100 && !this.isCountedTo) this.startCountTo()
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
    createdCaptcha () {
      this.captchaAnswer = (~~(Math.random() * 10**4)).toString().padStart(4, 0)
      const text = this.captchaAnswer.split('').map(i => {
        return '零一二三四五六七八九零壹貳參肆伍陸柒捌玖'.split('')[+i + ((Math.random() > .5) ? 10 : 0)]
      }).join('')
      console.log(this.captchaAnswer)
      
      const el = this.$refs.captcha
      const ctx = el.getContext('2d')
      ctx.clearRect(0, 0, el.width, el.height)
      const gradient = ctx.createLinearGradient(0, 0, el.width, 0)
      const gradientList = ['#2af1fb', '#2aeefb', '#34d2fb', '#45bdfa', '#50b0fa', '#54adfa', '#bf9ff2']
      gradientList.forEach((i, index) => {
        gradient.addColorStop(index / gradientList.length, i)
      })
      
      ctx.font = '16px sans Serif'
      ctx.fillStyle = gradient
      ctx.textBaseline = 'middle'
      const textWidth = ctx.measureText(text).width
      ctx.fillText(text, (el.width / 2) - (textWidth / 2) + Math.random() * 50 - 25, 10 + Math.random() * 20)
    }
  },
  computed: {
    isSubmitDisabled () {
      return this.contactStatus === 1 || this.captchaCode !== this.captchaAnswer
    }
  },
  watch: {
    contact: {
      async handler (value) {
        if (this.isCaptchaShow) return
        if (this.fieldNames.filter(i => i !== 'phone').every(i => value[i])) {
          this.isCaptchaShow = true
          await this.$nextTick()
          this.createdCaptcha()
        }
      },
      deep: true,
    }
  },
  components: {
		SweetModal,
	}
})
