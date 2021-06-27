import axios from 'axios';

/**
* @author
* @function 
**/

const instance = axios.create({
    baseURL:"http://localhost:9000/",
})

export default instance;