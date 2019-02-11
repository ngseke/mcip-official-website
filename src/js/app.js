const mcip = new Vue({
  el: `#app`,
  data: {
    msg: `hello`,
    isNavShrink: false
  },
  mounted () {
    this.setNavShrink()
  },
  methods: {
    setNavShrink () {
      window.addEventListener('scroll', (e) => {
        const top = document.documentElement.scrollTop
        this.isNavShrink = top > 200
      })
    },
  }
})
