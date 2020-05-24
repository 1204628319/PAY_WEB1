<template>
  <div class="app-container">
    <eHeader :query="query" />
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" class="table-border">
      <el-table-column prop="menuIcon" label="图标" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.menuIcon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="menuPath" label="链接地址" />
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" />
      <el-table-column prop="iframe" width="100px" label="内部菜单">
        <template slot-scope="scope">
          <span v-if="!scope.row.isFrame">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createAt" label="创建日期" />
      <el-table-column v-if="checkPermission(['ADMIN','MENU_ALL','MENU_EDIT','MENU_DELETE'])" label="操作" width="120px" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-permission="['ADMIN','MENU_ALL','MENU_EDIT']" :data="scope.row" :supthis="supthis" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['ADMIN','MENU_ALL','MENU_DELETE']"
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
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del } from '@/api/menu'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  name: 'menu',
  components: { eHeader, edit, treeTable },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'menuName'
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
      this.url = 'admin/getMenusList'
      const sort = 'sort'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, asc: sort }
      if (value) { this.params['name'] = value.substr(0, 25) }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del({
        id: id
      }).then(res => {
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

