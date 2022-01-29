<template>
  <div id="app">
      <loginbar />
      <div id="content" class="content">
          <!-- <router-view></router-view> -->
          <form class="row g-3 justify-content-center">
        <div class="col-auto">
            <label for="univname" class="visually-hidden">univ</label>
            <input type="text" readonly class="form-control-plaintext" id="univname" value="기관명">
        </div>
        <div class="col-auto">
            <label for="inputPassword2" class="visually-hidden">Password</label>
            <input type="password" class="form-control" id="inputPassword2" placeholder="">
        </div>
        <div class="col-auto">
            <button type="submit" class="btn btn-primary mb-3">검색</button>
        </div>
        <div class="col-auto">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    작성완료만 보기
                </label>
            </div>
        </div>
    </form>

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">전체({{cnts[0].all}})</a></li>
            <li class="breadcrumb-item"><a href="#">접수중({{cnts[0].ing}})</a></li>
            <li class="breadcrumb-item"><a href="#">마감({{cnts[0].end}})</a></li>
            <li class="breadcrumb-item active" aria-current="page">대기중({{cnts[0].wait}})</li>
        </ol>
    </nav>

    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">상태</th>
                <th scope="col">기관명</th>
                <th scope="col">공고 제목</th>
                <th scope="col">접수기간</th>
                <th scope="col">등록 아이디</th>
                <th scope="col">작성일</th>
                <th scope="col">작성완료여부</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(post, index) in posts" v-bind:item="post" v-bind:index="index" v-bind:key="post.recruit_idx">
                <th>대기중</th>
                <td>{{post.organ_name}}</td>
                <td>{{post.recruit_title}}</td>
                <td>{{`${post.apply_start_time.getFullYear()}.${post.apply_start_time.getMonth() + 1}.${post.apply_start_time.getDate()} ~ ${post.apply_end_time.getFullYear()}.${post.apply_end_time.getMonth() + 1}.${post.apply_end_time.getDate()}`}}</td>
                <td>{{post.register_id}}</td>
                <td>{{`${post.register_time.getFullYear()}.${post.register_time.getMonth() + 1}.${post.register_time.getDate()}`}}</td>
                <td>{{post.is_complete}}</td>
            </tr>
        </tbody>
    </table>

    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&lt;</span>
                </a>
            </li>
            <li class="page-item"><a class="page-link" @click="movepage(1)">1</a></li>
            <li class="page-item"><a class="page-link" @click="movepage(2)">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&gt;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
      </div>
  </div>
</template>

<script>
import Loginbar from './components/layout/Loginbar.vue'
import PostService from './PostService'

export default {
    name: "App",
    components: {
        Loginbar,
    },
    data() {
        return {
            posts: [],
            cnts: [],
            currentPageIndex: 1,
            error: '',
            text: ''
        }
    },
    method: {
        movePage(param) {
            this.currentPageIndex = param;
            this.posts = PostService.getPosts(this.currentPageIndex);
        }
    },
    async created() {
        try {
            this.posts = await PostService.getPosts(this.currentPageIndex);
            this.cnts = await PostService.getPostCnt();
        } catch (err) {
            this.error = err.message;
        }
    },    
};

</script>

<style>

</style>