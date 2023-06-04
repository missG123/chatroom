<template>
  <div class="login_main">
    <div class="login_div">
      <transition leave-active-class="animate__animated animate__fadeOutDown"
       enter-active-class="animate__animated animate__fadeInUp">
       <div class="login_left" v-if="isLogin">
      <h1 class="login_title">登 录</h1>
      <p><input type="text" class="number" placeholder="账号" v-model="number"/></p>
      <p><input type="password" class="pwd" placeholder="密码" v-model="pwd"></p>
       <p class="note"><a>忘记密码?</a></p>
       <button class="login_btn" @click="goLogin()">登录</button>
    </div>
  </transition>
<transition leave-active-class='animate__animated animate__fadeOutLeft' 
    enter-active-class="animate__animated animate__fadeInLeft">
    <div class="login_right" v-if="isLogin">
        <p class="no_number">没有账号？</p>
        <p class="go_register">立即注册吧😃</p>
        <button class="register" @click="isLogin=!isLogin">注册</button>
    </div>
  </transition >
    </div>
   <div class="register_div">
    <transition enter-active-class='animate__animated animate__fadeInRight' leave-active-class="animate__animated animate__fadeOutRight">
      <div class="register_left" v-if="!isLogin">
        <p class="no_number">已有账号？</p>
        <p class="go_register">请登录😃</p>
        <button class="register" @click="isLogin=!isLogin">登录</button>
    </div>
  </transition>
    <transition enter-active-class='animate__animated animate__fadeInLeft' leave-active-class="animate__animated animate__fadeOutLeft">
    <div class="register_right" v-if="!isLogin">
      <h1 class="login_title">注册</h1>
      <p><input type="text" class="number" placeholder="账号" v-model="number"/></p>
      <p><input type="text" class="nickname" placeholder="昵称" v-model="nickname"/></p>
      <p><input type="password" class="pwd" placeholder="密码" v-model="pwd"></p>
       <button class="login_btn" @click="goRegister()">注册</button>
    </div>
  </transition>
   </div>
  
 
  </div>
</template>

<script>
import 'animate.css'
import { reqHasUser, reqRegister } from '@/api/user';
import { mapState } from 'vuex';
export default {
name:'Login',
data(){
  return {
    number:'',
    pwd:'' ,
    nickname:'',
    isLogin:true
  }
},
computed:{
  ...mapState('user',['token'])
  },
methods:{

 async goLogin(){
   const {number,pwd}=this;
  try {
    if(number&&pwd){
    await this.$store.dispatch('user/userLogin',{
      number,
      pwd
    });
   if(this.token){
    this.$router.push({path:'/Home'});
   }else{
    this.$message('账号密码有误请重新输入')
    this.number=''
    this.pwd=''
   }
   
   }
  } catch (error) {
    alert(error.message)
  }
  },
 async goRegister(){
    const {number,pwd}=this;
    let myInfo={number,pwd,name:this.nickname,imgUrl:'avert',friends:[]}
    let res=await reqHasUser({number})
    if(res.status==200){
      if(res.data.code){
        let res=await reqRegister(myInfo);
         if(res.status==200){
          this.$message(res.data)
          this.nickname='';
          this.number='';
          this.pwd='';
        }else{
          this.$message('注册失败')
        }
      }else{
        this.$message(res.data.message)
      }
    }

  }
}
}
</script>

<style lang="less">
.login_main{
  width: 710px;
  height: 450px;
  border-radius: 15px;
  box-shadow: 0px 10px 15px gray;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
 .login_div{
  display: flex;
  .login_left{
    width: 375px;
     height: 450px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    background-color: rgb(238, 233, 233);
    text-align: center;
    .login_title{
        margin-top: 90px;
        margin-bottom: 10px;
        color: rgb(50, 54, 68);
    }
    p{
        margin-top: 15px;
        input{
        width: 300px;
        height: 40px;
        }
    }
    .note{
        font-size: 12px;
        margin-bottom: 20px;
        color: rgb(50, 54, 68);
        a{
            cursor: pointer;
        }
    }
    .login_btn{
        width: 126px;
        height: 45px;
        border-radius: 15px;
        background-color:rgb(50, 54, 68);
        color:#fff ;
        font-size: 16px;
        font-weight: 700;
    }
    
  }
  .login_right{
    width: 335px;
    height: 450px;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    background-color:rgb(50, 54, 68);
    text-align: center;
    color:rgb(238, 233, 233);
    .no_number{
        margin-top: 120px;
        font-size: 32px;
        font-weight: 700;
    }
    .go_register{
        margin-top: 30px;
        margin-bottom: 20px;
        font-size: 12px;
    }
    .register{
        width: 127px;
        height: 46px;
        border-radius: 23px;
        font-weight: 700;
        color:rgb(238, 233, 233);
        border:1px solid rgb(238, 233, 233);
        background-color:rgb(50, 54, 68);
    }
  }
 }
 .register_div{ 
  display: flex;
position: absolute;
top: 0;
  .register_left{
   width: 335px;
   height: 450px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    background-color:rgb(50, 54, 68);
    text-align: center;
    color:rgb(238, 233, 233);
    .no_number{
        margin-top: 120px;
        font-size: 32px;
        font-weight: 700;
    }
    .go_register{
        margin-top: 30px;
        margin-bottom: 20px;
        font-size: 12px;
    }
    .register{
        width: 127px;
        height: 46px;
        border-radius: 23px;
        font-weight: 700;
        color:rgb(238, 233, 233);
        border:1px solid rgb(238, 233, 233);
        background-color:rgb(50, 54, 68);
    }
  }
  .register_right{
    width: 375px;
     height: 450px;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    background-color: rgb(238, 233, 233);
    text-align: center;
    .login_title{
        margin-top: 90px;
        margin-bottom: 10px;
        color: rgb(50, 54, 68);
    }
    p{
        margin-top: 15px;
        input{
        width: 300px;
        height: 40px;
        }
    }
    .note{
        font-size: 12px;
        margin-bottom: 20px;
        color: rgb(50, 54, 68);
        a{
            cursor: pointer;
        }
    }
    .login_btn{
        width: 126px;
        height: 45px;
        border-radius: 15px;
        margin-top: 20px;
        background-color:rgb(50, 54, 68);
        color:#fff ;
        font-size: 16px;
        font-weight: 700;
    }
    
  }
}
} 




</style>