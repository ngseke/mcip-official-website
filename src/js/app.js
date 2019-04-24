const mcip = new Vue({
  el: `#app`,
  data: {
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
    isEnvelopeShrink: false,
    contact: { name: '黃省喬', email: 'test@nobody.com',   phone: '', content:'' },
    contactStatus: 0, // 0: 預設, 1: 傳送中, 2: 成功
    errorMessage: null,
  },
  mounted () {
    this.setShrink()
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
      })
    },
    getFacebookLink (id) {
      const device = new MobileDetect(window.navigator.userAgent)

      if (device.is(`iOS`)) return `fb://page/?id=${id}`
      else if (device.is(`AndroidOS`)) return `fb://page/${id}`
      else return `https://www.facebook.com/${id}`
    },
    submitContact () {
      this.errorMessage = null
      this.contactStatus = 1
      fetch('https://us-central1-mc-integration-platform.cloudfunctions.net/firestoreContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.contact)
      })
        .then(res => {
          if (!res.ok)
            throw Error(res.statusText)
          return res
        }).then((jsonData) => {
          this.contactStatus = 2
        }).catch((e) => {
          this.errorMessage = `發生了一些問題，請稍後再試`
          this.contactStatus = 0
        })
    }
  }
})
