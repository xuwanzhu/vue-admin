<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="banner.title" />
      </el-form-item>
      <el-form-item label="Banner排序">
        <el-input-number v-model="banner.sort" controls-position="right" :min="0" />
      </el-form-item>

      <el-form-item label="链接地址">

        <el-radio-group v-model="banner.linkUrl" size="medium">
          <el-radio-button label="/teacher">讲师</el-radio-button>
          <el-radio-button label="/course">课程</el-radio-button>
          <el-radio-button label="/article">文章</el-radio-button>
          <el-radio-button label="/question">问答</el-radio-button>
        </el-radio-group>

      </el-form-item>

      <!-- banner（幻灯片、轮播图-->
      <el-form-item label="添加轮播图">
        <el-upload class="avatar-uploader" :action="BASE_API+'/eduoss/fileoss/upload'" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="banner.imageUrl" :src="banner.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
//引入要被调用的banner.js文件
import bannerApi from "@/api/cms/banner";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data () {
    return {
      banner: {
        title: "",
        sort: 0,
        imageUrl: "",
        linkUrl: ""
      },
      imagecropperShow: false, //上传弹框组件是否显示
      imagecropperKey: 0, //上传组件key值
      BASE_API: process.env.BASE_API, //获取dev.env.js里面地址
      saveBtnDisabled: false //保存按钮是否禁用，防止表单重复提交
    };
  },

  created () {
    this.init();
  },

  watch: {  //监听路由变化，若变化，则执行以下方法
    $route (to, from) {
      this.banner = {
        title: "",
        sort: 0,
        imageUrl: "",
        linkUrl: ""
      }
    }
  },


  methods: {
    close () {
      //关闭文件上传弹框的方法
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    cropSuccess (data) {
      //文件上传成功的方法
      this.imagecropperShow = false;
      //上传成功后返回图片地址
      this.banner.imageUrl = data.url;
      this.imagecropperKey = this.imagecropperKey + 1;//刷新作用
    },

    init () {
      //判断请求路径中是否有id，没有就是添加，有就是修改
      if (this.$route.params && this.$route.params.id) {
        //路径有id，修改，从请求路径获取id
        const id = this.$route.params.id;
        //根据id查询banner数据，编辑数据前回显使用
        console.log("********id**************" + id)

        this.getBannerById(id);
      }
    },

    saveOrUpdate () {
      if (!this.banner.id) {
        //添加
        this.addBanner();
      } else {
        //修改
        this.updateBanner();
      }
    },

    addBanner () {
      bannerApi.addBanner(this.banner)
        .then(response => {
          this.$message({
            type: "success",
            message: "添加成功"
          }),

            //路由跳转，回到banner列表页面，路由跳转说的底层一点就是所学的JavaWEB技术栈里面的重定向操作
            this.$router.push({ path: "/cms/list" })

        });
    },

    getBannerById (id) {
      bannerApi.getBannerById(id).then(response => {
        this.banner = response.data.banner;
      });
    },

    updateBanner () {
      bannerApi.updateBanner(this.banner).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改成功"
        });
        //路由跳转，回到banner列表页面
        this.$router.push({ path: "/cms/list" });
      });
    },



    //上传封面成功调用的方法
    //结果回调
    handleAvatarSuccess (res, file) {
      this.banner.imageUrl = res.data.url; //执行eduoss中的方法
    },

    //上传封面之前调用的方法
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }














  }
};
</script>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 375px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 375px;
  height: 150px;
  display: block;
}
</style>
