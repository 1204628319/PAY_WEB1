import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 1, size: 10, total: 0, url: '', params: {}, query: {}, time: 170, method: ''
    }
  },
  watch: {
    total() {
      if (this.total === (this.page - 1) * this.size && this.total !== 0) {
        this.page -= 1
        this.init()
      }
    }
  },
  methods: {
    async init(type) {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = type !== 'down'
        if (type === 'down') {
          this.params.size = this.total
          this.params.page = 1
        }
        initData(this.url, this.params, this.method).then(res => {
          if (type === 'down') {
            resolve(res)
            return
          }
          this.total = res.totalCount
          this.data = res.data
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
