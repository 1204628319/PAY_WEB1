<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" title="发起交易" append-to-body width="350px">
    <el-steps :active="active" finish-status="success" simple style="margin-top: -20px">
      <el-step title="输入身份信息" />
      <el-step title="输入结算银行卡信息" />
    </el-steps>
    <el-form ref="form" v-closeDialog :inline="true" :model="form" :rules="rules" label-width="88px" style="margin-top: 20px">
      <div v-if="active==1">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" class="commonWidth" />
        </el-form-item>
        <el-form-item label="身份证件号" prop="certId">
          <el-input v-model="form.certId" placeholder="请输入身份证件号" class="commonWidth" />
        </el-form-item>
        <el-form-item label="商户名称" prop="merName">
          <el-input v-model="form.merName" placeholder="不可修改，请谨慎传入" class="commonWidth" />
        </el-form-item>
        <el-form-item label="省份" prop="merState">
          <el-input v-model="form.merState" placeholder="请输入省份" class="commonWidth" />
        </el-form-item>
        <el-form-item label="城市" prop="merCity">
          <el-input v-model="form.merCity" placeholder="请输入城市" class="commonWidth" />
        </el-form-item>
        <el-form-item label="地址" prop="merAddress">
          <el-input v-model="form.merAddress" placeholder="请输入地址" class="commonWidth" />
        </el-form-item>
      </div>
      <div v-if="active==2" class="info" align="left">
        <el-form-item label="结算卡号" prop="settleCardNo">
          <el-input v-model="form.settleCardNo" placeholder="请输入结算卡号" class="commonWidth" />
        </el-form-item>
        <el-form-item label="结算卡手机号" prop="settleMobile">
          <el-input v-model="form.settleMobile" placeholder="请输入结算卡手机号" class="commonWidth" />
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="active>1" type="primary" icon="el-icon-arrow-left" @click="pre">上一步</el-button>
      <el-button v-if="active==1" type="primary" icon="el-icon-arrow-right" @click="next">下一步</el-button>
      <el-button v-if="active==2" type="text" @click="cancel">取消</el-button>
      <el-button v-if="active==2" :loading="loading" type="primary" @click="toSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { debounce } from '@/utils'
import { scMember } from '@/api/payOrder'
import { handleCommonCloseDialog } from '@/utils/dialogCustom'

export default {
  props: {
    supthis: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        realName: '',
        certId: '',
        merName: '',
        merState: '',
        merCity: '',
        merAddress: '',
        settleCardNo: '',
        settleMobile: ''
      },
      style: 'width: 184px',
      rules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'change' },
          { min: 0, max: 32, message: '长度在32个字符以内', trigger: 'blur' }
        ],
        certId: [
          { required: true, message: '请输入身份证件号', trigger: 'change' },
          { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ],
        merState: [
          { required: true, message: '请输入省份', trigger: 'change' },
          { min: 0, max: 32, message: '长度在32个字符以内', trigger: 'blur' }
        ],
        merCity: [
          { required: true, message: '请输入城市', trigger: 'change' },
          { min: 0, max: 32, message: '长度在32个字符以内', trigger: 'blur' }
        ],
        merAddress: [
          { required: true, message: '请输入地址', trigger: 'change' },
          { min: 0, max: 64, message: '长度在64个字符以内', trigger: 'blur' }
        ],
        settleCardNo: [
          { required: true, message: '请输入结算卡号', trigger: 'change' },
          { min: 0, max: 64, message: '长度在64个字符以内', trigger: 'blur' }
        ],
        merName: [
          { required: true, message: '请输入商户名称', trigger: 'change' },
          { min: 0, max: 64, message: '长度在64个字符以内', trigger: 'blur' }
        ],
        settleMobile: [
          { required: true, message: '请输入结算卡手机号', trigger: 'change' },
          { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ]
      },
      active: 1
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
    resetForm() {
      this.active = 1

      this.dialog = false

      this.form = {
        realName: '',
        certId: '',
        merName: '',
        merState: '',
        merCity: '',
        merAddress: '',
        settleCardNo: '',
        settleMobile: ''
      }
      this.$refs['form'] && this.$refs['form'].resetFields()
    },
    toSubmit() {
      debounce(this.doSubmit, 400, 400)()
    },
    doSubmit() {
      this.$refs['form'].validate(async(valid) => {
        if (!valid) {
          return
        }
        this.$confirm('确定要注册商户吗？注册后，商户名称不可修改', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true
          this.scMember()
        }).catch(() => {
          console.info('exception')
        })
      })
    },
    scMember() {
      scMember(this.form).then(res => {
        this.resetForm()
        this.loading = false
        this.$notify({
          title: res.resultMsg,
          type: 'success',
          duration: 6500
        })
        this.active = 1
      }).catch(() => {
        this.loading = false
      })
    },
    next() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.active = 2
        }
      })
    },
    pre() {
      this.active = 1
    }
  }
}
</script>

<style scoped>

</style>
