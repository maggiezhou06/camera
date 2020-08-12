<template>
    <div id="login">
        <h2 class="h2 text-center mb-4">Login</h2>
        <h6 id="loginError" style="color:red; margin-left:-48px;"></h6>
        <div class="container">
          <label for="username"><b>Username</b></label>
          <input type="text" placeholder="Enter Username" v-model="input.username" name="username" required>

          <label for="password"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" v-model="input.password" name="password" required>
              
          <button type="button" v-on:click="login()">Login</button>
        </div>
        
        <div class="settings" v-b-modal.modal-create-account>
                      
            <label style="color:#2196F3;"><b>Create an account.</b></label>
            <b-modal
                id="modal-create-account"
                ref="modal"
                title="Create an account"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOk"
              >

                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <p id="errorMsg" style="color:red;"></p>
                    <b-form-group
                    :state="null"
                    label="First name"
                    label-for="firstName-input"
                    invalid-feedback="First name is required"
                  >
                    <b-form-input
                      type="text" 
                      id="firstName-input"
                      v-model="firstName"
                      :state="firstNameState"
                      required
                    ></b-form-input>
                    
                  </b-form-group>
                  <b-form-group
                    :state="null"
                    label="Last name"
                    label-for="lastName-input"
                    invalid-feedback="Last name is required"
                  >
                    <b-form-input
                      type="text" 
                      id="lastName-input"
                      v-model="lastName"
                      :state="lastNameState"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    :state="null"
                    label="Username"
                    label-for="username-input"
                    invalid-feedback="Username is required"
                  >
                    <b-form-input
                      type="text" 
                      id="username-input"
                      v-model="username"
                      :state="usernameState"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    :state="null"
                    label="Password"
                    label-for="password-input"
                    invalid-feedback="Password is required"
                  >
                    <b-form-input 
                      type="password" 
                      id="password-input" 
                      v-model="password" 
                      :state="passwordState" required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    :state="null"
                    label="Confirm password"
                    label-for="confirmPassword-input"
                    invalid-feedback="Must confirm password"
                  >
                    <b-form-input 
                      type="password" 
                      id="confirmPassword-input" 
                      v-model="confirmPassword" 
                      :state="confirmPasswordState" required
                    ></b-form-input>
                  </b-form-group>
                  
                  <b-form-group
                    :state="null"
                    label="Email"
                    label-for="email-input"
                    invalid-feedback="Email is required"
                  >
                    <b-form-input
                      type="email" 
                      id="email-input"
                      v-model="email"
                      :state="emailState"
                      required
                    ></b-form-input>
                  </b-form-group>
                </form>
              </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Login',
    data() {
        return {
            input: {
                username: "",
                password: ""
            }, 
        }
    },
    methods: {
        login() {
              if(this.input.username != "" && this.input.password != "") {
                axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/findUser', {
                    Username: this.input.username,
                    Password: this.input.password
                })
                .then((response) => {
                    var myTokenBefore = JSON.stringify(response.data);
                    var myAccessTokenBefore = myTokenBefore.split(':"')[1];
                    var myAccessToken = myAccessTokenBefore.split('"}')[0];
                    console.log("access token after split: " + myAccessToken);
                    localStorage.setItem('accessToken', myAccessToken);
                    localStorage.setItem('Username', this.input.username);
                    this.$emit("authenticated", true);
                    this.$router.push({ name: 'Camera', params: { Username: this.input.username }});
                    return response;
                }, (error) => {
                    console.log(error);
                    if (error.response.status == 401) {
                       document.getElementById("loginError").innerHTML = "The username/password is incorrect";
                    } else {
                       document.getElementById("loginError").innerHTML = "Server error";
                    }
                });
            } else {
                document.getElementById("loginError").innerHTML = "Must enter a username and password";
            }
        },
        checkFormValidity() {
            if (
                this.firstName &&
                this.firstName.length > 0 &&
                this.lastName &&
                this.lastName.length > 0 &&
                this.username &&
                this.username.length > 0 &&
                this.password &&
                this.password.length > 0 &&
                this.email &&
                this.email.length > 0 &&
                this.confirmPassword == this.password &&
                this.validateEmail(this.email)
            ) {
                document.getElementById("errorMsg").innerHTML = "";
                return true;
            } 
            else if (
                !this.firstName ||
                this.firstName.length <= 0 ||
                !this.lastName ||
                this.lastName.length <= 0 ||
                !this.username ||
                this.username.length <= 0 ||
                !this.password ||
                this.password.length <= 0 ||
                !this.confirmPassword ||
                this.confirmPassword.length <= 0 ||
                !this.email ||
                this.email.length <= 0 
            ) {
                document.getElementById("errorMsg").innerHTML = "Please enter first/last name, username, password, and email to complete the form.";
                return false;
            }
            else if (this.confirmPassword != this.password) {
                document.getElementById("errorMsg").innerHTML = "Password does not match";
                return false;
            }
            else if (!this.validateEmail(this.email)) {
                document.getElementById("errorMsg").innerHTML = "Invalid email address";
                return false;
            }
        },
        validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            this.handleSubmit();
        },
        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return;
            } else {
                axios.post('https://input_public_ip_of_your_ubuntu_webpack_server_here/api/addAccount', {
                        First_Name: this.firstName,
                        Last_Name: this.lastName,
                        Username: this.username,
                        Password: this.password, 
                        Email: this.email
                    })
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                    }, (error) => {
                        console.log(error);
                    });
            }
            // Hide the modal manually
            this.$nextTick(() => {
                this.$refs.modal.hide();
            });
        }
    }
}
</script>

<style scoped>
#login {
    width: 400px;
    border: 1px solid #CCCCCC;
    background-color: #FFFFFF;
    margin: auto;
    margin-top: 140px;
    padding: 20px;
    border-radius: 5px;
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 5px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
}
input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 5px;
}
.container {
  padding: 16px;
}
label {
  display: table-header-group;
  margin-bottom: 0rem;
}
@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  #login {
    width: 300px;
    margin-top: 90px;
  }
}
</style>

