<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" class="table-action-edit" @click="to" />
    <eForm ref="form" :supthis="supthis" :isadd="false" />
  </div>
</template>
<script>
import eForm from './form'
import { getRoleAllParent } from '@/api/role'
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
    async to() {
      const _this = this.$refs.form
      _this.form = { id: this.data.id, roleName: this.data.roleName, roleDesc: this.data.roleDesc,
        pid: [this.data.pid] }
      _this.getRolesTree()
      _this.dialog = true
      _this.loading = false
    },
    getCusTomRoles(data) {
      return new Promise(async(resolve) => {
        if (Array.isArray(data) && data.length === 0) {
          resolve([])
        }
        const mapRes = await data.map(async(item) => {
          const result = await getRoleAllParent()
          if (result !== 'error') {
            const res = await this.getRoleInfo(result)
            return res
          }
        })
        const roleIds = await Promise.all(mapRes)
        resolve(roleIds)
      })
    },
    getRoleInfo(result) {
      return new Promise((resolve) => {
        const temp = []
        if (Array.isArray(result) && result.length === 0) resolve([])
        for (let i = result.length - 1; i >= 0; i--) {
          temp.push(result[i].id)
        }
        resolve(temp)
      })
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
