<template>
  <div id="app">
    <div>
      <b-navbar class="nav-bg" toggleable="lg" type="dark">
        <b-navbar-brand href="#">Maggie's Camera App</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item @click="navToCamera" id="cameraTab"><font-awesome-icon icon="camera" style="color:#DDDDDD;"/></b-nav-item>
            <b-nav-item to="/Gallery"><font-awesome-icon icon="image" style="color:#DDDDDD;"/></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <b-container>
      <b-row class="routes">
        <b-col sm="12">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "app",
  created: function() {
  },
  data() {
    return {
      clearsettings: "false",
      expire: 3600000,
      authenticated: false, 
      Username: "",
    };
  },
  computed: {
  },
  mounted() {
    if(!this.authenticated) {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      this.authenticated = false;
    }, 
    navToCamera() {
      this.Username = localStorage.getItem('Username');
      this.$router.push({ name: 'Camera', params: { Username: this.Username }});
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

#app {
  font-family: "Roboto", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
a.settings {
  color: black;
}
.settings i {
  font-size: 1rem;
}
input {
  text-transform: lowercase;
}
.routes {
  margin: 10px 0;
}
.nav-bg {
  background-color: #000;
}
.router-link-exact-active {
  color: white !important;
  font-weight: bold;
}
.nav-link {
  color: white !important;
}
.nav-link.disabled {
  color: rgba(255, 255, 255, 0.75) !important;
}
</style>
