<template>
  <div class="sound_card" >
    <div class="my_card" v-if="isMe" @click="handlePlay()">
       <div class="sound_time">
       {{ soundData.allTime }}"
       </div>
      <div class="sound_action">
        <div :class="classObj2"></div>
        <div :class="classObj1"></div>
        <div class="small"></div>
      </div>
    </div> 
    <div class="friend_card" v-else @click="handlePlay()">
    
      <div class="sound_action">
        <div class="small"></div>
        <div :class="classObj1"></div>
        <div :class="classObj2"></div>
      </div>
      <div class="sound_time">
       {{ soundData.allTime }}"
       </div>
    </div> 
    
  </div>
</template>

<script>
import {throttle} from '@/util/util'
import { reqFile } from '@/api/message';
export default {
name:'Sound',
mounted(){
    this.audio.addEventListener('ended',()=>{
this.classObj1.first=false;
this.classObj2.second=false
    })
},
data(){
    return {
        audio:new Audio(),
        isPlay:false,
     classObj1:{
        'middle':true,
        'first':false,
     },
     classObj2:{
        'max':true,
        'second':false,
     }
    }
},
props:['soundData','isMe'],
methods:{
handlePlay:throttle(function(){
    this.playAndStop()
},500),
async playAndStop(){
  this.isPlay=!this.isPlay;
  if(this.isPlay){//播放
    this.classObj1.first=true;
    this.classObj2.second=true;
    // 请求数据
    let res=await reqFile({fileName:this.soundData.soundName})
    if(res.status==200){
      this.audio.src=res.data;
      this.audio.play()
    }
  }else{//停止
    this.audio.pause()
     this.classObj1.first=false;
     this.classObj2.second=false;
  }
},

}
}
</script>

<style lang="less">
.sound_card{
 .my_card{
    width: 150px;
    height: 60px;
    background-color: rgb(29, 144, 245);
    border-radius: 20px 20px 5px 20px;
    display: flex;
    align-items: center;
    justify-content:flex-end;

    .sound_time{
       color: #fff;
    }
    .sound_action{
        width: 20px;
       height: 20px;
       margin-right: 20px;
       margin-left: 10px;
       position: relative;
        .small{ 
           width: 0;
           height: 0;
           left: 15px;
            border-left: 4px solid #fff;;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
           
        }
        .middle{
            width: 12px;
            height: 12px;
            left: 10px; 
         
        }
        .max{
            width: 18px;
            height: 18px;
            left: 5px;
           
        }
        .first{
            animation: broadcast3 1s ease forwards 0s infinite normal;
        }
        .second{
            animation: broadcast4 1s ease forwards 0s infinite normal;
        }
        .small,.middle,.max{
            position:absolute;
            top: 50%;
            transform: translate(0,-50%);
            border-radius: 50%;      
        }
        .max,.middle{
            border-left: 2px solid #fff;;
            border-top:2px solid transparent;
            border-bottom: 2px solid transparent;
        }
    }
} 

.friend_card{
    width: 150px;
    height: 60px;
    background-color: rgb(56, 60, 75);
    border-radius: 20px 20px 20px 5px;
    display: flex;
    align-items: center;
   

    .sound_time{
       color: #fff;
    }
    .sound_action{
    width: 20px;
       height: 20px;
       margin-right: 10px;
       margin-left: 20px;
       position: relative;
        .small{ 
           width: 0;
           height: 0;
            left: 1px;
            border-right: 4px solid rgb(29, 144, 245);;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            
        }
        .middle{
            width: 12px;
            height: 12px;
             left: -4px;   
        }
        .max{
            width: 18px;
            height: 18px;
             left: -4px;
        }
        .first{
            animation: broadcast1 1s ease forwards 0s infinite normal;
        }
        .second{
            animation: broadcast2 1s ease forwards 0s infinite normal;
        }
        .small,.middle,.max{
            position:absolute;
             top: 50%;
             transform: translate(0,-50%);
             border-radius: 50%;      
        }
        .max,.middle{
            border-right: 2px solid rgb(29, 144, 245);;
            border-top:2px solid transparent;
            border-bottom: 2px solid transparent;
        }
    }
}

}
@keyframes broadcast1 {
    0%{
     border-right-color: transparent
    }
    50%{
        border-right-color: rgb(29, 144, 245);
    }
   100%{
        border-right-color:rgb(29, 144, 245)
    }
   
}
@keyframes broadcast2 {
    0%{
     border-right-color: transparent
    }
    50%{
        border-right-color: transparent;
    }
   100%{
        border-right-color:rgb(29, 144, 245)
    }
   
}
@keyframes broadcast3 {
    0%{
     border-left-color: transparent
    }
    50%{
        border-left-color: #fff
    }
   100%{
        border-left-color:#fff
    }
   
}
@keyframes broadcast4 {
    0%{
     border-left-color: transparent
    }
    50%{
        border-left-color: transparent;
    }
   100%{
        border-left-color:#fff
    }
   
}

</style>