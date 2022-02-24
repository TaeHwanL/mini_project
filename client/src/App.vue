<template>
  <div id="app">
      <!-- <router-view></router-view> -->
      <loginbar />
      <div id="content" class="content">
          <form class="row g-3 justify-content-center">
        <div class="col-auto">
            <label for="univ" class="visually-hidden">univ</label>
            <input type="text" readonly class="form-control-plaintext" id="univ" value="기관명">
        </div>
        <div class="col-auto">
            <label for="univname" class="visually-hidden">univname</label>
            <input type="text" class="form-control" id="univname" v-model="searchtxt" placeholder="">
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-primary mb-3" @click="movepage(1)">검색</button>
        </div>
        <div class="col-auto">
            <input type="checkbox" v-model="complete" v-on:click="completechk"> 작성완료만 보기
        </div>
    </form>

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="javascript:void(0)" @click="fillter('all')">전체({{cnts[0] === undefined ? 0 : cnts[0].all}})</a></li>
            <li class="breadcrumb-item"><a href="javascript:void(0)" @click="fillter('ing')">접수중({{cnts[0] === undefined ? 0 : cnts[0].ing}})</a></li>
            <li class="breadcrumb-item"><a href="javascript:void(0)" @click="fillter('end')">마감({{cnts[0] === undefined ? 0 : cnts[0].end}})</a></li>
            <li class="breadcrumb-item"><a href="javascript:void(0)" @click="fillter('wait')">대기중({{cnts[0] === undefined ? 0 : cnts[0].wait}})</a></li>
        </ol>
    </nav>

    <table class="table table-hover">
        <colgroup>
            <col width="5%"><col width="10%"><col width="47%">
            <col width="14%"><col width="8%"><col width="7%"><col width="9%">
        </colgroup>
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
            <tr v-for="(post, index) in posts" :item="post" :index="index" :key="post.recruit_idx">
                <th>{{post.state}}</th>
                <td>{{post.organ_name}}</td>
                <td>{{post.recruit_title}}</td>
                <td>{{`${post.apply_start_time.getFullYear()}.${post.apply_start_time.getMonth() + 1}.${post.apply_start_time.getDate()} ~ ${post.apply_end_time.getFullYear()}.${post.apply_end_time.getMonth() + 1}.${post.apply_end_time.getDate()}`}}</td>
                <td>{{post.register_id}}</td>
                <td>{{`${post.register_time.getFullYear()}.${post.register_time.getMonth() + 1}.${post.register_time.getDate()}`}}</td>
                <td>{{post.is_complete}}</td>
            </tr>
            <tr v-if="(totals[0] != undefined ? totals[0].count : 0) == 0">
                <td colspan="7">공고가 없습니다.</td>
            </tr>
        </tbody>
    </table>

    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Previous" @click="movepage(1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Previous" @click="currentPageIndex === 1 ? 'javascript:void(0)' : movepage(currentPageIndex - 1)">
                    <span aria-hidden="true">&lt;</span>
                </a>
            </li>
            <li class="page-item " v-for="totals in (Math.ceil((totals[0] != undefined ? totals[0].count : 0)/10))" :key="totals" :class="{ active: currentPageIndex === totals }"><a class="page-link" @click="movepage(totals)">{{ totals }}</a></li>
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="Math.ceil(totals[0].count/10) === currentPageIndex ? 'javascript:void(0)' : movepage(currentPageIndex + 1)">
                    <span aria-hidden="true">&gt;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="movepage(Math.ceil(totals[0].count/10))">
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
            totals: [],
            cnts: [],
            state: 'all',
            currentPageIndex: 1,
            searchtxt: '',
            complete: false,
            error: '',
            text: '',
            isActive: true
        }
    },
    methods: {
        movepage: async function(param) {
            this.currentPageIndex = param;

            try {
                this.posts = await PostService.getPosts(this.state, this.currentPageIndex, this.complete, this.searchtxt);
                this.totals = await PostService.gettotal(this.state, this.complete, this.searchtxt);
            } catch (err) {
                this.error = err.message;
            }
        },

        fillter: function(state) {
            this.state = state;

            this.movepage(1);
        },

        completechk: function() {
            this.complete = !this.complete;
            this.movepage(1);
        }
    },
    async created() {
        this.movepage(this.currentPageIndex);
        this.cnts = await PostService.getPostCnt();
    },    
};

</script>

<style>

</style>