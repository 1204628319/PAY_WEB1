<template>
  <div class="app-container">
    <eHeader :query="query" :supthis="supthis" />
    <!--表格渲染-->
    <el-table v-loading="loading" v-el-height-adaptive-table="{bottomOffset: 50}" height="400px" :data="data" style="width: 100%;" :stripe="true" class="table-border">
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column label="进件人身份证号码" prop="certId" min-width="100" :show-overflow-tooltip="true" />
      <el-table-column label="未支付金额(元)" prop="notPayFee" min-width="70" :show-overflow-tooltip="true" />
      <el-table-column label="处理中金额(元)" prop="payingFee" min-width="70" :show-overflow-tooltip="true" />
      <el-table-column label="已支付金额(元)" prop="payedFee" min-width="70" :show-overflow-tooltip="true" />
      <el-table-column label="失败金额(元)" prop="failFee" min-width="70" :show-overflow-tooltip="true" />
      <el-table-column label="异常金额(元)" prop="abnormalFee" min-width="70" :show-overflow-tooltip="true" />
      <el-table-column label="总金额(元)" prop="totalFee" min-width="70" :show-overflow-tooltip="true" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      class="el-cus-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      small
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>
<script>
import initData from '@/mixins/initData'
import eHeader from './module/header'

export default {
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      supthis: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = '/alipayCreditPay/memberStatistics'
      this.params = { page: this.page, size: this.size }
      this.params['certId'] = this.query.certId || ''
      return true
    },
    searchByCertId(certId) {
      this.page = 1
      this.$set(this.query, 'certId', certId)
      this.init()
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
