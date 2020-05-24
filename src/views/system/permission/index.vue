<template>
  <div class="app-container">
    <eHeader :query="query" />
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" class="table-border">
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PERMISSION_ALL','PERMISSION_EDIT','PERMISSION_DELETE'])" label="操作" width="120px" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-show="scope.row.permissionName === 'ADMIN'">
            <edit v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_EDIT']" :data="scope.row" :supthis="supthis" />
          </div>
          <div v-show="scope.row.permissionName !== 'ADMIN'">
            <edit v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_EDIT']" :data="scope.row" :supthis="supthis" />
            <el-popover
              :ref="scope.row.id"
              v-permission="['ADMIN','PERMISSION_ALL','PERMISSION_DELETE']"
              placement="top"
              width="200"
            >
              <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" class="table-action-delete" />
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del } from '@/api/permission'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  name: 'permission',
  components: { eHeader, edit, treeTable },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'permissionName'
        },
        {
          text: '别名',
          value: 'alias'
        }
      ],
      delLoading: false, supthis: this, expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'admin/permissions'
      const sort = 'id'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, desc: sort }
      if (value) { this.params['name'] = value.substr(0, 25) }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del({
        id: id
      }).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
