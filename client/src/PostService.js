import axios from 'axios';

class PostService {
    static getPosts(state, currentPageIndex, complete, searchtxt) {
        return new Promise((resolve, reject) => {
            try {
                let data = '';
                axios.get('http://localhost:5000/search?state=' + state + '&page=' + currentPageIndex + '&complete=' + complete + '&searchtxt=' + searchtxt).then(function(response) {
                    data = response.data;
                    
                    resolve(
                        data.map(post => ({
                            ...post,
                            apply_start_time: new Date(post.apply_start_time),
                            apply_end_time: new Date(post.apply_end_time),
                            register_time: new Date(post.register_time),
                            is_complete: post.is_complete === true ? "O" : ""
                        }))
                    );
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static gettotal(state, complete, searchtxt) {
        return new Promise((resolve, reject) => {
            try {
                let data = '';
                axios.get('http://localhost:5000/total?state=' + state + '&complete=' + complete + '&searchtxt=' + searchtxt).then(function(response) {
                    data = response.data;
                    
                    resolve(
                        data.map(post => ({
                            ...post
                        }))
                    );
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    
    static getPostCnt(complete, searchtxt) {        
        return new Promise((resolve, reject) => {
            try {
                let data = '';
                axios.get('http://localhost:5000/searchcnt?complete=' + complete + '&searchtxt=' + searchtxt).then(function(response) {
                    data = response.data;
                    
                    resolve(
                        data.map(post => ({
                            ...post,
                        }))
                    );
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default PostService;