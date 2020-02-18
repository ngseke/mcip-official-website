<template lang="pug">
ol(itemscope itemtype='http://schema.org/BreadcrumbbList')
  li(v-for='(i, index) in items' v-if='items' itemprop='itemListElement' itemscope itemtype='http://schema.org/ListItem')
    a(:href='i.url' itemprop='item')
      span(itemprop='name') {{ i.name }}
    meta(itemprop='position' :content='index + 1')
</template>

<script lang="coffee">
export default
  name: 'Breadcrumb'
  props: ['items']

</script>

<style lang="sass" scoped>
ol
  list-style: none
  display: flex
  flex-wrap: wrap
  padding: 0 .5rem
  margin-bottom: 2rem
  li
    a
      color: #333
  li:not(:last-child)
    opacity: .7
    &::after
      content: '—'
      padding: 0 1rem
</style>