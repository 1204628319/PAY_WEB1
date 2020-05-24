<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" title="发起交易" append-to-body width="350px">
    <el-steps :active="active" finish-status="success" simple style="margin-top: -20px">
      <el-step title="输入金额" />
      <el-step title="输入付款码" />
    </el-steps>
    <el-form ref="form" v-closeDialog :inline="true" :model="form" :rules="rules" label-width="88px" style="margin-top: 20px">
      <div v-if="active==1">
        <el-form-item label="金额（元）" prop="orderAmtByYuan">
          <el-input-number v-model="form.orderAmtByYuan" :precision="2" :min="1" :max="10000000000" placeholder="元，最多两位小数" class="commonWidth" />
        </el-form-item>
      </div>
      <div v-if="active==2" class="info" align="left">
        <el-form-item label="付款码" prop="authCode">
          <el-input v-model="form.authCode" placeholder="请输入付款码" class="commonWidth" />
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
import { pay } from '@/api/payOrder'
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
        authCode: '',
        orderAmtByYuan: ''
      },
      style: 'width: 184px',
      rules: {
        authCode: [
          { required: true, message: '请输入付款码', trigger: 'change' },
          { min: 0, max: 64, message: '长度在64个字符以内', trigger: 'blur' }
        ],
        orderAmtByYuan: [
          { required: true, message: '请输入金额', trigger: 'change' }
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
        authCode: '',
        orderAmtByYuan: ''
      }
      this.$refs['form'] && this.$refs['form'].resetFields()
    },
    toSubmit() {
      debounce(this.doSubmit, 400, 400)()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$confirm('确定要支付' + this.form.orderAmtByYuan + '元吗？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.loading = true
          this.pay()
        }).catch(() => {
          console.info('exception')
        })
      })
    },
    pay() {
      const params = {
        authCode: this.form.authCode,
        orderAmtByYuan: this.form.orderAmtByYuan
      }
      pay(params).then(res => {
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
