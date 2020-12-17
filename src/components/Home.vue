<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" width="50px">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>gi

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  }
div{
  display: flex;
  align-items: center;
}
span{
  margin-left: 15px;
}

.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #EAEDF1;
}
.home-container{
  height: 100%;
}
</style>
