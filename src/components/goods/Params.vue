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
        <!--        添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
          <!--          动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand"></el-table-column>
            <!--            索引列-->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--        添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
          <!--          静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand"></el-table-column>
            <!--            索引列-->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
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
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: []
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
      this.getParamsData()
    },
    // Tab页签点击事件的处理方法
    handleTabClick() {
      this.getParamsData()
      console.log(this.activeName)
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
      }
      const { data: res } = await this.axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数失败')
      }
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    }
  },
  computed: {
    // 如果按钮需要被禁用则返回true，否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
</style>
