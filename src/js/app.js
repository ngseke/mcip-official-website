const mcip = new Vue({
  el: `#app`,
  data: {
    msg: `hello`,
    isNavShrink: false,
    isLineAppScreenshotShrink: false,
  },
  mounted () {
    this.setShrink()
    console.log(`Hey! You found me ☺️! `)
  },
  methods: {
    setShrink () {
      window.addEventListener('scroll', (e) => {
        const top = document.scrollingElement.scrollTop || document.documentElement.scrollTop
        this.isNavShrink = top > 200
        this.isLineAppScreenshotShrink = top < 100
      })
    },
  }
})
