<template>
  <div
    class="file-upload-body"
  >
    <button @click="chooseFile" @blur="btnBlur" :class="options.className">{{ options.btnContent }}</button>
    <input
      type="file"
      ref="fileSelector"
      class="file-selector"
      @change="fileChange"
      :multiple="options.multiple"
      :accept="options.accept || '*'"
    />
  </div>
</template>

<script>
import findIndex from 'lodash/findIndex'

export default {
  props: {
    options: {
      type: Object,
      default: () => ({
        url: '',
        formData: {},
        multiple: false,
        btnContent: 'Choose File'
      })
    }
  },

  data: () =>({
    isFileSelectorOpen: false, // only allow one file selector dialog simultaneously
    xhrObj: {}, // file uppload xhr requests
    fileInfoList: [], // file info List
    uploadedSize: {} // file uploaded size and time, for speed calculating
  }),

  methods: {
    // click choose file btn.
    chooseFile() {
      if (this.isFileSelectorOpen) return
      this.isFileSelectorOpen = true
      this.$refs.fileSelector.click()
    },

    // set isFileSelectorOpen to false
    btnBlur() {
      this.isFileSelectorOpen = false
    },

    // user file change
    fileChange(e) {
      const accept = this.options.accept

      this.fileInfoList = [...e.target.files].map(item => {
        // make sure to upload the correct file type
        if (!accept || accept === '*' || (accept && accept.indexOf(item.type) >= 0)) {
          return {
            fileInfo: item,
            fileName: item.name,
            progress: '0.00%',
            type: 'waiting', // init type: 'waiting'
            id: new Date().getTime() + '' + parseInt(Math.random() * 10000, 10)
          }
        }
      }).filter(item => item)

      this.btnBlur()
      this.startUpload()

      e.target.value = '' // clear file input select
    },

    // start upload
    startUpload() {
      this.fileInfoList.forEach(item => {
        if (item.type === 'waiting') {
          this.xhrUpload(item.fileInfo, item.id)
        }
      })
    },

    // xhr request
    xhrUpload(fileInfo, id) {
      const userFormData = this.options.formData || {} // other custom form data.
      const { xhrObj } = this

      // define a new formData for xhr
      const formData = new FormData()
      Object.keys(userFormData).forEach(key=> {
        formData.append([key], userFormData[key])
      })
      formData.append('file', fileInfo)

      // define a xml-http-request
      xhrObj[id] = new XMLHttpRequest()

      // refresh uploading progress
      xhrObj[id].onprogress = xhrObj[id].upload.onprogress = progress => {
        this.uploading(progress, id, fileInfo)
      }

      // uploading status change (upload req success or fail)
      xhrObj[id].onreadystatechange = () => {
        try {
          // upload req success
          if (xhrObj[id].readyState === 4 && xhrObj[id].status >= 200 && xhrObj[id].status < 400) {
            const resp = {
              fileName: fileInfo.name,
              id,
              message: xhrObj[id].responseText,
            }
            this.uploaded(resp, 'success')
          } else if (xhrObj[id].readyState === 4) { // upload req fail
            const resp = {
              fileName: fileInfo.name,
              id,
              message: xhrObj[id].responseText,
            }
            this.uploaded(resp, 'fail')
          }
        } catch (e) {
          this.uploaded({ fileName: fileInfo.name, id, message: e.message }, 'error')
        }
      }

      // start xhr
      xhrObj[id].open('POST', this.options.url, true)
      xhrObj[id].send(formData)
    },

    // refresh upload progress and emit to parent
    uploading(progress, id, fileInfo) {
      const { fileInfoList, uploadedSize } = this
      const uploadSpeed = !uploadedSize[id] ? 0 : parseInt((progress.loaded - uploadedSize[id].loaded) / (new Date().getTime() - uploadedSize[id].time), 10)
      const index = findIndex(fileInfoList, { id })

      // refresh file info
      fileInfoList[index].progress = `${((progress.loaded / progress.total) * 100).toFixed(2)}%`
      fileInfoList[index].type = 'uploading'
      fileInfoList[index].uploadSpeed = uploadSpeed < 0 ? 0 : uploadSpeed

      // refresh uploaded size for speed calculating
      uploadedSize[id] = {
        time: new Date().getTime(),
        loaded: progress.loaded
      };

      this.fileInfoList = fileInfoList
      this.uploadedSize = uploadedSize

      this.$emit('progress-update', fileInfoList)
    },

    // upload complete (fail or success)
    uploaded(resp, type) {
      const { fileInfoList } = this
      const index = findIndex(fileInfoList, { id: resp.id })

      fileInfoList[index].type = type
      fileInfoList[index].response = resp.message || '{}'

      this.fileInfoList = fileInfoList

      this.$emit('progress-update', fileInfoList)
    }
  }
}
</script>

<style lang="scss">
.file-upload-body {
  display: inline-block;

  .file-selector {
    display: none!important;
  }
}
</style>
