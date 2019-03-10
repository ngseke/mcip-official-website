const mcip = new Vue({
  el: `#app`,
  data: {
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
    isEnvelopeShrink: false,
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
          console.log(this.$refs.contactSection.getBoundingClientRect().top)
        }
      })
    },
    getFacebookLink (id) {
      const device = new MobileDetect(window.navigator.userAgent)

      if (device.is(`iOS`)) return `fb://page/?id=${id}`
      else if (device.is(`AndroidOS`)) return `fb://page/${id}`
      else return `https://www.facebook.com/${id}`
    }
  }
})
