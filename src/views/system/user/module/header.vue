<template>
  <div class="margin_bottom10">
    <!-- 搜索 -->
    <div class="filter-container filter-no-span">
      <div class="filter-item">
        <span class="filter-item-label">用户账号</span>
        <el-input v-model="query.userName" clearable placeholder="用户账号" @keyup.enter.native="toQuery" />
      </div>
      <div class="filter-item">
        <span class="filter-item-label">用户角色</span>
        <el-select v-model="query.roleId" clearable placeholder="用户角色">
          <el-option v-for="item in supthis.rolesData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-item-label">用户邮箱</span>
        <el-input v-model="query.userEmail" clearable placeholder="用户邮箱" @keyup.enter.native="toQuery" />
      </div>
      <div class="filter-item filter-content-button">
        <el-button v-permission="['ADMIN','USER_ALL','USER_SELECT']" type="primary" @click="toQuery">查询</el-button>
      </div>
    </div>

    <!-- 新增 -->
    <div class="filter-button">
      <div>
        <div v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_CREATE']" style="display: inline-block;">
          <el-button
            v-permission="['ADMIN','USER_ALL','USER_CREATE']"
            type="primary"
            @click="add"
          >新增</el-button>
          <!-- 新增 -->
          <div v-permission="['ADMIN','USER_ALL','USER_CREATE']">
            <eForm ref="form" :supthis="supthis" :is-add="true" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
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
      downloadLoading: false,
      enabledTypeOptions: [
        { key: 'true', display_name: '启用' },
        { key: 'false', display_name: '禁用' }
      ]
    }
  },
  methods: {
    add() {
      this.$refs.form.getRolesTree()
      this.$refs.form.dialog = true
      this.$refs.form.loading = false
    },
    // 去查询
    toQuery() {
      this.supthis.page = 0
      this.supthis.init()
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'enabled', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.supthis.data)
        excel.export_json_to_excel({
          data,
          header: tHeader,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
