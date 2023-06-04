<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { reqMessage } from './api/message';
import Home from './view/home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
  mounted() {
    // this.getMessage();
  },
  methods:{
    // async getMessage(){
    //    let res=await reqMessage({from:'123789',to:'123456'});
    //    if(res.status===200){
    //     console.log('success message');
    //     console.log(res.data);
    //    }
    // },


    async getData(){
      let res=await reqLogin({number:'123456',pwd:'1234'})
      console.log(res);
    }
  }
}
</script>

<style lang="scss">
@import url(./assets/font/iconfont.css);
.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  font-size: 25px;
  vertical-align: middle;
  color: rgb(117,120,137);
  transition: .3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  padding: 0;
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  background-color: rgb(151,157,167);
}
</style>