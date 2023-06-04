<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div class="title">
        <h1>大猫聊天室</h1>
      </div>
      <div class="online-person">
        <span class="onlin-text">聊天列表</span>
        <div class="person-cards-wrapper">
          <div
            class="personList"
            v-for="personInfo in friendsList"
            :key="personInfo.number"
            @click="clickPerson(personInfo)"
          >
            <PersonCard
              :personInfo="personInfo"
              :pcCurrent="pcCurrent"
            ></PersonCard>
          </div>
        </div>
      </div>
    </div>
    <div class="chatRight">
      <!-- <router-view></router-view> -->
      <div v-if="showChatWindow">
        <ChatWindow
          :friendInfo="chatWindowInfo"
          @personCardSort="personCardSort"
        ></ChatWindow>
      </div>
      <div class="showIcon" v-else>
        <span class="iconfont icon-snapchat"></span>
        <!-- <img src="@/assets/img/snapchat.png" alt="" /> -->
      </div>
    </div>
    <!-- <el-col :span="4"><div class="grid-content bg-purple"></div></el-col> -->
  </div>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";
import ChatWindow from "./chatwindow.vue";

// import { getFriend } from "@/api/getData";
import { reqMessage } from "@/api/message";
import { mapState } from 'vuex';
import { reqGetUnRead } from '@/api/noread';
export default {
  name: "App",
  components: {
    PersonCard,
    ChatWindow,
  },
  data() {
    return {
      pcCurrent: "",
      personList: [],
      showChatWindow: false,
      chatWindowInfo: {},
      nowRoom:'',
      chatList:[],
      friendsList:[]
    };
  },
  mounted() {
    this.userInfo.friends.forEach(item=>{
      this.friendsList.push(item)
    })
    // getFriend().then((res) => {
    //   console.log(res);
    //   this.personList = res;
    // });
    // this.handleMsg()
    this.$bus.$on('postMessage',(data)=>{
      this.personCardSort(data.from)
      if(data.from!=this.nowRoom){
            let nomsg={
                    from: data.from,
                    to:data.to,
                    sendTime: data.sendTime,
                    content: ''
                }
                if (data.chatType == 0) {
                    nomsg.content = data.content
                } else if (data.chatType == 1) {
                    nomsg.content = '[图片]'
                } else if (data.chatType == 2) {
                    nomsg.content = '['+data.content.name+']';
                }
            this.$store.dispatch('noRead/setNoRead',nomsg)
        }
    })
    console.log(this.$route.params)
    if(this.$route.params.number){
      this.isToChat()
    }
    this.getNoReadFirst()
  
  },
  computed:{
    ...mapState('user',['userInfo'])
  },
  methods: {
     clickPerson(info) {
      this.chatWindowInfo = info;
      this.showChatWindow = true;
      this.personInfo = info;
      this.pcCurrent = info.number;
      this.nowRoom=info.number;
     this.$store.dispatch('noRead/removeNoRead',{from:info.number,to:this.userInfo.number})

    },
    personCardSort(number) {
      let flag=false
      if (number !== this.friendsList[0].number) {
        let nowPersonInfo={};
        console.log(this.friendsList,'================')
        for (let i = 0; i < this.friendsList.length; i++) {
          if (this.friendsList[i].number == number) {
           let {number,name,imgUrl}=this.friendsList[i]
           
           nowPersonInfo={number,name,imgUrl}
           console.log(nowPersonInfo,'///////')
            // nowPersonInfo = Object.assign({},this.userInfo.friends[i])
            this.friendsList.splice(i, 1);
             flag=true;
            break;
          }
        }
        console.log(number)
        console.log(nowPersonInfo,'--------')
        if(flag){
          this.friendsList.unshift(nowPersonInfo);
        } 
      }
    },
   async getNoReadFirst(){
      let res=await reqGetUnRead({to:this.userInfo.number})
      console.log('fffffffff',res.data)
      this.$store.dispatch('noRead/saveFirst',res.data )
    },
    isToChat(){
      console.log(this.$route.params)
      this.clickPerson(this.$route.params)
    },
  },
};
</script>

<style lang="scss" scoped>
.chatHome {
  // margin-top: 20px;
  display: flex;
  .chatLeft {
    width: 280px;
    .title {
      color: #fff;
      padding-left: 10px;
    }
    .online-person {
      margin-top: 50px;
      .onlin-text {
        padding-left: 10px;
        color: rgb(176, 178, 189);
      }
      .person-cards-wrapper {
        padding-left: 10px;
        height: 65vh;
        margin-top: 20px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0; /* Safari,Chrome 隐藏滚动条 */
          height: 0; /* Safari,Chrome 隐藏滚动条 */
          display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
        }
      }
    }
  }

  .chatRight {
    flex: 1;
    padding-right: 30px;
    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /*垂直居中 */
      left: calc(50% - 50px); /*水平居中 */
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
        // color: rgb(28, 30, 44);
      }
    }
  }
}
</style>