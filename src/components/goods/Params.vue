<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card class="box-card">
      <!--      警告提示框-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon :closable="false">
      </el-alert>
      <!--       选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <!--      级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover' ,value: 'cat_id', label: 'cat_name', children: 'children'}"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--      tab页签区-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="静态属性" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 级联选择框选中的分类id数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'first'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      // console.log(res.data)
      //  把数据列表赋值给cateList
      this.cateList = res.data
    },
    //  级联选择器选择框选中项变化，会触发这个方法
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
      }
    },
    // Tab页签点击事件的处理方法
    handleTabClick() {
      console.log(this.activeName);
    }
  }
}
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
</style>
