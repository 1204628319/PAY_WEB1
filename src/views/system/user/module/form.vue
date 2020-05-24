<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="620px">
    <el-form ref="form" v-closeDialog :inline="true" :model="form" :rules="rules" label-width="88px">
      <el-form-item label="用户账号" prop="userName">
        <el-input v-model="form.userName" type="text" style="width:180px;" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="用户名称" prop="nickName">
        <el-input v-model="form.nickName" type="text" style="width:180px;" />
      </el-form-item>
      <el-form-item label="手机号码" prop="userPhone">
        <el-input v-model="form.userPhone" type="text" style="width:180px;" />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model="form.userEmail" style="width:180px;" />
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="角色" prop="roleIds">
        <el-cascader
          ref="roleTree"
          v-model="form.roleIds"
          :options="roles"
          :props="{ label: 'label', value: 'id', children: 'children', multiple: true, checkStrictly: true }"
          clearable
          style="width: 180px;"
          :placeholder="'请选择'"
          :show-all-levels="false"
        />
      </el-form-item>
      <el-form-item v-if="!isAdd" label="关联微信" prop="wxUnionId" style="margin-bottom: 0px;">
        <el-input v-model="form.wxUnionId" :disabled="true" style="width:180px;border-right-width: 0px;">
          <el-button v-if="form.wxUnionId || isResume" slot="append" :disabled="!form.wxUnionId && !isResume" style="color: #FFFFFF; background-color: #1890ff;border-color: #1890ff;" @click="untyingAndResume()">{{ isResume ? '恢复':'解绑' }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="enabled" style="margin-top: 18px;">
        <el-switch
          v-model="form.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <p style="color: #999;font-size: 12px;">默认状态为启用该账户,否则不启用该账户</p>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="toSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, updateUser } from '@/api/user'
import { rolesTree } from '@/api/role'
import { deepClone, debounce } from '@/utils'
import { handleCommonCloseDialog } from '@/utils/dialogCustom'
export default {
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
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    const validAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户账号'))
      } else if (value.length < 4 || value.length > 32) {
        callback(new Error('长度在 4 到 32 个字符'))
      } else {
        callback()
      }
    }
    const validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名称'))
      } else if (value.length < 2 || value.length > 32) {
        callback(new Error('长度在 2 到 32 个字符'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, form: { userName: '', nickName: '', userEmail: '', doUntying: false, enabled: true, roles: [], userPhone: null, roleIds: [] },
      roles: [], depts: [], deptId: null, jobId: null, hosInfos: [], style: 'width: 184px', level: 3,
      rules: {
        userName: [
          { required: true, validator: validAccount, trigger: 'blur' },
          { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'change' }
        ],
        nickName: [
          { required: true, validator: validName, trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'change' }
        ],
        userEmail: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, trigger: 'blur', validator: validPhone },
          { min: 11, max: 11, message: '长度为11', trigger: 'change' }
        ],
        roleIds: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      isResume: false,
      bindAccount: ''
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  methods: {
    handleCommonCloseDialog,
    cancel() {
      this.resetForm()
    },
    toSubmit() {
      debounce(this.doSubmit, 400, 400)()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.roleIds.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            const params = deepClone(this.form)
            params.roles = []
            for (let i = 0; i < params.roleIds.length; i++) {
              params.roles.push({
                id: params.roleIds[i].pop()
              })
            }
            delete params.roleIds
            delete params.wxUnionId
            if (this.isAdd) {
              this.doAdd(params)
            } else this.doEdit(params)
          }
        } else {
          return false
        }
      })
    },
    doAdd(params) {
      add(params).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          message: '默认密码：' + res,
          type: 'success',
          duration: 2500
        })
        this.supthis.init()
      }).catch(() => {
        this.loading = false
      })
    },
    doEdit(params) {
      updateUser(params).then(() => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.supthis.init()
        this.resetForm()
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { userName: '', nickName: '', userPhone: '', userEmail: '', enabled: true, roles: [], roleIds: [] }
    },
    async getRolesTree() {
      const params = {}
      if (this.isAdd) {
        params.isCreateUser = true
      }
      const res = await rolesTree(params)
      if (res !== 'error') {
        this.roles = res
      }
    },
    untyingAndResume() {
      // 解绑
      if (!this.isResume) {
        // 记录原来的绑定账号
        this.bindAccount = this.form.wxUnionId
        this.form.wxUnionId = ''
        this.form.doUntying = true
        this.isResume = true
      } else {
        // 恢复
        this.form.wxUnionId = this.bindAccount
        this.form.doUntying = false
        this.isResume = false
      }
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    }
  }
}
</script>

<style scoped>

</style>
