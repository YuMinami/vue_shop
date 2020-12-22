<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      角色列表区-->
      <el-table :data="roleList" border stripe>
<!--        展开列-->
        <el-table-column type="expand"></el-table-column>
<!--        索引列-->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleForm(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--    编辑用户对话框-->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editRoleRules" ref="editRoleRef" label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加角色信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addRoleRules" ref="addRoleRef" label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      editDialogVisible: false,
      editForm: {
      },
      editRoleRules: {
        roleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }],
        roleDesc: [{
          required: false
        }]
      },
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false,
      addRoleRules: {
        roleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    async editRoleForm(id) {
      // console.log(id)
      const { data: res } = await this.axios.get('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editRoleInfo() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('提交角色信息失败')
        }
        this.editDialogVisible = false
        await this.getRolesList()
        this.$message.success('更新角色信息成功')
      })
    },
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        this.$message.info('已经取消删除')
        return err
      })
      if (confirmResult !== 'confirm') {
        return
      }
      const { data: res } = await this.axios.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      await this.getRolesList()
    },
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        await this.getRolesList()
      })
    },
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
