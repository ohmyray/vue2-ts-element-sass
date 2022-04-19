<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="query-search">
      <span>搜索</span>
      <el-button>测试</el-button>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({})
export default class HelloWorld extends Vue {
  msg: string = 'hello world'
}
</script>

<style lang="scss" scoped>
.query-search{
  background-color: #f9f;
}
</style>
