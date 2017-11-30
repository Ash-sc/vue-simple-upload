<template>
  <div id="app">
    <h3>Vue Simple Upload</h3>
    <vue-simple-upload :options="options" v-on:progress-update="progressUpdate">
    </vue-simple-upload>
    <br>
    <img :src="imageUrl" alt="img" v-show="imageUrl" class="image-show-section" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        className: 'btn-solid',
        btnContent: 'Choose File',
        url: '/api/files/upload',
        accept: 'image/png, image/jpeg',
        multiple: true
      },
      imageUrl: ''
    }
  },

  methods: {
    progressUpdate(fileInfoList) {
      console.log("upload speed（kb/s）：", fileInfoList[0].uploadSpeed)
      if (fileInfoList[0].type === 'success') {
        this.imageUrl = JSON.parse(fileInfoList[0].response).url
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.image-show-section {
  max-width: 650px;
  max-height: 400px;
  border-radius: 5px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
