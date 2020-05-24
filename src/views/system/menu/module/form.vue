<template>
  <el-dialog :visible.sync="dialog" :before-close="handleCommonCloseDialog" :title="isAdd ? '新增菜单' : '编辑菜单'" append-to-body width="600px">
    <el-form ref="form" v-closeDialog :model="form" :rules="rules" label-width="80px">
      <el-form-item label="菜单图标">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.menuIcon" style="width: 460px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.menuIcon" slot="prefix" :icon-class="form.menuIcon" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="名称" style="width: 460px;" />
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 460px;" />
      </el-form-item>
      <el-form-item label="内部菜单" prop="isFrame">
        <el-radio v-model="form.isFrame" label="false">是</el-radio>
        <el-radio v-model="form.isFrame" label="true">否</el-radio>
      </el-form-item>
      <el-form-item label="链接地址" prop="menuPath">
        <el-input v-model="form.menuPath" placeholder="链接地址" style="width: 460px;" />
      </el-form-item>
      <el-form-item v-if="form.isFrame === 'false'" label="组件路径" prop="component">
        <el-input v-model="form.component" placeholder="组件路径" style="width: 460px;" />
      </el-form-item>
      <el-form-item label="上级类目" prop="pid">
        <treeselect v-model="form.pid" :options="menus" style="width: 460px;" placeholder="选择上级类目" :disabled="!isAdd" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getMenusTree } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { handleCommonCloseDialog } from '@/utils/dialogCustom'
export default {
  components: { Treeselect, IconSelect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    supthis: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false, menus: [],
      form: { menuName: '', sort: 999, menuPath: '', component: '', isFrame: 'false', pid: 0, menuIcon: '' },
      rules: {
        menuName: [
          { min: 1, max: 80, message: '长度在20个字符以内', trigger: 'blur' },
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        menuPath: [
          { min: 1, max: 80, message: '长度在80个字符以内', trigger: 'blur' },
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ],
        component: [
          { min: 1, max: 80, message: '长度在80个字符以内', trigger: 'blur' }
        ],
        isFrame: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择上级类目', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleCommonCloseDialog,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(() => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.$parent.$parent.init()
      }).catch(() => {
        this.loading = false
      })
    },
    doEdit() {
      edit(this.form).then(() => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.supthis.init()
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { menuName: '', sort: 999, menuPath: '', component: '', isFrame: 'false', pid: 0, menuIcon: '' }
    },
    selected(name) {
      this.form.menuIcon = name
    },
    getMenus() {
      getMenusTree().then(res => {
        this.menus = []
        const menu = { id: 0, label: '顶级类目', children: [] }
        menu.children = res
        this.menus.push(menu)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
