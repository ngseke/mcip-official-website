<template lang="pug">
section
  .container
    .row.justify-content-center.align-items-center
      .col-12.col-lg-6
        h3 聯絡我們
        transition(name='contact' mode='out-in')
          form(@submit.prevent='submitContact' v-if='status <= 1')
            input(placeholder='姓名 *' maxlength=50 required v-model.trim='contact.name')
            input(type='email' placeholder='Email *' maxlength=100 required v-model.trim='contact.email')
            input(type='tel' placeholder='聯絡電話' maxlength=50 v-model.trim='contact.phone')
            textarea(placeholder='內容 *' required rows=4 maxlength=1000 v-model.trim='contact.content')
            transition(name='contact')
              .d-flex.align-items-center(v-if='isCaptchaShow')
                canvas.mr-3(ref='captcha' width='100' height='36' @click='createdCaptcha')
                input.flex-grow-1.mb-0(type='text' placeholder='驗證碼 (請輸入阿拉伯數字)' maxlength=10 v-model.trim='captchaCode')
                
            button.gradient-btn.submit(type='submit' :disabled='isSubmitDisabled') {{ status === 1 ? `傳送中...` : `送出` }}
            small.text-danger(v-if='errorMessage') {{ errorMessage }}
          .success(v-else-if='status === 2')
            img(src='/img/check.svg')
            span 謝謝你的來信，我們將會盡快與您聯繫!
      .col-3.d-none.d-lg-flex
        .envelope
</template>
<script>
export default {
  name: "ContactUs",
  data () {
    this.fieldNames = [`name`, `email`, `phone`, `content`]
    
    return {
      contact: { name: '',  email: '', phone: '', content: '' },
      isCaptchaShow: false,
      captchaCode: null,
      captchaAnswer: null,
      status: 0,     // 0: 預設, 1: 傳送中, 2: 成功
      errorMessage: null,
    }
  },
  mounted () {
  },
  methods: {
    createdCaptcha () {
      this.captchaAnswer = (~~(Math.random() * 10**4)).toString().padStart(4, 0)
      const text = this.captchaAnswer.split('').map(i => {
        return '零一二三四五六七八九零壹貳參肆伍陸柒捌玖'.split('')[+i + ((Math.random() > .5) ? 10 : 0)]
      }).join('')
      
      const el = this.$refs.captcha
      const ctx = el.getContext('2d')
      ctx.clearRect(0, 0, el.width, el.height)
      const gradient = ctx.createLinearGradient(0, 0, el.width, 0)
      const gradientList = ['#2af1fb', '#2aeefb', '#34d2fb', '#45bdfa', '#50b0fa', '#54adfa', '#bf9ff2']
      gradientList.forEach((i, index) => {
        gradient.addColorStop(index / gradientList.length, i)
      })
      
      ctx.font = '16px sans Serif'
      ctx.fillStyle = gradient
      ctx.textBaseline = 'middle'
      const textWidth = ctx.measureText(text).width
      ctx.fillText(text, (el.width / 2) - (textWidth / 2) + Math.random() * 50 - 25, 10 + Math.random() * 20)
    },
    // 送出聯絡我們表單
    async submitContact () {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/firestoreContact`

      this.errorMessage = null
      this.status = 1

      try {
        const res = await axios.post(url, { ...this.contact, source: 2, type: 2 })
        // await (new Promise(resolve => setTimeout(resolve, 1000)))
        this.status = 2
      } catch (e) {
        this.errorMessage = `發生了一些問題，請稍後再試`
        this.status = 0
      }
    },
  },
  computed: {
    isSubmitDisabled () {
      return this.status === 1 || this.captchaCode !== this.captchaAnswer
    }
  },
  watch: {
    contact: {
      async handler (value) {
        if (this.isCaptchaShow) return
        if (this.fieldNames.filter(i => i !== 'phone').every(i => value[i])) {
          this.isCaptchaShow = true
          await this.$nextTick()
          this.createdCaptcha()
        }
      },
      deep: true,
    }
  },
}

</script>
<style lang="sass" scoped>
form
  display: flex
  flex-direction: column

  input, textarea
    border-radius: 0
    margin-bottom: 1rem
    padding: .5rem
    border: 0
    border-bottom: solid #ddd 3px
    &:focus
      outline: none
      border-color: #ccc
    color: #1e1e1e
    background-color: transparent

.success
  +flex-center
  flex-direction: row
  margin-top: 3rem
  padding: 2rem
  border-radius: 15px
  img
    height: 3rem
    width: auto
    margin-right: 1rem
  span
    color: #777

.contact
  &-enter
    transform: scale(.9)
    opacity: 0
  &-leave-to
    transform: scale(.9)
    opacity: 0
  &-enter-active, &-leave-active
    transition: all .3s
  &-enter-to, &-leave
    transform: none
    opacity: 1
</style>