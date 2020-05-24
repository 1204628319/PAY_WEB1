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
        <el-button v-permission="['ADMIN','UPLOAD_IMAGE_ALL','UPLOAD_IMAGE_SELECT']" type="primary" @click="searchByCertId">查询</el-button>
      </div>
    </div>

    <!-- 上传照片 -->
    <div class="filter-button">
      <div>
        <div v-permission="['ADMIN','UPLOAD_IMAGE_ALL','UPLOAD_IMAGE_CREATE']" style="display: inline-block;">
          <el-button
            v-permission="['ADMIN','UPLOAD_IMAGE_ALL','UPLOAD_IMAGE_CREATE']"
            type="primary"
            @click="add"
          >上传照片</el-button>
          <!-- 新增 -->
          <div v-permission="['ADMIN','UPLOAD_IMAGE_ALL','UPLOAD_IMAGE_CREATE']">
            <eForm ref="form" :supthis="supthis" :is-add="true" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
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
      downloadLoading: false
    }
  },
  methods: {
    add() {
      this.$refs.form.dialog = true
      this.$refs.form.loading = false
    },
    // 去查询
    searchByCertId() {
      if (this.query.certId) {
        this.supthis.searchByCertId(this.query.certId)
      } else {
        this.$notify({
          title: '请输入身份证号码',
          type: 'warning',
          duration: 3500
        })
      }
    }
  }
}
</script>
