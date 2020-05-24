<template>
  <div class="margin_bottom10">
    <!-- 搜索 -->
    <div class="filter-container filter-no-span">
      <div class="filter-item">
        <el-input v-model="query.authCode" clearable size="small" placeholder="请输入付款码">
          <i slot="suffix" class="el-input__icon" />
        </el-input>
      </div>
      <div class="filter-item filter-content-button">
        <el-button type="primary" @click="searchByAuthCode">查询</el-button>
      </div>
    </div>

    <!-- 发起交易 -->
    <div class="filter-button">
      <div>
        <div style="display: inline-block;">
          <el-button
            type="primary"
            @click="add"
          >发起交易</el-button>
          <div>
            <eForm ref="form" :supthis="supthis" :is-add="true" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    supthis: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    add() {
      this.$refs.form.dialog = true
      this.$refs.form.loading = false
    },
    // 去查询
    searchByAuthCode() {
      if (this.query.authCode) {
        this.supthis.searchByAuthCode(this.query.authCode)
      } else {
        this.$notify({
          title: '请输入付款码',
          type: 'warning',
          duration: 3500
        })
      }
    }
  }
}
</script>
