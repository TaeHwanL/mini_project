import axios from 'axios';

class PostService {
    static getPosts(currentPageIndex) {
        return new Promise((resolve, reject) => {
            try {
                let data = '';
                axios.get('http://localhost:5000/search/' + currentPageIndex).then(function(response) {
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

    // static getPosts() {
    //     let data = '';
    //     try {
    //         let result;

    //         axios.get(url).then(function(response) {
    //             data = response.data;
    //             console.log(data + '11')
    //             result = data.map(post => ({
    //                 ...post,
    //                 apply_start_time: new Date(post.apply_start_time),
    //                 apply_end_time: new Date(post.apply_end_time),
    //                 register_time: new Date(post.register_time),
    //                 is_complete: post.is_complete === true ? "O" : ""
    //             }))

    //             return result;
    //         });           
    //         console.log(result + '1')
    //         return result;
    //     } catch (err) {
    //         return err
    //     }
    // }
    
    static getPostCnt() {        
        return new Promise((resolve, reject) => {
            try {
                let data = '';
                axios.get('http://localhost:5000/searchcnt').then(function(response) {
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