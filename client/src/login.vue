<template>
<div id="app">
  <!-- <router-link to="App">dd</router-link> -->
  <!-- <router-view></router-view> -->
    <div class="mb-3">
      <label for="memid" class="form-label">아이디</label>
      <input type="email" class="form-control" id="memid" v-model="memid" placeholder="아이디">
    </div>
    <div class="mb-3">
      <label for="mempw" class="form-label">비밀번호</label>
      <input type="password" class="form-control" id="mempw" v-model="mempw" placeholder="비밀번호">
    </div>
    <div class="mb-3">
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="dropdownCheck">
        <label class="form-check-label" for="dropdownCheck">
          아이디 저장
        </label>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" @click="test">로그인</button>
</div>
</template>

<script>
// import { mapState, mapActions } from "vuex"
import axios from 'axios';

export default {
    name: "app",
    data() {
      return {
        memid: null,
        mempw: null
      }
    },
    // computed: {
    //   ...mapState(["isLogin", "isLoginError"])
    // },
    methods: {
      // ...mapActions(["login"])
      test() {
        axios
          .post("http://localhost:5000/login", {
            userId: this.memid, 
            password: this.mempw,
          })
          .then(res => {
            if (Object.keys(res.data).length) {
              console.log(res.data)
            } else {
              alert("아이디 또는 비밀번호를 확인하세요.")
            }
          })
          .catch(err => {
            console.log(err)
          })
          .then(() => {

          })
      }
    }
}
</script>

<style>

</style>