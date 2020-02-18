<template lang="pug">
transition(name="progress")
  .progress(v-if='isShow')
    .progress-bar.progress-bar-striped.progress-bar-animated(:style='style')
</template>
<script lang="coffee">
export default
  name: 'TopProgressBar'
  
  data: ->
    isShow: false
    value: 0
    
  computed:
    percentage: ->
      @$root.$data.percentage ? 0
    style: ->
      width: "#{@value * 100}%"
  
  watch:
    percentage: (_) ->
      if _ < 1
        @isShow = true
        setTimeout (=> @value = _), 200
      else
        @value = _
        await @$nextTick()
        @isShow = false
        @value = 0
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
    transition-delay: 0
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