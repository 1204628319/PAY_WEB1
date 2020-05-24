<template>
  <div class="app-container">
    <eHeader :query="query" :supthis="supthis" />
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right">
              <el-radio-group v-model="opt" size="mini">
                <el-radio-button label="菜单分配" />
                <el-radio-button label="权限分配" />
              </el-radio-group>
            </div>
          </div>
          <el-table v-loading="loading" v-el-height-adaptive-table="{bottomOffset: 50}" height="400px" :data="data" highlight-current-row style="width: 100%;" :stripe="true" @current-change="handleCurrentChange">
            <el-table-column prop="roleName" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="roleDesc" label="描述" />
            <el-table-column :show-overflow-tooltip="true" prop="parentRoleName" label="父级角色" />
            <el-table-column :show-overflow-tooltip="true" prop="createAt" label="创建日期">
              <template slot-scope="scope">
                <span>{{ scope.row.createAt }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkPermission(['ADMIN','ROLES_ALL','ROLES_EDIT','ROLES_DELETE'])" label="操作" width="120px" align="center" fixed="right">
              <template slot-scope="scope">
                <edit v-permission="['ADMIN','ROLES_ALL','ROLES_EDIT']" :data="scope.row" :supthis="supthis" />
                <el-popover
                  :ref="scope.row.id"
                  v-permission="['ADMIN','ROLES_ALL','ROLES_DELETE']"
                  placement="top"
                  width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id, false)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" class="table-action-delete" size="mini" />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            background
            :total="total"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-show="opt === '菜单分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ADMIN','ROLES_ALL','ROLES_EDIT']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
        <el-card v-show="opt === '权限分配'" id="role" v-auto-height-adaptive class="box-card" shadow="never" :body-style="cardBodyStyle">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配权限" placement="top">
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ADMIN','ROLES_ALL','ROLES_EDIT']"
              :disabled="!showButton"
              :loading="permissionLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="savePermission"
            >保存</el-button>
          </div>
          <el-tree
            ref="permission"
            :data="permissions"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            show-checkbox
            accordion
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getPermissionTree } from '@/api/permission'
import { getMenusTree } from '@/api/menu'
import eHeader from './module/header'
import edit from './module/edit'
import { editPermission, editMenu, deleteRole } from '@/api/role'

export default {
  name: 'role',
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: 0, permissionLoading: false, menuLoading: false, showButton: false, opt: '菜单分配',
      delLoading: false, supthis: this, permissions: [], permissionIds: [], menus: [], menuIds: [],
      cardBodyStyle: {
        'position': 'relative',
        'height': 'inherit',
        'overflow': 'scroll'
      }
    }
  },
  created() {
    this.getPermissions()
    this.getMenus()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.$refs.permission.setCheckedKeys([])
      this.$refs.menu.setCheckedKeys([])
      this.showButton = false
      this.url = 'admin/roles/getList'
      const sort = 'id'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, desc: sort }
      if (value) { this.params['name'] = value.substr(0, 25) }
      return true
    },
    subDelete(id, isForce) {
      this.delLoading = true
      deleteRole({
        id: id,
        isForce: isForce
      }).then(res => {
        if (res.code === '1') {
          this.$confirm('角色已经关联用户，确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.subDelete(id, true)
          }).catch(() => {
            this.delLoading = false
            this.$refs[id].doClose()
          })
        } else {
          this.delLoading = false
          this.$refs[id].doClose()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = res
      })
    },
    getMenus() {
      getMenusTree().then(res => {
        this.menus = res
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空权限与菜单的选中
        this.$refs.permission.setCheckedKeys([])
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        this.permissionIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data) {
          let add = true
          for (let i = 0; i < val.menus.length; i++) {
            if (data.id === val.menus[i].pid) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })
        // 处理权限数据
        const containArr = val.permissions
        val.permissions.forEach(function(data) {
          const id = data.id
          if (_this.checkIsParentNode(id, _this.permissions)) {
            if (_this.checkHaveAllChild(_this.permissions, id, containArr)) {
              _this.permissionIds.push(id)
            }
          } else {
            _this.permissionIds.push(id)
          }
        })
      }
    },
    checkIsParentNode(id, data) {
      // 检测是否有子节点，有子节点就是父节点
      for (let i = 0; i < data.length; i++) {
        const pid = data[i].id
        const children = data[i].children
        if (pid === id) {
          return !!children
        }
        if (children) {
          const result = this.checkIsParentNode(id, children)
          if (result) {
            return result
          }
        }
      }
    },
    checkHaveAllChild(data, id, containArr) {
      // 判断父节点是否包含所有子节点的授权，如果包含所有则勾选
      for (let i = 0; i < data.length; i++) {
        const pid = data[i].id
        const children = data[i].children
        if (pid === id) {
          const result = this.checkHaveAllChildItem(children, id, containArr)
          if (result) {
            return result
          }
        }
        if (children) {
          const result = this.checkHaveAllChild(children, id, containArr)
          if (result) {
            return result
          }
        }
      }
    },
    checkHaveAllChildItem(children, id, containArr) {
      if (children) {
        for (let j = 0; j < children.length; j++) {
          let contain = false
          for (let k = 0; k < containArr.length; k++) {
            if (containArr[k].id === children[j].id) {
              contain = true
              break
            }
          }
          if (!contain) {
            return false
          }
          if (children[j].children) {
            const result = this.checkHaveAllChild(children[j].children, id, containArr)
            if (result) {
              return result
            }
          }
        }
        return true
      } else {
        return true
      }
    },
    savePermission() {
      this.permissionLoading = true
      const role = { id: this.currentId, permissions: [] }
      this.$refs.permission.getCheckedKeys().forEach(function(data) {
        const permission = { id: data }
        role.permissions.push(permission)
      })
      editPermission(role).then(() => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.permissionLoading = false
        this.update()
      }).catch(() => {
        this.permissionLoading = false
      })
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data) {
        const menu = { id: data.id }
        role.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      editMenu(role).then(() => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(() => {
        this.menuLoading = false
      })
    },
    update() {
      this.init()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
  .box-card{
    position: relative;
  }
</style>
