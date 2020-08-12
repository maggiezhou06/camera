<template>
  <div class="camera">
    <!-- <p>Camera State:{{cameraState}}</p> -->
    <head> 
      <link rel="stylesheet" type="text/css" href="styleCamera.css">
    </head>
    <body>
      <div class="buttons">
        <b-button class="button" @click="upload">Upload </b-button>
      </div>
    </body>
    <b-row>
      <b-col sm="12">
        <div>
          <video class="screen" v-show="cameraState" playsinline autoplay></video>
          <canvas class="screen" v-show="!cameraState"></canvas>
        </div>
        <div class="actions">
          <b-button-group>
            <b-button v-if="!cameraState" :disabled="isStartEnabled" v-on:click="start">Camera</b-button>
            <b-button v-if="cameraState" :disabled="isStartEnabled" v-on:click="stop">Stop</b-button>
            <b-button v-if="cameraState" :disabled="isStartEnabled" v-on:click="snapshot">Snapshot</b-button>
          </b-button-group>
        </div>
      </b-col>
    </b-row>

    <b-col sm="12">
      <form class>
        <b-form-select
          v-model="selectedDevice"
          :options="options"
          v-on:change="deviceChange()"
          size="sm"
        ></b-form-select>
      </form>
    </b-col>

    <ul id="myUl">
    </ul>
  </div>
</template> 

<script>
import axios from "axios";
import './styleCamera.css';
import { mapState } from "vuex";
import router from '../router'

export default {
  name: "Camera",
  data() {
    return {
      video: null,
      canvas: null,
      fileData: null,
      isStartEnabled: true,
      isPhoto: false,
      stream: null,
      currentStream: null,
      devices: [],
      options: [],
      constraints: {},
      selectedDevice: null,
      cameraState: true, 
      Username: "", 
      file: '', 
      currentFile: undefined, 
      firstName: "",
      lastName: "", 
      numOfSnapshots: 0, 
      myFilesForUpload: [], 
      listOfFiles: []
    }
  },
  created: function () {
      this.Username = this.$route.params.Username;
      axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/getFirstName', {
          Username: this.Username
      })
      .then((response) => {
          var firstNameBefore = JSON.stringify(response.data).split(':"')[1];
          var firstNameAfter = firstNameBefore.split('"}')[0];
          this.firstName = firstNameAfter;
      }, (error) => {
      });

      axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/getLastName', {
          Username: this.Username
      })
      .then((response) => {
          var lastNameBefore = JSON.stringify(response.data).split(':"')[1];
          var lastNameAfter = lastNameBefore.split('"}')[0];
          this.lastName = lastNameAfter;
      }, (error) => {
      });
  },
  computed: mapState(["settings"]),
  methods: {
    upload: function() {
      const axios = require('axios');
      const myToken = localStorage.getItem('accessToken');
      console.log("in camera: " + myToken);

      for (var i = 0; i <= this.numOfSnapshots; i++) {
          if (document.getElementById("checkbox" + i) != null){
            if (document.getElementById("checkbox" + i).checked) {
                var myFile = this.listOfFiles[i];
                this.myFilesForUpload.push(myFile);
                document.getElementById("img" + i).style.display='none';
                document.getElementById("img" + i).remove();
                document.getElementById("checkbox" + i).remove();
            }
          }
      }

      let formData = new FormData();
      for(var i = 0; i < this.myFilesForUpload.length; i++) {
        console.log("entered append file");
        let file =  this.myFilesForUpload[i];
        console.log("file uploaded: " + file);
        formData.append("file", file, "image" + i);
      }
      console.log("Username: " + this.Username);
      console.log("First name: " + this.firstName);
      console.log("Last name: " + this.lastName);

      formData.append("Username", this.Username);
      formData.append("firstName", this.firstName);
      formData.append("lastName", this.lastName);
      
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + myToken,
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*"
        }
      };
      axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/uploadImages', formData, axiosConfig)
      .then((response) => {
          console.log(response.data);
      }, (error) => {
          console.log(error);
      });
    },
    snapshot: function() {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      this.fileData = this.canvas.toDataURL("image/jpeg");
      this.isPhoto = true;
      //remove any hidden links used for download
      let hiddenLinks = document.querySelectorAll(".hidden_links");
      for (let hiddenLink of hiddenLinks) {
        document.querySelector("body").remove(hiddenLink);
      }
      if (this.fileData) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas
          .getContext("2d")
          .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        let a = document.createElement("a");
        a.classList.add("hidden-link");
        a.href = this.fileData;
        a.textContent = "";
        a.target = "_blank";
        a.download = "photo.jpeg";
        document.querySelector("body").append(a);
        a.click();
        this.listOfFiles.push(this.dataURLtoBlob(this.fileData));
      }

      var myLi = document.createElement("LI");
      myLi.id = "li" + this.numOfSnapshots;
      document.getElementById("myUl").appendChild(myLi);  

      var box = document.createElement("INPUT");
      box.setAttribute("type", "checkbox");
      box.id = "checkbox" + this.numOfSnapshots;
      document.getElementById("li" + this.numOfSnapshots).appendChild(box);  
      document.getElementById(box.id).style.display = "none";

      var myLabel = document.createElement("LABEL");       
      myLabel.htmlFor = box.id;
      myLabel.id = "label" + this.numOfSnapshots;
      document.getElementById("li" + this.numOfSnapshots).appendChild(myLabel); 
      
      var img = document.createElement("IMG");
      img.src =  this.canvas.toDataURL("image/jpeg");
      img.id = "img" + this.numOfSnapshots;
      document.getElementById("label" + this.numOfSnapshots).appendChild(img);
      this.numOfSnapshots++;

    },
    dataURLtoBlob: function(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: "image/jpeg"});
    },
    stop: function() {
      this.video.pause();
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => {
          track.stop();
        });
        this.video.srcObject = null;
      }
      this.video.removeAttribute("src");
      this.video.load();
      this.canvas
        .getContext("2d")
        .clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.isPhoto = false;
      this.cameraState = false;
    },
    start: function() {
      //this.stop();
      //when starting up again use first option
      this.selectedDevice = this.options[0].value;
      this.getMedia().then(result => {
        this.isStartEnabled = false;
        this.cameraState = true;
        // eslint-disable-next-line no-console
        console.log("start camera:", result);
      });
    },
    download: function() {
      if (this.fileData) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas
          .getContext("2d")
          .drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        let a = document.createElement("a");
        a.classList.add("hidden-link");
        a.href = this.fileData;
        a.textContent = "";
        a.target = "_blank";
        a.download = "photo.jpeg";
        document.querySelector("body").append(a);
        a.click();
      }
    },
    getMedia: async function() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(
          this.constraints
        );
        window.stream = this.stream;
        this.currentStream = window.stream;
        this.video.srcObject = window.stream;
        return true;
      } catch (err) {
        throw err;
      }
    },
    deviceChange: function() {
      this.stop();
      //don't change selected device
      this.setConstraints();
      this.getMedia().then(result => {
        this.isStartEnabled = false;
        this.cameraState = true;
        // eslint-disable-next-line no-console
        console.log("device change:", result);
      });
    },
    setConstraints: function() {
      const videoContstraints = {};
      if (this.selectedDevice === null) {
        videoContstraints.facingMode = "user";
      } else {
        videoContstraints.deviceId = {
          exact: this.selectedDevice
        };
      }
      this.constraints = {
        video: videoContstraints,
        audio: false
      };
    },
    getDevices: async function() {
      console.log("entered getDevices");
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
      }
      try {
        console.log("entered try of getDevices");
        let allDevices = await navigator.mediaDevices.enumerateDevices();
        for (let mediaDevice of allDevices) {
          if (mediaDevice.kind === "videoinput") {
            let option = {};
            option.text = mediaDevice.label;
            option.value = mediaDevice.deviceId;
            this.options.push(option);
            this.devices.push(mediaDevice);
          }
        }
        return true;
      } catch (err) {
        throw err;
      }
    }
  },
  mounted() {
    console.log("entered mounted");
    this.canvas = document.querySelector("canvas");
    this.video = document.querySelector("video");
    this.getDevices()
      .then(res => {
        //when first loaded selected device can use 1st option
        this.selectedDevice = this.options[0].value;
        console.log("this.options[0].value: " + this.options[0].value);
        this.setConstraints();
        // eslint-disable-next-line no-console
        console.log("get devices:", res);
      })
      .then(() => {
        this.getMedia().then(res => {
          this.isStartEnabled = false;
          // eslint-disable-next-line no-console
          console.log("get media", res);
        });
      });
      window.onunload = () => {
        // Clear the local storage
        window.localStorage.clear()
      }
  }
};
</script>

<style scoped>
.custom-select-sm {
  height: calc(1.5em + 0.5rem + 2px);
  width: calc(37em);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.875rem;
}
@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .custom-select-sm {
    width: calc(19em);
  }
}
</style>
