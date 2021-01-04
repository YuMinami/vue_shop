<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table class="tree-table" :data="cateList" :columns="columns"
                  :selection-type="false" :expand-type="false"
                  show-index index-text="#" border :show-row-hover="false">
        <!--是否有效-->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--        排序-->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!--        操作-->
        <template v-slot:opt="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!--      添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--:options用来指定数据源-->
          <!--:props用来指定配置对象-->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }"
            @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改分类的对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <!--      修改分类的表单-->
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 为table列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        //  父级分类的id
        cat_pid: 0,
        //  分类的等级，默认添加一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //  父级分类的列表
      parentCateList: [],
      // 选中的父级分类id数组
      selectKeys: [],
      // 控制修改分类信息对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑修改分类信息的表单数据对象
      editCateForm: {
        cat_name: '',
        cat_id: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      // console.log(res.data)
      //  把数据列表赋值给cateList
      this.cateList = res.data.result
      // 赋值总数据条数
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮显示添加分类对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectKeys)
      // 如果selectKeys数组的length大于0,证明选中父级分类,反之未选中任何分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //  点击按钮,添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        await this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框的关闭事件,重置表单事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示修改商品分类的对话框
    async showEditCateDialog(id) {
      // console.log(id)
      const { data: res } = await this.axios.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败')
      }
      this.editCateForm.cat_id = id
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 提交修改分类信息
    async editCate() {
      const { data: res } = await this.axios.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })
      if (res.meta.status !== 200) {
        return this.$message.error('提交修改分类信息失败')
      }
      this.$message.success('提交修改分类信息成功')
      await this.getCateList()
      this.editCateDialogVisible = false
    },
    async deleteCate(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        return this.$message.warning('已取消删除 ')
      })
      // console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.axios.delete('categories/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除该分类失败')
        }
        this.$message.success('成功删除该分类')
        await this.getCateList()
      }
    }
  }
}
</script>

<style scoped>
.tree-table {
  margin-top: 15px;
}

</style>
