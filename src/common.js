import axios from 'axios'

const common = {
  data () {
    return {
      percentage: 0,
      // 文章列表
      articleList: null,
      isFetchingArticleList: false,
    }
  },
  methods: {
    // 取得最新消息列表
    async fetchArticleList (after = null, limit = 3) {
      const url = `https://us-central1-mc-integration-platform.cloudfunctions.net/article/app`

      if (this.isFetchingArticleList) return
      this.isFetchingArticleList = true
      this.percentage = .5

      const list = (await axios.get(url, { params: { after, limit } })).data
        .sort((a, b) => b.timestamp - a.timestamp)
        
      this.percentage = 1

      if (!this.articleList) this.articleList = list
      else this.articleList = [...this.articleList, ...list]

      if (list.length < 3) this.isArticleEnd = true
      this.isFetchingArticleList = false
    },
  },
}

export { common }
