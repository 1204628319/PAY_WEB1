<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" :title="isadd ? '新增角色' : '编辑角色'" append-to-body width="500px">
    <el-form ref="form" v-closeDialog :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="父级角色" prop="pid">
        <el-cascader
          ref="cascader"
          v-model="form.pid"
          :options="depts"
          :props="{ label: 'label', value: 'id', children: 'children', checkStrictly: true }"
          clearable
          style="width: 370px;"
          :placeholder="'请选择父级角色'"
          @change="$refs['cascader'].toggleDropDownVisible(false)"
        />
      </el-form-item>

      <el-form-item label="描述信息" prop="roleDesc">
        <el-input v-model="form.roleDesc" style="width: 370px;" rows="5" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole, updateRole, rolesTree } from '@/api/role'
import { deepClone } from '@/utils'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { handleCommonCloseDialog } from '@/utils/dialogCustom'

export default {
  components: { Treeselect },
  props: {
    isadd: {
      type: Boolean,
      required: true
    },
    supthis: {
      type: Object,
      default: null
    }
  },
  data() {
    this.formInitData = { roleName: '', roleDesc: '', pid: [] }
    return {
      loading: false, dialog: false, depts: [],
      form: this.formInitData,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择父级角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleCommonCloseDialog,
    async getRolesTree() {
      const res = await rolesTree()
      if (res !== 'error') {
        this.depts = res
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.pid = Array.isArray(this.form.pid) ? this.form.pid.pop() : this.form.pid
          const params = deepClone(this.form)
          if (this.isadd) {
            this.doAdd(params)
          } else {
            this.doEdit(params)
          }
        } else {
          return false
        }
      })
    },
    doAdd(params) {
      addRole(params).then(() => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.supthis.init()
      }).catch(() => {
        this.loading = false
      })
    },
    doEdit(params) {
      updateRole(params).then(() => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.supthis.init()
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.form = this.formInitData
      this.dialog = false
    },
    changeScope() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
