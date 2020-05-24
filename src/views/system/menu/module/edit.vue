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
      _this.getMenus()
      _this.form = { id: this.data.id, component: this.data.component, menuName: this.data.menuName, sort: this.data.sort, pid: this.data.pid,
        menuPath: this.data.menuPath, isFrame: this.data.isFrame.toString(), menuIcon: this.data.menuIcon }
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
