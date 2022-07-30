<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-form label-width="120px">
      <!-- 轮播图名称-->
      <el-form-item label="轮播图名称">
        <el-input v-model="banner.title" placeholder=" 轮播图名称"></el-input>
      </el-form-item>

      <!--轮播图链接地址-->
      <el-form-item label="图片链接地址">
        <el-select v-model="banner.linkUrl" clearable placeholder="请选择">
          <!--
        数据类型一定要和取出的json中的一致，否则没法回填
        因此，这里value使用动态绑定的值，保证其数据类型是number
        -->
          <el-option :value="1" label="课程页" />
          <el-option :value="2" label="讲师页" />
        </el-select>
      </el-form-item>

      <!-- 轮播图封面-->
      <el-form-item label="轮播图封面">
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'" class="avatar-uploader">
          <img :src="banner.imageUrl" width="400px" height="250px">
        </el-upload>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="SaveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>