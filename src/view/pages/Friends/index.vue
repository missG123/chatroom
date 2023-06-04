<template>
  <div class="friendList">
    <div class="friend_left">
        <div class="title">
        <h1>大猫聊天室</h1>
        </div>
        <div class="friendsearch">
        <input type="text" class="search" placeholder=" number/昵称" v-model="searchData" @input="handleInput()">
        <span class="searchicon" @click="goSearch()">
            <svg t="1682308271906" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3431" width="24" height="24">
                <path d="M754.005333 693.674667l235.52 235.52a42.666667 42.666667 0 0 1-60.330666 60.330666l-235.52-235.52A420.650667 420.650667 0 0 1 426.666667 849.066667C193.365333 849.066667 4.266667 659.968 4.266667 426.666667S193.365333 4.266667 426.666667 4.266667s422.4 189.098667 422.4 422.4a420.650667 420.650667 0 0 1-95.061334 267.008zM426.666667 772.266667a345.6 345.6 0 1 0 0-691.2 345.6 345.6 0 0 0 0 691.2z" fill="#fff" p-id="3432">
                </path>
            </svg>  
        </span>
        </div>
        <div class="perlist" v-if="searchList.length>0">
         <div v-for="(item,index) in searchList" :key="index">
            <FriendCard :friendInfo="item" ></FriendCard>
         </div>
        
        </div>
        <div class="nosearch" v-else>{{ nosearch }}</div>
    </div>
   <div class="friend_right">
    <h3 class="friendlist_title">好友列表</h3>
     <div class="friend_content" v-for="(item,index) in friendList" :key="index">
        <div class="onefriend" @click="goChat(item)">
         <HeadPortrait :imgUrl="item.imgUrl"></HeadPortrait>
         <p class="onename">{{ item.name }}</p>
        </div>
     </div>
   </div>
  </div>
</template>

<script>
import {debounce} from '@/util/util'
import FriendCard from '@/components/FriendCard.vue'
import HeadPortrait from '@/components/HeadPortrait.vue'
import { mapState } from 'vuex'
import { reqSearchUser } from '@/api/user'
export default {
    name:'Friends',
   data(){
    return {
     imgUrl:'avert',
     searchData:'',
     searchList:[],
     nosearch:'',
     friendList:[]
    }
   },
   mounted(){
    this.$nextTick(()=>{
        this.userInfo.friends.forEach(item=>{
        this.friendList.push(item)
    })
    })
    this.$bus.$on('postFriend',data=>{
      this.friendList.push(data)
    })
   },
   components:{FriendCard,HeadPortrait},
   computed:{
    ...mapState('user',['userInfo'])
   },
   methods:{
    handleInput:debounce(function(){
        this.goSearch()
    }),
   async goSearch(){
     this.searchList.splice(0, this.searchList.length)
     let res=await reqSearchUser({require:this.searchData})
     if(res.status==200){
      if(res.data.length>0){
        this.nosearch=''
        res.data.forEach(item=>{
        if(item.number!=this.userInfo.number){
            this.searchList.push(item)
            }
        })
      }else{
        if(this.searchData==''){
            this.nosearch=''
        }else{
        this.nosearch='没有找到相关用户'
        }
      }
     }
    },
    goChat(info){
        this.$bus.$emit('updateCurrent',0)
        this.$router.push({ path:'/Home/ChatHome',
        name:'ChatHome',
        params:info
          });
       
    }
   },
//    watch:{
//     searchData(oldVal,newVal){
//         this.searchList.splice(0,this.searchList.length)
//         this.goSearch()
      
//     }
//    }

}
</script>

<style lang='less'>
.friendList{
   display: flex;
    .friend_left{
    
      .title {
        color: #fff;
        padding-left: 10px;
       }
       .friendsearch{
        margin-top: 50px;
        position: relative;
        .search{
            width: 350px;
            height: 50px;
            border-radius: 20px;
            background-color:rgb(50,54,68);
            border: none;
             color: #fff;
            outline: none;
            font-size: 16px;
            padding-left: 15px;    
        }
        .searchicon{
            position: absolute;
            top: 13px;
            right:25px;
        }

       }
       .perlist{
        margin-top: 20px;
        width: 380px;
        height: 50vh;
        // background-color: gray;
        overflow: scroll-y;
       }
       .nosearch{
        margin-top: 20px;
        width: 380px;
        height: 50vh;
        text-align: center;
       }
    }
    .friend_right{
     margin-top: 75px;
     margin-right: 50px;
     margin-left: 50px;
     flex: 1;
     background-color: rgb(50,54,68);
     height: 80vh;
     border-radius: 20px;
     .friendlist_title{
        color: #fff;
        padding-left: 15px;
        margin-top: 20px;
        background-color:  rgb(176, 178, 189);
        padding-top: 5px;
        padding-bottom: 5px;
     }
     .friend_content{
        margin-top: 20px;
        margin-left: 20px;
        width: 80%;
        // background-color: rgb(66, 70, 86);
        overflow: scroll-y;
        .onefriend{
            width: 380px;
            height: 70px;
            background-color: rgb(39, 42, 55);
            display: flex;
            align-items: center;
            padding-left: 20px;
            border-radius: 10px;
            &:hover{
                background-color:#1d90f5
            }
            .onename{
                margin-left: 15px;
                color: #fff;
                font-size: 18px;
            }
        }
     }
     
    }
}

</style>