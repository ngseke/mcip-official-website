const mcip = new Vue({
  el: `#app`,
  data: {
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
    logoKey: 0,
  },
  mounted () {
    this.setShrink()
    this.logoKey++
    console.log(`Hey! You found me ☺️! `)
  },
  methods: {
    setShrink () {

      window.addEventListener('scroll', (e) => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        this.isNavShrink = this.$refs.lineAppSection.getBoundingClientRect().top < 100
        if (this.$refs.lineAppSection)
          this.isLineAppScreenshotShrink = this.$refs.lineAppSection.getBoundingClientRect().top > 200
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
