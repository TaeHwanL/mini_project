<template>
<div id="app">
  <!-- <router-link to="App">dd</router-link> -->
  <!-- <router-view></router-view> -->
    <div class="mb-3">
      <label for="memid" class="form-label">아이디</label>
      <input type="email" class="form-control" id="memid" placeholder="아이디">
    </div>
    <div class="mb-3">
      <label for="mempw" class="form-label">비밀번호</label>
      <input type="password" class="form-control" id="mempw" placeholder="비밀번호">
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
        id: null,
        password: null
      }
    },
    // computed: {
    //   ...mapState(["isLogin", "isLoginError"])
    // },
    methods: {
      // ...mapActions(["login"])
      test() {
        axios
          .get("https://reqres.in/api/users?page=2")
          .then(res => {
            console.log(res)
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