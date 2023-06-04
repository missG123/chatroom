<template>
  <div class="chat-window">
  
    <!-- 顶部 头像 好友名  视频、电话、文档、图片 -->
    <div class="top">
      <!-- 头像 -->
      <div class="head-pic">
        <HeadPortrait :imgUrl="friendInfo.imgUrl"></HeadPortrait>
      </div>
      <!-- 好友名称 简介 -->
      <div class="info-detail">
        <div class="name">{{ friendInfo.name }}</div>
        <div class="detail">{{ friendInfo.detail }}</div>
      </div>
      <!-- 视频 电话 文档 图片 -->
      <div class="other-fun">
        <span class="iconfont icon-shipin" @click="video"> </span>
        <span class="iconfont icon-gf-telephone" @click="telephone"></span>
        <label for="docFile">
          <span class="iconfont icon-wenjian"></span>
        </label>
        <label for="imgFile">
          <span class="iconfont icon-tupian"></span>
        </label>
        <!-- 图片 -->
        <input
          type="file"
          name=""
          id="imgFile"
          @change="sendImg"
          accept="image/*"
        />
        <!-- 文档 -->
        <input
          type="file"
          name="upfile"
          id="docFile"
          ref="docFile"
          @change="sendFile"
          accept="application/*,text/*"
        />
        <!-- accept="application/*" -->
      </div>
    </div>
  
    <!-- 对话框 -->
    <div class="botoom">
      <!--对话记录-->
      <div class="chat-content" ref="chatContent">
        <div class="chat-wrapper" v-for="(item,index) in chatList" :key="index">
          <!-- 朋友的对话 -->
          <div class="chat-friend" v-if="item.from==friendInfo.number">
            <!-- 普通文字 -->
            <div class="chat-text" v-if="item.chatType == 0">
              {{ item.content }}
            </div>
            <!-- 图片 表情 -->
            <div class="chat-img" v-if="item.chatType == 1">
              <img
                :src="item.content"
                alt="表情"
                v-if="item.extend.imgType == 1"
                style="width: 100px; height: 100px"
              />
              <el-image :src="item.content" :preview-src-list="srcImgList" style="max-width: 300px; border-radius: 10px" v-else>
              </el-image>
            </div>
            <!-- 文件 -->
            <div class="chat-img" v-if="item.chatType == 2">
              <div class="word-file">
                <FileCard
                  :fileType="item.extend.fileType"
                  :file="item.content"
                ></FileCard>
              </div>
            </div>
            <div class="chat-img" v-if="item.chatType==3">
               <div class="sound">
               <Sound :soundData="item.content" :isMe="false"></Sound>
               </div>

           </div>
            <div class="info-time">
              <img :src="require('@/assets/'+friendInfo.imgUrl+'.png')" alt="" />
              <span>{{ friendInfo.name }}</span>
              <span>{{ item.sendTime }}</span>
            </div>
          </div>
          <!-- 我的对话 -->
          <div class="chat-me" v-else-if="item.from==userInfo.number">
            <div class="chat-text" v-if="item.chatType == 0">
              {{ item.content }}
            </div>
            <div class="chat-img" v-if="item.chatType == 1">
              <img
                :src="item.content"
                alt="表情"
                v-if="item.extend.imgType == 1"
                style="width: 100px; height: 100px"
              />
              <el-image
                style="max-width: 300px; border-radius: 10px"
                :src="item.content"
                :preview-src-list="srcImgList"
                v-else
              >
              </el-image>
            </div>
            <div class="chat-img" v-if="item.chatType == 2">
              <div class="word-file">
                <FileCard
                  :fileType="item.extend.fileType"
                  :file="item.content"
                ></FileCard>
              </div>
            </div>
            <!-- 录音 -->
            <div class="chat-img" v-if="item.chatType==3">
               <div class="sound">
               <Sound :soundData="item.content" :isMe="true"></Sound>
               </div>

           </div>
            <div class="info-time">
              <span>{{ item.sendTime }}</span>
              <span>{{ userInfo.name }} </span>
              <img :src="require('@/assets/'+userInfo.imgUrl+'.png')" alt="" />
            </div>
          </div>
        </div>
      </div>
      

      <!-- 输入框 -->
      <div class="chatInputs">
        <div class="speak" @mousedown="startRecord" @mouseup="endRecord">
          <div :class="classObj1"></div>
          <div  :class="classObj2"></div>
          <div :class="classObj3"></div>
         
          <svg t="1681976100545" class="icon speck_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2639" width="45" height="45">
            <path d="M490.666667 809.856c-136.149333-10.346667-244.842667-119.04-255.189334-255.189333h42.816C289.066667 674.282667 389.589333 768 512 768s222.933333-93.717333 233.706667-213.333333h42.816c-10.346667 136.149333-119.04 244.842667-255.189334 255.189333V896h170.666667v42.666667H320v-42.666667h170.666667v-86.144zM512 85.333333a192 192 0 0 1 192 192v256a192 192 0 0 1-384 0V277.333333a192 192 0 0 1 192-192z" fill="#fff" p-id="2640">
            </path></svg>
        </div>
        <!-- 表情点击处-->
        <div class="emoji boxinput" @click="clickEmoji">
          <img src="@/assets/img/emoji/smiling-face.png" alt="" />
        </div>
        <!-- 所有表情 -->
        <div class="emoji-content">
          <Emoji
            v-show="showEmoji"
            @sendEmoji="sendEmoji"
            @closeEmoji="clickEmoji"
          ></Emoji>
        </div>
        <!-- 输入 -->
        <input class="inputs" v-model="inputMsg" @keyup.enter="sendText" />
        <!-- 发送 -->
        <div class="send boxinput" @click="sendText">
          <img src="@/assets/img/emoji/rocket.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { animation } from "@/util/util";
import {reqMessage, reqSaveMessage} from '@/api/message'
import { mapState } from "vuex";
import Recorder from 'js-audio-recorder';

import HeadPortrait from "@/components/HeadPortrait";
import Sound from '@/components/Sound.vue'
import Emoji from "@/components/Emoji";
import FileCard from "@/components/FileCard.vue";
export default {
  components: {
    HeadPortrait,
    Emoji,
    FileCard,
    Sound,
  },
  props: {
    friendInfo: Object,
    default() {
      return {};
    },
  },
  watch: {
    friendInfo() {
      console.log('变化了');
      this.getFriendChatMsg();
    },
  },
  data() {
    return {
      chatList: [],
      inputMsg: "",
      showEmoji: false,
      srcImgList: [],
      rc:null,
      startTime:'',
      test:'',
      // css
      classObj1:{
        'short':true,
        "no_appear":true,
        'one':false,
      },
      classObj2:{
        'medium':true,
        'no_appear':true,
        'two':false,
      },
      classObj3:{
        'large':true,
        'no_appear':true,
        'three':false,
      },

    };
  },
  mounted() {
      this.getFriendChatMsg();
      // this.handleMsg()
      this.$bus.$on('postMessage',(data)=>{
        console.log('收到消息')
        this.chatList.push(data)
        this.scrollBottom()
      })
      this.initRecord()
  },
  computed:{
    ...mapState('user',['userInfo'])
  },
  methods: {
   
    //获取聊天记录
   async getFriendChatMsg() {
      let res=await reqMessage({from:this.userInfo.number,to:this.friendInfo.number});
      if(res.status===200){
        this.chatList=res.data;
        for(let i=0;i<res.data.length;i++){
            this.srcImgList.push(res.data[i].content);
        }
        this.scrollBottom();
      }
    },
    //发送信息
   async sendMsg(msg) {
      console.log('msg',JSON.stringify(msg))
      let len=arguments.length;
      // this.chatList.push(msg);
      this.$ws.ws.send(JSON.stringify(msg))
       let res=await reqSaveMessage(arguments[len-1]);
       this.$bus.$emit('personCardSort',msg.to)
      
        // this.scrollBottom();
    },
    //获取窗口高度并滚动至最底层
    scrollBottom() {
      this.$nextTick(() => {
        const scrollDom = this.$refs.chatContent;
        console.log(scrollDom.scrollHeight)
        console.log(scrollDom.offsetHeight)
        animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
      });
    },
    //关闭标签框
    clickEmoji() {
      this.showEmoji = !this.showEmoji;
    },
    //发送文字信息
    sendText() {
      if (this.inputMsg) {
        let chatMsg={
          from:this.userInfo.number,
          to:this.friendInfo.number,
          chatType:0,
          content:this.inputMsg,
          sendTime:this.getTime()
        }
        // let chatMsg = {
        //   headImg: require("@/assets/img/head_portrait.jpg"),
        //   name: "大毛是小白",
        //   time: "09：12 AM",
        //   msg: this.inputMsg,
        //   chatType: 0, //信息类型，0文字，1图片
        //   uid: "1001", //uid
        // };
        this.sendMsg(chatMsg);
        console.log('number',this.friendInfo.number)
        this.$emit('personCardSort', this.friendInfo.number)
        this.inputMsg = "";
        
      } else {
        this.$message({
          message: "消息不能为空哦~",
          type: "warning",
        });
      }
    },
    //发送表情
    sendEmoji(msg) {
      console.log(msg);
      let chatMsg={
          from:this.userInfo.number,
          to:this.friendInfo.number,
          chatType:1,
          extend:{imgType:1},
          content:msg,
          sendTime:this.getTime()
        }
      this.sendMsg(chatMsg);
      this.clickEmoji();
    },
    //发送本地图片
    sendImg(e) {
      let _this = this;
      let chatMsg={
          from:this.userInfo.number,
          to:this.friendInfo.number,
          chatType:1,
          extend:{imgType:2},
          content:"",
          sendTime:this.getTime()
        }
      let files = e.target.files[0]; //图片文件名
      if (!e || !window.FileReader) return; // 看是否支持FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 关键一步，在这里转换的
      reader.onloadend= (e) =>{
        chatMsg.content=e.target.result; //赋值
        _this.sendMsg(chatMsg);
        _this.srcImgList.push(e.target.result);
         console.log(_this.srcImgList)
       
      };  
      e.target.files = null;
    },
    //发送文件
    sendFile(e) {
      let chatMsg={
          from:this.userInfo.number,
          to:this.friendInfo.number,
          chatType:2,
          extend:{fileType:''},
          content:{},
          sendTime:this.getTime(),
        }
      let files = e.target.files[0]; //文件名
      let formData=new FormData()
       formData.append('upfile',files)
       formData.append('from',this.userInfo.number)
       formData.append('to',this.friendInfo.number)
       formData.append('sendTime',this.getTime())
       formData.append('chatType',2)
     
       console.log('sf',files)

       let fileData={
        name:files.name,
        size:files.size,
        type:files.type,
        lastModified:files.lastModified,
        lastModifiedDate:files.lastModifiedDate

       };
       formData.append('content',JSON.stringify(fileData))
       
      chatMsg.content= fileData;
      if (files) {
        switch (files.type) {
          case "application/msword":
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            chatMsg.extend.fileType = '1';
            break;
          case "application/vnd.ms-excel":
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            chatMsg.extend.fileType = '2';
            break;
          case "application/vnd.ms-powerpoint":
          case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            chatMsg.extend.fileType = '3';
            break;
          case "application/pdf":
            chatMsg.extend.fileType = '4';
            break;
          case "application/zip":
          case "application/x-zip-compressed":
            chatMsg.extend.fileType = '5';
            break;
          case "text/plain":
            chatMsg.extend.fileType = '6';
            break;
          default:
            chatMsg.extend.fileType = '0';
        }
        formData.append('fileType',chatMsg.extend.fileType)
        this.sendMsg(chatMsg,formData);
        e.target.files = null;
      }
    },

    // 初始化录音对象
 initRecord(){
    this.rc=new Recorder({
     sampleBits:16,//采样位，支持8or16 默认16
     sampleRate:16000,//采样率 支持11025 16000 22050 44100 24000 48000 
     numChannels:1//身道 支持1 or 2 默认1
    })
   },

// 开始录音
startRecord(){
  console.log('kaishino')
// 添加动画
 this.classObj1.one=true;
 this.classObj1.no_appear=false
 this.classObj2.no_appear=false
 this.classObj3.no_appear=false
 this.classObj2.two=true;
 this.classObj3.three=true;
//  实例化语音对象
this.startTime=new Date();
//    录音
Recorder.getPermission().then(()=>{
  console.log('kaishiluyin')
  this.rc.start()
},(error)=>{
  console.log(error.message)
})

},
// 录音结束
endRecord(){
  // 取消动画
  console.log('jieshu')
 this.classObj1.one=false;
 this.classObj1.no_appear=true
 this.classObj2.no_appear=true
 this.classObj3.no_appear=true
 this.classObj2.two=false;
 this.classObj3.three=false;
//  停止录音
this.rc.stop();
let chatMsg={
  from:this.userInfo.number,
          to:this.friendInfo.number,
          chatType:3,
          content:{},
          sendTime:this.getTime(),
}
let formData=new FormData()
// 获取wav格式音频数据
var blob=this.rc.getWAVBlob();

let newblob =new Blob([blob],{type:'audio/wav'})
let fileName=new Date().getTime()+'.wav';
let fileOfBlob=new File([newblob],fileName)

formData.append('upfile',fileOfBlob)
// 录音时长
this.startTime=Math.ceil((new Date()-this.startTime)/1000)
formData.append('from',this.userInfo.number)
formData.append('to',this.friendInfo.number)
formData.append('sendTime',this.getTime())
formData.append('chatType',3)
let soundData={
  allTime:this.startTime,
  soundName:fileName
}
formData.append('content',JSON.stringify(soundData));
chatMsg.content=soundData
this.sendMsg(chatMsg,formData)
},




    // 发送语音
    telephone() {
      this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
    },
    //发送视频
    video() {
      this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
    },
    // 获取当前时间
    getTime(){
      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      let day=date.getDate();
      let hour=date.getHours();
      let minute=date.getMinutes();
      let second=date.getSeconds();
      let time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
      return time;
    },
    toFormData(data){
      if (data === null) return null;
  return Object.keys(data).reduce((formData, item) => {
    if (item === 'files') { //特殊判断如果内容为files数组，就让里面值不用走JSON.stringify
      data[item] &&
        data[item].forEach((curr) => {
          formData.append('upload_file[]', curr.originFileObj);
        });
    } else {
      formData.append(item, JSON.stringify(data[item]));
    }
    return formData;
  }, new FormData());
    }
  },
};
</script>

<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  position: relative;

  .top {
    margin-bottom: 50px;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .head-pic {
      float: left;
    }
    .info-detail {
      float: left;
      margin: 5px 20px 0;
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
      .detail {
        color: #9e9e9e;
        font-size: 12px;
        margin-top: 2px;
      }
    }
    .other-fun {
      float: right;
      margin-top: 20px;
      span {
        margin-left: 30px;
        cursor: pointer;
      }
      // .icon-tupian {

      // }
      input {
        display: none;
      }
    }
  }
  .botoom {
    width: 100%;
    height: 70vh;
    background-color: rgb(50, 54, 68);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0; /* Safari,Chrome 隐藏滚动条 */
        height: 0; /* Safari,Chrome 隐藏滚动条 */
        display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }
      .chat-wrapper {
        position: relative;
        word-break: break-all;
        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .chat-text {
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgb(56, 60, 75);
            color: #fff;
            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }
          .chat-img {
            img {
              width: 100px;
              height: 100px;
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }
            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }
        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          .chat-text {
            float: right;
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(29, 144, 245);
            color: #fff;
            &:hover {
              background-color: rgb(26, 129, 219);
            }
          }
          .chat-img {
            img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 10px;
            }
          }
          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }
            span {
              line-height: 30px;
            }
            span:first-child {
              color: rgb(101, 104, 115);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;
      .speak{
        position: relative;
        margin-top:5px;
        margin-right: 20px;
        .short{
          position:absolute;
          top:0;
          left: 50%;
          transform: translate(-50%);
          width: 14px;
          height: 7px;
          // animation: record 1s linear both 0s infinite normal;
        }
        .medium{
          position:absolute;
          top:-4px;
          left: 50%;
          transform: translate(-50%);
          width: 20px;
          height: 10px;
          // animation: record 1s linear both 1.1s infinite normal;
        }
        .large{
          position:absolute;
          top:-8px;
          left: 50%;
          transform: translate(-50%);
          width: 26px;
          height: 13px;
          // animation: record 1s linear both 1.6s infinite normal;
        }
        .appear{
          display: block;
        }
        .one{
          animation: record 1s linear both 0s infinite normal;
        }
        .two{
          animation: record 1s linear both 1.1s infinite normal;
        }
        .three{
          animation: record 1s linear both 1.6s infinite normal;
        }
        .no_appear{
          display: none;
        }
      
        .short,.medium,.large{
          border-radius: 50%;
          border-top:3px solid rgb(29, 144, 245);
          border-bottom:1px solid transparent;
          border-left:1px solid transparent;
          border-right:1px solid transparent;
        }
        


        .speck_icon:hover{
           path{
            fill:rgb(29, 144, 245);
           }
        }
      }
      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        position: relative;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .emoji {
        transition: 0.3s;
        &:hover {
          background-color: rgb(46, 49, 61);
          border: 1px solid rgb(71, 73, 82);
        }
      }

      .inputs {
        width: 90%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;
        &:focus {
          outline: none;
        }
      }
      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);
        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}
@keyframes record {
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
</style>