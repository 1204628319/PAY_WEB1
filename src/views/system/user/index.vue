<template>
  <div class="app-container">
    <eHeader :query="query" :supthis="supthis"/>
    <!--表格渲染-->
    <el-table v-loading="loading" v-el-height-adaptive-table="{bottomOffset: 50}" height="400px" :data="data" style="width: 100%;" :stripe="true" class="table-border">
      <el-table-column prop="userName" label="用户账号" />
      <el-table-column prop="nickName" label="用户名称" min-width="100px" :show-overflow-tooltip="true" />
      <el-table-column label="角色" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-for="(r, i) in scope.row.roles" :key="i">{{ scope.row.roles[i].roleName + (i===scope.row.roles.length-1 ? '' : '/') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" label="手机号码" />
      <el-table-column :show-overflow-tooltip="true" prop="userEmail" label="邮箱" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.enabled === true ? '启用':'禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT','USER_DELETE'])" label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-permission="['ADMIN','USER_ALL','USER_EDIT']" :data="scope.row" :supthis="supthis" />
          <el-popover
            :ref="`popover-${scope.$index}`"
            v-permission="['ADMIN','USER_ALL','USER_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id, `popover-${scope.$index}`)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" class="table-action-delete" size="mini" />
          </el-popover>

          <el-popover
            :ref="scope.row.id"
            v-permission="['ADMIN','USER_ALL','USER_REST_PWD']"
            placement="top"
            width="180"
          >
            <p>确定重置该用户密码吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="toReset(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="warning" icon="el-icon-setting" class="table-action-reset" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, resetUserPassword } from '@/api/user'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import { getRoles } from '@/api/role'

export default {
  name: 'user',
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false, supthis: this, deptName: '', deptId: null,
      rolesData: []
    }
  },
  created() {
    this.getRoleData()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {

  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'admin/users'
      const query = this.query
      this.params = query
      this.params.page = this.page
      this.params.size = this.size
      this.params.desc = 'id'
      return true
    },
    subDelete(id, type) {
      this.delLoading = true
      del({
        id: id
      }).then(() => {
        this.delLoading = false
        this.$refs[type].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(() => {
        this.delLoading = false
        this.$refs[type].doClose()
      })
    },
    toReset(id) {
      this.delLoading = true
      resetUserPassword({
        id: id
      }).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '重置密码成功',
          type: 'success',
          duration: 2500
        })
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    handleNodeClick(data) {
      this.page = 1
      this.init()
    },
    getRoleData() {
      getRoles().then(res => {
        this.rolesData = []
        for (const key in res) {
          if (key === undefined) break
          const temp = {
            name: res[key],
            id: key
          }
          this.rolesData.push(temp)
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .cusTree{
    .el-tree-node__content{
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
  }
  .colLeft{
    position: absolute;
    height: 100%;
    border-right: 1px solid #dfe6ec;
  }
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    text-overflow: ellipsis;
  }
    .rowSection{
    position: absolute;
    top: 5px;
    height: 98%;
    width: 100%;
    &-content{
      display: flex;
      width: 100%;
      height: 100%;
      &-left{
        width: 280px;
        border: 1px solid #eee;
        margin: 0 20px;
        .head-container{
          margin: 10px;
        }
      }
      &-right{
        flex: 1;
        height: 100%;
        overflow: auto;
      }
    }
  }
</style>
