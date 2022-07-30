<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <!--章节-->
    <el-button type="text" @click="opendialogChapterFormVisible()">添加章节</el-button>
    <ul class="chanpterList">
      <li v-for="chapter in ChapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="opendialogVideoFormVisible(chapter.id)">添加课时</el-button>
            <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 小节、视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title}}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>

      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加章节弹窗-->
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">

      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节弹窗 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload :on-success="handleVodUploadSuccess" :on-remove="handleVodRemove" :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed" :file-list="fileList" :action="BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1" class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import chapter from "@/api/edu/chapter"
import video from "@/api/edu/video"


export default {
  data () {
    return {
      chapter: {//封装章节属性
        title: '',
        sort: 0
      },
      dialogChapterFormVisible: false, //章节弹窗，true表示打开，false关闭
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "", //当前课程id
      ChapterVideoList: [],  //章节和小节列表数据


      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示小节弹窗
      chapterId: '', // 小节所在的章节id


      //设置的是默认值，不代表video对象只有这些属性，具体看后端对应的实体类
      video: {// 课时对象
        title: '',
        sort: 0,//排序
        isFree: 0,//课程是否免费
        videoSourceId: '', //视频id
        videoOriginalName: '' //视频原始名称
      },

      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址


    }

  },

  created () {
    //获取网址中的id,   为啥是id?因为路由中的参数就名为id
    if (this.$route.params && this.$route.params.id) {
      //获取id
      this.courseId = this.$route.params.id
      //调用获取章节和小节列表的方法
      this.getChapterVideo()
    } else {
      alert("网址中无课程id!")
    }


  },

  methods: {
    //=================================================小节操作===============================================================
    //1、点击添加小节 按钮
    opendialogVideoFormVisible (chapterId) {
      //清空弹窗数据
      this.video = {}
      this.fileList = [] //清空文件列表

      //打开弹窗
      this.dialogVideoFormVisible = true

      //设置章节id
      this.video.chapterId = chapterId
    },

    //添加或修改小节按钮
    saveOrUpdateVideo () {
      //判断是添加还是修改,有小节id则为修改
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },

    //添加小节
    addVideo () {
      //获取章节id
      this.video.courseId = this.courseId
      video.addVideoInfo(this.video)
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '添加课程小节成功！'
          })
          //关闭弹窗
          this.dialogVideoFormVisible = false
          //回显列表
          this.getChapterVideo()
        })
    },

    //点击小节编辑按钮
    editVideo (videoId) {
      //打开弹窗
      this.dialogVideoFormVisible = true
      //回显弹窗数据
      video.getOneVideoById(videoId)
        .then(response => {
          this.video = response.data.items
        })
    },

    //编辑小节
    updateVideo () {
      //获取章节id
      this.video.courseId = this.courseId
      video.updateVideorInfo(this.video)
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          //弹窗
          this.dialogVideoFormVisible = false
          //回显列表
          this.getChapterVideo()
        })
    },

    //删除小节
    deleteVideo (videoId) {
      //弹窗提示
      this.$confirm('是否删除该小节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        video.deleteVideoById(videoId)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            //关闭弹窗
            this.dialogVideoFormVisible = false
            //回显数据
            this.getChapterVideo()
          })
      }).catch(() => { })//捕获取消按钮，不然会报错
    },

    //3、视频上传成功调用的方法
    handleVodUploadSuccess (response, file, fileList) {
      //上传视频id赋值，给数据库中的video表赋值
      this.video.videoSourceId = response.data.videoId
      //上传视频名称赋值
      this.video.videoOriginalName = file.name
    },

    //4、上传视频之前
    handleUploadExceed (files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    //5、点击删除视频 确定按钮之后调用的方法
    handleVodRemove () {
      video.deleteAliyunVideoById(this.video.videoSourceId)
        //提示
        .then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })

          //把文件列表清空
          this.fileList = []

          //把video表中的视频id和名称清空
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
        })
    },

    //6、点击x删除之后显示弹窗的方法
    beforeVodRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },


    //=================================================章节操作===============================================================
    //点击添加章节按钮
    opendialogChapterFormVisible () {
      //打开弹窗
      this.dialogChapterFormVisible = true
      //清空表单
      this.chapter.id = ''
      this.chapter.title = ''
      this.chapter.sort = 0
    },

    //点击编辑按钮
    editChapter (chapterId) {
      //打开弹窗
      this.dialogChapterFormVisible = true
      //回显弹窗数据
      chapter.getOneChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.items
        })
    },

    //添加章节
    addChapter () {
      //添加课程id到chapter对象
      this.chapter.courseId = this.courseId
      chapter.addChapterInfo(this.chapter)
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '添加课程信息成功！'
          })

          //关闭弹窗
          this.dialogChapterFormVisible = false

          //回显列表
          this.getChapterVideo()
        })

    },

    //修改章节
    updateChapter () {
      chapter.updateChapterInfo(this.chapter) //这个chapter是点击编辑按钮返回的那个
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          //关闭弹窗
          this.dialogChapterFormVisible = false
          //回显列表
          this.getChapterVideo()
        })

    },

    //删除章节
    deleteChapter (chapterId) {

      //弹窗提示
      this.$confirm('是否删除该章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapterById(chapterId)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            //关闭弹窗
            this.dialogChapterFormVisible = false
            //回显数据
            this.getChapterVideo()
          })
      }).catch(() => { })
    },

    //添加或修改章节
    saveOrUpdate () {
      //判断是添加还是修改
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },


    //根据课程id查询所有章节和小节
    getChapterVideo () {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.ChapterVideoList = response.data.list
        })
    },

    //返回上一步，同时做数据回显
    previous () {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    //跳转下一步
    next () {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>