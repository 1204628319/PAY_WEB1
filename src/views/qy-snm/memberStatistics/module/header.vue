<template>
  <div class="margin_bottom10">
    <!-- 搜索 -->
    <div class="filter-container filter-no-span">
      <div class="filter-item">
        <el-input v-model="query.certId" clearable size="small" placeholder="请输入身份证号码">
          <i slot="suffix" class="el-input__icon" />
        </el-input>
      </div>
      <div class="filter-item filter-content-button">
        <el-button v-permission="['ADMIN','MEMBER_STATISTICS_ALL','MEMBER_STATISTICS_SELECT']" type="primary" @click="searchByCertId">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true
    },
    supthis: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      isBtnDisable: true
    }
  },
  methods: {
    searchByCertId() {
      this.supthis.searchByCertId(this.query.certId)
    }
  }
}
</script>
