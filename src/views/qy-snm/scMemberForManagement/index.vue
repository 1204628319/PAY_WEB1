<template>
  <div class="app-container">
    <eHeader :query="query" :supthis="supthis"/>
    <!--表格渲染-->
    <el-table v-loading="loading" v-el-height-adaptive-table="{bottomOffset: 50}" height="400px" :data="data" style="width: 100%;" :stripe="true" class="table-border">
      <el-table-column label="ID" prop="id" min-width="190" :show-overflow-tooltip="true" />
      <el-table-column label="真实姓名" prop="realName" min-width="80" :show-overflow-tooltip="true" />
      <el-table-column label="结算手机号" prop="settleMobile" min-width="80" :show-overflow-tooltip="true" />
      <el-table-column label="身份证号码" prop="certId" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="signStatusName" min-width="60" :show-overflow-tooltip="true" />
      <el-table-column label="手续费费率" prop="consRate" min-width="60" :show-overflow-tooltip="true" />
      <el-table-column label="时间" prop="createTime" min-width="80" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import eHeader from './module/header'

export default {
  name: 'scMemberForManagement',
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
      this.url = '/alipayCreditPay/selectScMember'
      this.params['certId'] = this.query.certId || ''
      return true
    },
    searchByCertId(certId) {
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
