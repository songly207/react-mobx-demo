## 安装指南

- 确认已安装node（8.0以上版本）
- 在app目录下执行以下命令
- npm install gulp -g
- npm install -g babel-core
- npm install -g gulp-cli
- npm install

## 声明icode不检查js

- 在js文件第一行增加以下注释
- /* eslint-disable */

## 重新install依赖前需删除依赖目录node_modules
- npm install rimraf
- rimraf node_modules

## 执行编译
- gulp --i index （普通编译）
- gulp --i index -p （压缩编译）

## 几个遗憾
- 虽然项目使用了typescript，但是由于开发时间仓促，未完整地编写interface，导致typescript编译时检查会报错，但是不影响编译执行。
- 还是由于时间仓促，复用了之前项目的代码，AJAX请求部分用了jquery；之后的RD如果有兴趣可改成promise或者await等更主流的写法。
- 由于不是完全的前后端分离，只是在后端项目里嵌了前端项目，所以未使用webpack的自动编译以及编译配置分离等功能，只是简单地使用gulp配合yargs通过命令编译。
- 由于对less/sass等不了解，未开启css打包。
- 未找到在 react + mobx 下优雅地全局 confirm 的方案，所以使用了 `window.confirm()`。
- 关于该项目的任何疑问和问题，可以加V：shutdown_p 互相学习，欢迎叨扰。