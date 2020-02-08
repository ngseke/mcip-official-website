<template lang="pug">
transition(name="progress")
  .progress(v-if='isShow')
    .progress-bar(:style='style')
</template>
<script>
export default {
  name: 'TopProgressBar',
  data () {
    return {
      isShow: false,
      value: 0,
    }
  },
  computed: {
    percentage () {
      return this.$root.$data.percentage || 0
    },
    style () {
      return { width: `${this.value * 100}%` }
    }
  },
  watch: {
    async percentage (_) {
      if (_ < 1) {
        this.isShow = true
        setTimeout(() => this.value = _, 200)
      } else {
        this.value = _
        await this.$nextTick()
        this.isShow = false
        this.value = 0
      }
    },
  }
}

</script>
<style lang="sass" scoped>
.progress
  position: fixed
  top: 0
  left: 0
  right: 0
  height: 3px
  z-index: 9990
  background-color: transparent
  .progress-bar
    transition-duration: 1s
    transition-delay: .2s
    transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1)
    
  &-enter
    transform: translateY(-100%)
  &-enter-to, &-leave
    transform: none
  &-leave-to
    opacity: 0
  &-enter-active
    transition: all .2s
  &-leave-active
    transition: opacity .5s 1s
</style>