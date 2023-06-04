<template>
  <div class="nav">
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          :class="{ activeNav: index == current }"
          @click="changeMenu(index)"
        >
          <div class="block"></div>
          <span class="iconfont" :class="item"></span>
        </li>
      </ul>
    </div>
    <div class="own-pic" >
        <HeadPortrait :imgUrl="userInfo.imgUrl" ></HeadPortrait>
        <p>{{ userInfo.name }}</p>
        <!-- <div class="login" v-else>
           <p>登录</p>
        </div> -->
    </div>
   
  </div>
</template>

<script>
import { mapState } from 'vuex';
import HeadPortrait from "./HeadPortrait.vue";


export default {
  components: {
    HeadPortrait,
  },
  data() {
    return {
      menuList: [
        "icon-xinxi",
        "icon-shipin",
        "icon-shu",
        "icon-shandian",
        "icon-shezhi",
      ],
      current: 0,
      imgUrl: require('@/assets/img/head_portrait.jpg'),
      isLogin:false
    };
  },
  mounted(){
   this.$bus.$on('updateCurrent',(data)=>{
    this.current=data
   })
  },
  computed:{
     ...mapState('user',['userInfo'])
  },
  methods: {
    changeMenu(index) {
      this.current=index
      switch (index) {
        case 0:
          this.$router.push({
            path:'/Home/ChatHome',
          }, () => {});
          break;
        case 1:
          this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
          break;
        case 2:
        this.$router.push({
             path:'/Home/Friends',
          }, () => {});;
          break;
        case 3:
          this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
          break;
        case 4:
          this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
          break;
        default:
          this.$router.push({
            path:'/Home/ChatHome',
          });
      }

      this.current = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;
  .nav-menu-wrapper {
    position: absolute;
    top: 40%;
    transform: translate(0, -50%);
    .menu-list {
      margin-left: 10px;

      li {
        margin: 40px 0 0 30px;
        list-style: none;
        cursor: pointer;
        position: relative;
        .block {
          background-color: rgb(29, 144, 245);
          position: absolute;
          left: -40px;
          width: 6px;
          height: 25px;
          transition: 0.5s;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          opacity: 0;
        }
        &:hover {
          span {
            color: rgb(29, 144, 245);
          }
          .block {
            opacity: 1;
          }
        }
      }
    }
  }
  .own-pic {
    position: absolute;
    bottom: 10%;
    margin-left: 25px;
    text-align: center;
    // .login{
    //   width: 50px;
    //   height: 30px;
    //   border-radius: 15%;
    //   text-align: center;
    //   line-height: 30px;
    //   background-color: rgb(50, 54, 68);
    //   color:#fff;
    // }
    // .login:hover{
    //   background-color:rgb(29, 144, 245);
    // }
  }
}
.activeNav {
  span {
    color: rgb(29, 144, 245);
  }
  .block {
    opacity: 1 !important;
  }
}
</style>