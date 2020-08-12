<template>
  <div id="myGallery">
    <h1>Gallery</h1>
      <head>
        <link rel="stylesheet" type="text/css" href="styleGallery.css"> 
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      </head>
      <body id = "body">
        <div class="buttons">
          <button type="button" class="button" v-on:click="deleteFiles()"><i class="fa fa-trash"></i> Trash</button>
        </div>
          <ul id="myUl">
          </ul>
      </body>
  </div>
</template>

<script>
import axios from "axios";
import './styleGallery.css';

export default {
  data() {
    return {
      currUsername: "",
      numOfFiles: 0,
      tempToken: ""
    };
  },
  methods: {
    deleteFiles: function() {
      var myFilesForDeletion = [];
      for (var i = 0; i < this.numOfFiles; i++) {
          if (document.getElementById("checkbox" + i) != null){
            if (document.getElementById("checkbox" + i).checked) {
                var src1 = document.getElementById("img" + i).src.split('7/')[1];
                var src2 = src1.split('?')[0];
                console.log("file to be deleted: " + src2);
                myFilesForDeletion.push(src2);
                document.getElementById("img" + i).style.display='none';
                document.getElementById("img" + i).remove();
                document.getElementById("checkbox" + i).remove();
            }
          }
      }
      axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/deleteFiles', {
          Username: this.currUsername, 
          filesForDeletion: myFilesForDeletion
      })
      .then((response) => {
          console.log(response.status);
          console.log(response.data);
      }, (error) => {
          console.log(error.response.status);
          console.log(error);
      });
      window.onunload = () => {
        // Clear the local storage
        window.localStorage.clear()
      }
    }, 
    displayImages: function() {
      const myToken = localStorage.getItem('accessToken');
      console.log("token for gallery: " + myToken);
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + myToken
        }
      };
      var data = {
        Username: this.currUsername
      };
      axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/getFiles', data, axiosConfig)
      .then((response) => {
          for (var i = 0; i < response.data.myFiles.length; i++) {
            console.log(JSON.stringify(response.data.myFiles[i]));
          }
          
          this.numOfFiles = response.data.myFiles.length
          for (var i = 0; i < this.numOfFiles; i++) {
              var myLi = document.createElement("LI");
              myLi.id = "li" + i;
              document.getElementById("myUl").appendChild(myLi);  

              var box = document.createElement("INPUT");
              box.setAttribute("type", "checkbox");
              box.id = "checkbox" + i;
              document.getElementById("li" + i).appendChild(box);  
              document.getElementById(box.id).style.display = "none";

              var myLabel = document.createElement("LABEL");       
              myLabel.htmlFor = box.id;
              myLabel.id = "label" + i;
              document.getElementById("li" + i).appendChild(myLabel); 

              var img = document.createElement("IMG");
              console.log("add tempToken: " + this.tempToken);
              var urlBefore = "https://input_public_ip_of_your_ubuntu_webpack_server_here/uploads" + response.data.myFiles[i] + "?token=" + this.tempToken + "&count=" + (i+1) + "&total=" + this.numOfFiles;
              var url = new URL(urlBefore);
              console.log(url);
              img.src =  url;
              img.id = "img" + i;
              document.getElementById("label" + i).appendChild(img);
          }   
      }, (error) => {
          //redirect user to login page if they do not have the access token
          //this.$router.push({ name: 'Login'});
          //seems to redirect to login automatically
          console.log(error.response.status + ": Cannot display images without access token");
      });
    },
  },
  mounted() {
    const axios = require('axios');
    this.currUsername = localStorage.getItem('Username');
    axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/getNonce', {
      Username: this.currUsername
    })
    .then((response) => {
        this.tempToken = (response.data);
        console.log("this.tempToken: " + this.tempToken);
    }, (error) => {
        console.log(error.response.status + ": Failed to get nonce");
    });  
    this.displayImages();
  },
};
</script>
