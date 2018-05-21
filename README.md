# vue-simple-file-upload

a simple vue file upload component using XHR

> vue file upload component use XHR

> demo: [http://demo.2017017.xyz/vue-demo/#/vue-simple-file-upload](http://demo.2017017.xyz/vue-demo/#/vue-simple-file-upload)

### 1. Install

```bash
npm install vue-simple-file-upload
```

#### 2. Usage

```
# global injection
import VueSimpleUpload from 'vue-simple-file-upload'
Vue.use(VueSimpleUpload)
...
```

```
# component injection
...
<script>
import { VueSimpleUpload } from 'vue-simple-file-upload'

export default {
  components: { VueSimpleUpload },
  ...
}
```

```
<template>
  <div>
    <vue-simple-upload
      :options="options"
      @progress-update="progressUpdate"
      @file-size-error="fileSizeError"
    >
    </vue-simple-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {
        className: 'btn-solid',
        btnContent: 'Click Me',
        url: '/api/files/upload',
        accept: 'image/png'
      },
      imageUrl: ''
    }
  },

  methods: {
    fileSizeError(fileNames) {
      console.error('Files blow are oversized: ', ...fileNames)
    },
    progressUpdate(fileInfoList) {
      console.log("upload speed（kb/s）：", fileInfoList[0].uploadSpeed)
      if (fileInfoList[0].type === 'success') {
        // do something
      }
    }
  }
}
</script>
```

#### 3. options

* **url**
  * file uploading request url
  * type **String**
  * required **Yes**
* **btnContent:**
  * 'choose file' botton content
  * type **String**
  * required **No**
  * default **'Choose File'**
* **className:**
  * 'choose file' botton class name
  * type **String** ps:multiple className can be added, use space split them
  * required **No**
  * default **''**
* **accept**
  * file type accepted
  * type **String** ps:same as the 'accept' attribute in \<input\>
  * required **No**
  * default **'\*'**
* **multiple**
  * multiple files upload
  * type **Boolean**
  * required **No**
  * default **false**
* **size**
  * the max file size can be uploaded (Unit: byte)
  * type **Number**
  * required **No**
  * default **0 (∞)**
* **autoStart**
  * auto upload files after selected
  * type **Boolean**
  * required **No**
  * default **true**

#### 4. dynamic upload progress

'$emit' function will send the upload message to its parent component, and this function takes one parameter : fileList (Array)

fileList example:

```
[
  {
    fileInfo: File // the first file you choose.
    fileName // the name of first file you choose.
    progress // uploaded progress. eg: '15.01%'
    uploadSpeed // uploading speed. eg: '1001'(kb/s)
    type // uploading status, could be 'waiting', 'uploading', 'success' or 'fail' or 'abort'
    id // an unique string, used for upload abort
    response // upload requset response (if your file is uploading, this will be an empty Object)
  },
  ... // more fileList object if it's uploading multiple files
]
```

#### 5. catch oversized error

Use '$emit' function to catch oversized error, just like example in '2. Usage'.

#### 6. abort

Abort the uploading request by using `this.$refs.XXX.abort()`

eg:

```
<vue-simple-upload :options="options" v-on:progress-update="progressUpdate" ref="fileUploadSection">
</vue-simple-upload>

...
methods: {
  ...
  abort(id) {
    this.$refs.fileUploadSection.abort() // abort all uploading files
    this.$refs.fileUploadSection.abort(id) // abort one uploading file by fileInfoList.id
  }
  ...
}
```

#### 7. custom Start // 2017-12-28

If setting "autoStart: false" in your config. You can custom start upload by "id" (default: "all")

eg:

```
<vue-simple-upload :options="options" v-on:progress-update="progressUpdate" ref="fileUploadSection">
</vue-simple-upload>

...
methods: {
  ...
  startUpload(id) {
    this.$refs.fileUploadSection.startUpload() // start uploading all files which "type === 'waiting'"
    this.$refs.fileUploadSection.startUpload(id) // start uploading file by fileInfoList.id
  }
  ...
}


// 2017-12-28 TODO: drag upload.
```
