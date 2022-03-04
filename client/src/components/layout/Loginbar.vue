<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <form class="d-flex">
            <div v-if="$store.state.memname === ''" class="navbar-brand">
              로그인을 해주세요.
            </div>
            <div v-else class="navbar-brand">{{ $store.state.memname }}</div>
            <button
              class="btn btn-outline-success"
              v-show="$store.state.memname !== ''"
              type="submit"
              @click="logout"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  name: "Loginbar",
  data() {
    return {};
  },
  methods: {
    logout() {
      VueCookies.remove("accessToken");
      this.$store.state.memname = "";
    },
  },
  async created() {
    axios
      .get("http://localhost:5000/getUser", {
        headers: {
          Authorization: "Bearer " + VueCookies.get("accessToken"),
        },
        userId: this.$store.state.memid,
      })
      .then((res) => {
        if (res.data == "false") {
          VueCookies.remove("accessToken");
          axios
            .get("http://localhost:5000/refresh", {
              headers: {
                Authorization: "Bearer " + VueCookies.get("refreshToken"),
              },
            })
            .then((res) => {
              console.log(res, res.data);
              if (res.data == "false") {
                this.logout();
              } else {
                if (res.data.success === false) {
                  alert(res.data.err);
                } else {
                  this.$store.state.memname = res.data.name;
                  VueCookies.set("accessToken", res.data.accessToken);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$store.state.memname = res.data.name;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style></style>
