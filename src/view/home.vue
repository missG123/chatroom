<template>
  <div class="home">
    <!-- <Login></Login> -->
  <el-container height="100%">
      <el-aside width="100px">
        <Nav></Nav>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Nav from "../components/Nav.vue";
import Login from '../components/Login/index.vue'
import { reqUserInfo } from '@/api/user';
export default {
  name: "App",
  components: {
    Nav,Login
  },
  data(){return {
    
  }},
  mounted(){
    this.$store.dispatch('user/getUserInfo')
    this.initWebSocket()
  },
  computed:{
     ...mapState('user',['userInfo'])
  },
  methods:{
    initWebSocket(){
    let _this=this;
    if(window.WebSocket){
      let ws=new WebSocket("ws://192.168.31.85:8181?number="+this.userInfo.number);
      _this.ws=ws;
      _this.$ws.setWs(_this.ws);
      ws.onopen=function(e){
        console.log('服务连接成功');
      }
      ws.onclose=function(e){
        console.log('服务器连接关闭')
      }
      ws.onerror=function(){
        console.log('服务器连接错误')
      }
      ws.onmessage=(e)=>{
      let resData=JSON.parse(e.data);
        console.log('前',resData)
       _this.$bus.$emit('postMessage',resData)
    }
    }
   },
  }
};
</script>

<style lang="scss" scoped>
// .home {
//   width: 710px;
//   height: 485px;
//   background-color: rgb(39, 42, 55);
//   border-radius: 15px;
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// }
</style>