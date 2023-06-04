<template>
  <div class="friend-card">
    <HeadPortrait :imgUrl="friendInfo.imgUrl"></HeadPortrait>
    <div class="friend-info">
        <p class="friendname">{{ friendInfo.name }}</p>
        <p class="friendnum">{{ friendInfo.number }}</p>
    </div>
    <div class="isadd" v-if="isExist" @click="addFriend()">
        <span>
            <svg t="1682323828695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8153" width="28" height="28">
                <path d="M960 0H64C25.6 0 0 25.6 0 64v896c0 38.4 25.6 64 64 64h896c38.4 0 64-25.6 64-64V64c0-38.4-25.6-64-64-64z m0 960H64V64h896v896z" fill="#eee" p-id="8154"></path>
                <path d="M332.8 556.8h160v160c0 19.2 12.8 32 32 32s32-12.8 32-32V556.8h160c19.2 0 32-12.8 32-32s-12.8-32-32-32H556.8V332.8c0-19.2-12.8-32-32-32s-32 12.8-32 32v160H332.8c-19.2 0-32 12.8-32 32s12.8 32 32 32z" fill="#eee" p-id="8155"></path>
            </svg>
        </span>
    </div>
  </div>
</template>

<script>
import { reqAddFriend } from '@/api/user';
import { mapState } from 'vuex';
import HeadPortrait from './HeadPortrait.vue';
export default {
data(){
    return {
        imgUrl:'avert'
    }
},
components:{HeadPortrait},
props:{
  friendInfo: {
      default: {
      },
    },
},
computed:{
  ...mapState('user',['userInfo']),
  isExist(){
   let res= this.userInfo.friends.find(item=>{
      return item.number==this.friendInfo.number
    })
    if(res){
      return false
    }else{
      return true
    }
  }
  
},
methods:{
 async addFriend(){
  let myInfo={
    number:this.userInfo.number,
    name:this.userInfo.name,
    imgUrl:this.userInfo.imgUrl
  }
  let friendinfo={
    number:this.friendInfo.number,
    name:this.friendInfo.name,
    imgUrl:this.friendInfo.imgUrl
  }
  this.$bus.$emit('postFriend',this.friendInfo);
    let res=await reqAddFriend({my:this.userInfo.number,friendInfo:friendinfo})
    if(res.status==200){
    let result=await reqAddFriend({my:this.friendInfo.number,friendInfo:myInfo})
    if(result.status==200){
      this.$message('添加成功')
    }
    }

  }
}
}
</script>

<style lang="less">
.friend-card{
    width: 280px;
    height: 80px;
    background-color: rgb(50,54,68);
    border-radius: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content:flex-start;
    align-items: center;
    padding-left: 20px;
    .friend-info{
      margin:0 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #fff;
      .friendname{
        margin-bottom: 10px;
        font-size: 18px;
      }
    }
    .isadd{
      margin-left: 80px;
      &:hover path{
      fill:#155d9c;
      }

    }
}
</style>