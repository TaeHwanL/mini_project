<template>
  <div>
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
</template>

<script>
import PostService from '../../PostService'

export default {
    name: "List",
    data() {
        return {
            posts: [],
            cnts: [],
            currentPageIndex: 1,
            error: '',
            text: ''
        }
    },
    methods: {
        movepage: async function(param) {
            this.currentPageIndex = param;
            try {
                this.posts = await PostService.getPosts(this.currentPageIndex);
            } catch (err) {
                this.error = err.message;
            }
        }
    },
    // async created() {
    //     try {
    //         this.posts = await PostService.getPosts(this.currentPageIndex);
    //     } catch (err) {
    //         this.error = err.message;
    //     }
    // },    
    created() {
        this.movepage(this.currentPageIndex);
    },
}
</script>

<style>

</style>