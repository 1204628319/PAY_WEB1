<template>
  <div class="app-container">
    <eHeader :query="query" :supthis="supthis"/>
    <!--表格渲染-->
    <el-table v-loading="loading" v-el-height-adaptive-table="{bottomOffset: 50}" height="400px" :data="data" style="width: 100%;" :stripe="true" class="table-border">
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column label="付款码" prop="authCode" min-width="80" :show-overflow-tooltip="true" />
      <el-table-column label="订单号" prop="merOrderId" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="金额(元)" prop="orderAmtByYuan" min-width="60" :show-overflow-tooltip="true" />
      <el-table-column label="支付状态" prop="payStatusName" min-width="80" :show-overflow-tooltip="true" />
      <el-table-column label="时间" prop="transTime" min-width="80" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import eHeader from './module/header'

export default {
  name: 'pay-management',
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      delLoading: false, supthis: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = '/alipayCreditPay/selectPayResult'
      this.params['authCode'] = this.query.authCode || ''
      return true
    },
    searchByAuthCode(authCode) {
      this.$set(this.query, 'authCode', authCode)
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
