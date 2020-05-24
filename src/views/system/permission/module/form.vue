<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" :title="isAdd ? '新增权限' : '编辑权限'" append-to-body width="500px">
    <el-form ref="form" v-closeDialog :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="permissionName">
        <el-input v-model="form.permissionName" style="width: 360px;" />
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form.alias" style="width: 360px;" />
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="上级类目" prop="pid">
        <treeselect v-model="form.pid" :options="permissions" :disabled="!isAdd" style="width: 360px;" placeholder="选择上级类目" @input="changePid" @close="changePid" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getPermissionTree } from '@/api/permission'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { handleCommonCloseDialog } from '@/utils/dialogCustom'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    supthis: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false, permissions: [],
      form: { permissionName: '', alias: '', pid: 0 },
      rules: {
        permissionName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择上级类目', trigger: 'input' }
        ]
      }
    }
  },
  methods: {
    handleCommonCloseDialog,
    changePid() {
      this.$nextTick(() => {
        this.$refs.form.validateField('pid')
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(() => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.$parent.$parent.init()
      }).catch(() => {
        this.loading = false
      })
    },
    doEdit() {
      edit(this.form).then(() => {
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
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { permissionName: '', alias: '', pid: 0 }
    },
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = []
        const permission = { id: 0, label: '顶级类目', children: [] }
        permission.children = res
        this.permissions.push(permission)
      })
    }
  }
}
</script>

<style scoped>

</style>
