<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="query-search">
      <span>搜索</span>
      <el-button>测试</el-button>
      
    </div>
    <h3 class="sub-title" style="margin-bottom: 60px">这行文字是非组件库的颜色切换演示，之下是组件库的颜色切换</h3>
    <div style="text-align: center">
      <el-color-picker v-model="primaryColor" @active-change="colorChange"></el-color-picker>
    </div>
    <el-progress style="margin-bottom: 15px" :percentage="50"></el-progress>
  </div>
</template>

<script lang='ts'>
import Color from "color";
// "@setCustomTheme" 是使用webpack的别名定义的
import setCustomTheme from "@setCustomTheme";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {toggleTheme} from "@zougt/theme-css-extract-webpack-plugin/dist/toggleTheme";
@Component({})
export default class HelloWorld extends Vue {
  msg: string = "hello world";
  primaryColor: string = "#512da7";
  colorChange(val) {
    const options = {
      Color,
      primaryColor: val
      // npm run serve 之后，可以使用终端命令 npx z-theme inspect 查看 gradientReplacer的可用属性
      // gradientReplacer: { "#F7D06B":"#F7D06B" },
    }
    console.log(options)
    setCustomTheme(options);
  }
}
</script>

<style lang="scss" scoped>
//  引入elemet-ui的默认变量
@import "element-ui/packages/theme-chalk/src/common/var.scss";
.sub-title {
  margin-top: 20px;
  text-align: center;
  // 用一个固定颜色 与  主题色 混合之后的颜色
  color: mix(#ffffff, $--color-primary, 10%);
}
.query-search {
  // background-color: #f9f;
  color: mix(#f9f, $--color-primary, 50%);
  background-color: mix(#f9f, $--color-primary, 50%);
}
</style>
