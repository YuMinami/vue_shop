<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" width="50px">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :collapse-transition="false" :unique-opened="true" :collapse="isCollapse" router>
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-management',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      isCollapse: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList () {
      this.axios.get('/menus').then(Response => {
        const res = Response.data
        if (res.meta.status !== 200) {
          return this.$message({
            message: res.meta.msg(),
            type: 'error'
          })
        }
        this.menuList = res.data
      })
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}

.el-header div{
  display: flex;
  align-items: center;
}

.el-header div span{
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
}
</style>
