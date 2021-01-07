// 项目发布阶段用到的babel插件
const proPlugin = []
if (process.env.NODE_ENV === 'production') {
  proPlugin.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...proPlugin
  ]
}
