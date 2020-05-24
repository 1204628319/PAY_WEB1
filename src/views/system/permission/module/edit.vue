<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" class="table-action-edit" @click="to" />
    <eForm ref="form" :supthis="supthis" :is-add="false" />
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    supthis: {
      type: Object,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      _this.getPermissions()
      _this.form = { id: this.data.id, permissionName: this.data.permissionName, alias: this.data.alias, pid: this.data.pid }
      _this.dialog = true
      _this.loading = false
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
