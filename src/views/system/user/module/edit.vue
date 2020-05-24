<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" class="table-action-edit" @click="to" />
    <eForm ref="form" :supthis="supthis" :is-add="false" />
  </div>
</template>
<script>
import { getAllParent } from '@/api/role'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    // index.vue 的this 可用于刷新数据
    supthis: {
      type: Object,
      required: true
    }
  },
  methods: {
    async to() {
      const _this = this.$refs.form
      const roleIds = await this.getCusTomRoles(this.data.roles)
      _this.form = { id: this.data.id, userName: this.data.userName, nickName: this.data.nickName,
        userPhone: this.data.userPhone, userEmail: this.data.userEmail, doUntying: this.data.doUntying, wxUnionId: this.data.wxUnionId,
        enabled: this.data.enabled }
      _this.$set(_this.form, 'roleIds', roleIds)
      _this.getRolesTree()
      _this.dialog = true
      _this.loading = false
      _this.isResume = false
      _this.bindAccount = ''
    },
    getCusTomRoles(data) {
      return new Promise((resolve) => {
        const roleIds = []
        if (Array.isArray(data) && data.length === 0) {
          resolve([])
        }
        data.forEach(async(item, index) => {
          const temp = []
          const result = await getAllParent({ id: item.id })
          if (result !== 'error') {
            for (let i = result.length - 1; i >= 0; i--) {
              temp.push(result[i].id)
            }
          }
          roleIds.push(temp)
          if (index === data.length - 1) {
            resolve(roleIds)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
