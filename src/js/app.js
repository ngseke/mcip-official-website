const mcip = new Vue({
  el: `#app`,
  data: {
    msg: `hello`,
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
  },
  mounted () {
    this.setShrink()
  },
  methods: {
    setShrink () {
      window.addEventListener('scroll', (e) => {
        const top = document.documentElement.scrollTop
        this.isNavShrink = top > 200
        this.isLineAppScreenshotShrink = top < 100
        console.log(top)
      })
    },
  }
})
