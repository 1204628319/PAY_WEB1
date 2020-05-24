<template>
  <div class="margin_bottom10">
    <!-- 搜索 -->
    <div class="filter-container filter-no-span">
      <div class="filter-item">
        <el-input v-model="query.value" clearable placeholder="输入名称查询" style="width: 200px;" @keyup.enter.native="toQuery" />
      </div>
      <div class="filter-item filter-content-button">
        <el-button v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_SELECT']" type="primary" @click="toQuery">查询</el-button>
      </div>
    </div>

    <!-- 新增 -->
    <div class="filter-button">
      <div>
        <div v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_CREATE']" style="display: inline-block;">
          <el-button
            type="primary"
            @click="add"
          >新增</el-button>
          <eForm ref="form" :is-add="true" />
        </div>
        <div style="display: inline-block;padding-left: 10px;">
          <el-button
            type="primary"
            @click="expand"
          >{{ $parent.expand ? '折叠' : '展开' }}</el-button>
          <eForm ref="form" :is-add="true" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
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
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    add() {
      this.$refs.form.getPermissions()
      this.$refs.form.dialog = true
      this.$refs.form.loading = false
    },
    expand() {
      this.$parent.expand = !this.$parent.expand
      this.$parent.init()
    }
  }
}
</script>
