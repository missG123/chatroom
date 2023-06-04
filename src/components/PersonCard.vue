<template>
  <div class="person-card" :class="{ activeCard: personInfo.number == current }">
    <div class="info">
          <HeadPortrait :imgUrl="personInfo.imgUrl"></HeadPortrait>
          <div class="info-detail">
            <div class="name">{{ personInfo.name }}</div>
            <div class="detail">{{  }}</div>
          </div>
          <div class="noread" v-if="noReadNum>0">
            <span>{{ noReadNum }}</span>
          </div>

    </div>
  </div>
</template>

<script>
import HeadPortrait from "./HeadPortrait.vue";
import {mapState} from 'vuex'
import {reqGetUnRead} from '@/api/noread'

export default {
  props: {
    personInfo: {
      default: {
      },
    },
    pcCurrent: {
      default: ''
    }
  },
  components: {
    HeadPortrait,
  },
  data() {
    return {
      current: '',
     
    }
  },
  watch: {
    pcCurrent: function() {
      this.isActive()
    }
  },
  mounted(){
    // this.getNoread()
    console.log('oc',this.personInfo)
  }
  ,
  computed:{
    ...mapState('user',['userInfo']),
    ...mapState('noRead',['noread']),
    noReadNum(){
      let key=this.personInfo.number;
       if(this.noread[key]){
      return this.noread[key]
       }else{
       return 0
       }
    }
  }
  ,
  methods: {
    isActive() {
      this.current = this.pcCurrent
    },
    async getNoread(){
      let reqMess={
        from:this.personInfo.number,
        to:this.userInfo.number
      }
       let res=await reqGetUnRead(reqMess)
       if(res.status==200){
        console.log(res.data)
        this.noReadNum=res.data
       }
    },
    
  },
};
</script>

<style lang="scss" scoped>
.person-card {
  width: 250px;
  height: 80px;
  border-radius: 10px;
  background-color: rgb(50, 54, 68);
  position: relative;
  margin: 25px 0;
  cursor: pointer;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    .info-detail {
      margin-top: 5px;
      margin-left: 20px;
      .name {
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 5px;
      }
      .detail {
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
      }
      
    }
    .noread{
        position: absolute;
        top:10px;
        right: 15px;
        width: 30px;
        height: 30px;
        background-color:#155d9c;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        color: #fff;
      }
  }
  &:hover {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
    // box-shadow:  0 5px 20px rgba(251, 152, 11, .5);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
  }
}
.activeCard {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 3px 2px 10px 0px rgba(0, 136, 255);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
}
</style>