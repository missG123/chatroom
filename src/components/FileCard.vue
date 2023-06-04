<template>
  <div>
  <div class="file-card" @click="showFile">
    <img src="@/assets/img/fileImg/unknowfile.png" alt="" v-if="fileType == '0'"/>
    <img src="@/assets/img/fileImg/word.png" alt="" v-else-if="fileType == '1'"/>
    <img src="@/assets/img/fileImg/excel.png" alt="" v-else-if="fileType == '2'"/>
    <img src="@/assets/img/fileImg/ppt.png" alt="" v-else-if="fileType == '3'"/>
    <img src="@/assets/img/fileImg/pdf.png" alt="" v-else-if="fileType == '4'"/>
    <img src="@/assets/img/fileImg/zpi.png" alt="" v-else-if="fileType == '5'"/>
    <img src="@/assets/img/fileImg/txt.png" alt="" v-else/>
    <div class="word">
      <span
        > {{file.name || '未知'}}</span
      >
      <span>{{ fileSize }}</span>
    </div>
  </div>
  <el-dialog
  :title=file.name
  :visible.sync="dialogVisible"
  width="50%"
  
  >
  <div class="word_info">
    <!-- <pre> -->
    {{ fileInfo }}
  <!-- </pre> -->
  </div>

</el-dialog>
  </div>
</template>

<script>
import {reqFile} from '@/api/message'
export default {
  //  props: ["fileType", "file"],

  props: {
    fileType: String,
    file: Object,
    default() {
      return {
       
      };
    },
  },
  data(){
    return {
      dialogVisible:false,
      fileInfo:''
    }
  },
  watch: {
    file() {
      console.log(this.file);
    },
  }, 
  methods:{
   async showFile(){
    
      // window.open('@/upload/'+this.file.name)
      let res=await reqFile({fileName:this.file.name})
      if(res.status==200){
        this.fileInfo=res.data;
        this.dialogVisible=true;
      }
      
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  } ,
  mounted() {
  },
  computed:{
    fileSize(){
    let decimals=2;
    if (this.file.size === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    const i = Math.floor(Math.log(this.file.size) / Math.log(k));
    return parseFloat((this.file.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  }

};
</script>

<style lang="scss" scoped>
.file-card {
  width: 250px;
  height: 100px;
  background-color: rgb(45, 48, 63);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: rgb(33, 36, 54);
  }
  img {
    width: 60px;
    height: 60px;
  }
  .word {
    width: 60%;
    margin-left: 10px;
    overflow: hidden;
    span {
      width: 90%;
      display: inline-block;
      color: #fff;
    }
    span:first-child {
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    span:last-child {
      font-size: 12px;
      color: rgb(180, 180, 180);
    }
  }
}
.word_info{
  white-space: pre-wrap;
}
</style>