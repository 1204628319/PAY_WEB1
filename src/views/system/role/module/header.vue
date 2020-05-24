<template>
  <div style="margin-bottom:10px;">
    <!-- 搜索 -->
    <div class="filter-container filter-no-span">
      <div class="filter-item">
        <el-input v-model="query.value" clearable placeholder="输入名称查询" style="width: 200px;" @keyup.enter.native="toQuery" />
      </div>
      <div class="filter-item filter-content-button">
        <el-button v-permission="['ADMIN','ROLES_ALL','ROLES_SELECT']" type="primary" @click="toQuery">查询</el-button>
      </div>
    </div>
    <!-- 新增 -->
    <div v-permission="['ADMIN','ROLES_ALL','ROLES_CREATE']" class="filter-button" style="display: inline-block;">
      <el-button
        type="primary"
        @click="add"
      >新增</el-button>
      <eForm ref="form" :supthis="supthis" :isadd="true" />
    </div>
  </div>
</template>

<script>
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    supthis: {
      type: Object,
      required: true
    },
    query: {
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
      this.$refs.form.getRolesTree()
      this.$refs.form.dialog = true
      this.$refs.form.loading = false
    },
    toQuery() {
      this.supthis.page = 0
      this.supthis.init()
    }
  }
}
</script>
