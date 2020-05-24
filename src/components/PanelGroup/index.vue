<template>
  <el-row ref="panel" :gutter="20" class="panel-group">
    <el-col v-for="(item, index) in panelLists" :key="index" :xs="12" :sm="12" :md="6" :lg="6" :xl="6" class="card-panel-col">
      <div class="card-panel" @click="canClick ? toPage(item, index) : ''">
        <div class="card-panel-icon-wrapper ">
          <div class="card-panel-img">
            <img :src="item.imgSrc" alt="">
          </div>
        </div>
        <div class="card-panel-description">
          <count-to v-if="item.unit === '笔'" :start-val="0" :end-val="item.count" :separator="','" :decimals="item.decimals" :duration="item.duration" class="card-panel-num" :style="{color: item.color}" />
          <count-to v-else :start-val="0" :end-val="item.count | formatMoneyWithUnit" :separator="','" :decimals="item.decimals" :duration="item.duration" class="card-panel-num" :style="{color: item.color}" />
          <span :style="{color: item.color}">{{ item.unit }}</span>
          <div class="card-panel-text">{{ item.title }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
    panelLists: {
      type: Array,
      default: () => {
        return []
      }
    },
    canClick: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toPage(item, index) {
      const data = {
        item: item,
        index: index
      }
      this.$emit('toPage', data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  background: #fff;
  padding: 20px 0 0 0;
  border-radius: 8px;;
  .card-panel-col{
    margin-bottom: 20px;
  }
  .card-panel {
    display: flex;
    align-items: center;
    height: 100px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    padding-left: 20px;
    cursor: pointer;
    &-img{
      margin: 0 30px 0 30px;
      width: 80px;
      height: 80px;
      img{
        width: 100%;
        display: block;
      }
    }
    .card-panel-icon-wrapper {
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: #666;
        font-size: 16px;
        margin-top: 10px;
      }
      .card-panel-num {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
