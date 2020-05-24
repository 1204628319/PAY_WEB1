<template>
  <el-table v-el-height-adaptive-table="{bottomOffset: 10}" :data="formatData" :row-class-name="showRow" v-bind="$attrs" height="500px">
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus" />
          <i v-else class="el-icon-minus" />
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <!-- eslint-disable -->
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <!-- Todo -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space" />
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus" />
          <i v-else class="el-icon-minus" />
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)

    }
  },
  methods: {
    /*********************************
     ** Fn: showRow
     ** Intro: 该方法会对每一行数据都做判断, 如果没有parent则现实， 如果有parent则判断父节点是否要展开子节点与父节点是否为显示状态
     ** @params:
     *********************************/
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'tree-table-row-show' : 'tree-table-row-hide'
    },
    /*********************************
     ** Fn: toggleExpanded
     ** Intro: 切换展开 还是折叠
     ** @params: params 当前点击行的数据
     *********************************/
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    /*********************************
     ** Fn: iconShow
     ** Intro: 如果子集长度为0，则不返回字体图标。
     ** @params: params 当前行的数据对象
     *********************************/
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  /* 表格行样式：显示和隐藏(不能写在scoped中) */
  .tree-table-row-show {
    animation: treeTableShow 1s;
    -webkit-animation: treeTableShow 1s;
  }
  .tree-table-row-hide {
    display: none;
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
