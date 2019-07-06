const VueScrollTo = require('vue-scrollto')
const VueCountTo = require('vue-count-to')
const axios = require('axios')
const dayjs = require('dayjs')
const marked = require('marked')

import { SweetModal } from 'sweet-modal-vue'

const mcip = new Vue({
  el: `#app`,
  data: {
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
    isEnvelopeShrink: false,
    contact: { name: '', email: '',   phone: '', content:'' },
    contactStatus: 0, // 0: 預設, 1: 傳送中, 2: 成功
    errorMessage: null,
    isCountedTo: false,
    articleList: null,
    currentArticle: null,
  },
  mounted () {
    this.setShrink()
    this.fetchArticle()
  },
  methods: {
    setShrink () {
      window.addEventListener('scroll', (e) => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        this.isNavShrink = this.$refs.lineAppSection.getBoundingClientRect().top < 100

        if (this.$refs.lineAppSection && this.$refs.contactSection) {
          this.isLineAppScreenshotShrink = this.$refs.lineAppSection.getBoundingClientRect().top > 200
          this.isEnvelopeShrink = this.$refs.contactSection.getBoundingClientRect().top > 500
        }

        if (top > 250 && !this.isCountedTo) this.startCountTo()
      })
    },
    getFacebookLink (id) {
      const device = new MobileDetect(window.navigator.userAgent)

      if (device.is(`iOS`)) return `fb://page/?id=${id}`
      else if (device.is(`AndroidOS`)) return `fb://page/${id}`
      else return `https://www.facebook.com/${id}`
    },
    submitContact () {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/firestoreContact`

      this.errorMessage = null
      this.contactStatus = 1

      axios.post(url, this.contact)
        .then(res => {
          console.log(res)
          this.contactStatus = 2
        }).catch(e => {
          this.errorMessage = `發生了一些問題，請稍後再試`
          this.contactStatus = 0
        })
    },
    startCountTo () {
      this.$refs[`count-to-user`].start()
      this.$refs[`count-to-partner`].start()
      this.isCountedTo = true
    },
    fetchArticle (after = null) {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/article/app`
      const limit = 3

      this.articleList = null

      axios.get(url, { params: { after, limit } })
        .then(res => {
          this.articleList = res.data
          console.log(res.data)
        }).catch(e => {
        })
    },
    convertTime (_) {
      return dayjs(_).format('YYYY年MM月DD日')
    },
    convertMarkdown (_) {
      return marked(_)
    },
    fetchArticleImageUrl (file) {
      return `https://us-central1-mc-integration-platform.cloudfunctions.net/` + file
    },
    showArticleModal (index) {
      this.currentArticle = { ...this.articleList[index] }
      this.$refs[`article-modal`].open()
    },
    hideArticleModal () {
      this.$refs[`article-modal`].close()
    },
  },
  components: {
		SweetModal,
	}
})
