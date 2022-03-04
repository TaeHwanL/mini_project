<template>
  <div id="app">
    <router-view></router-view>
    <div class="mb-3">
      <label for="memid" class="form-label">아이디</label>
      <input
        type="email"
        class="form-control"
        id="memid"
        v-model="memid"
        placeholder="아이디"
      />
    </div>
    <div class="mb-3">
      <label for="mempw" class="form-label">비밀번호</label>
      <input
        type="password"
        class="form-control"
        id="mempw"
        v-model="mempw"
        placeholder="비밀번호"
      />
    </div>
    <div class="mb-3">
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="savechk"
          v-model="savechk"
        />
        <label class="form-check-label" for="dropdownCheck">
          아이디 저장
        </label>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" @click="test">로그인</button>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  name: "app",
  data() {
    return {
      memid: null,
      mempw: null,
      savechk: false,
    };
  },
  methods: {
    test() {
      this.memid === "" ||
      this.memid === null ||
      this.mempw === "" ||
      this.mempw === null
        ? alert("아이디 또는 비밀번호를 입력하세요.")
        : axios
            .post("http://localhost:5000/login", {
              userId: this.memid,
              password: this.mempw,
            })
            .then((res) => {
              if (res.data.success === false) {
                alert(res.data.err);
              } else {
                VueCookies.set("accessToken", res.data.accessToken);
                VueCookies.set("refreshToken", res.data.refreshToken);
                this.$store.state.memname = this.memid;
                if (this.savechk === true) {
                  VueCookies.set("savechk", this.memid);
                } else {
                  if (VueCookies.get("savechk") !== null) {
                    VueCookies.remove("savechk");
                  }
                }

                this.$router.push("/list");
              }
            })
            .catch((err) => {
              console.log(err);
            });
    },
  },
  async created() {
    if (VueCookies.get("savechk") !== null) {
      this.savechk = true;
      this.memid = VueCookies.get("savechk");
    }
  },
};
</script>

<style></style>
