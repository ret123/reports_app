// Wrapper for HTTP requests with Axios
import axios from 'axios';

function getUser() {
    let user = localStorage.getItem('user');

    if (user) {
        user = JSON.parse(user)
    }
    else {
        user = null;
    }

    return user;
}

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(config => {
 

    let user = getUser();

    const accessToken = localStorage.getItem('token');


   
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
            // originalRequest._retry = true;
            // const refreshToken = JSON.parse(localStorage.getItem('user')).tokens.refresh.token;
            // console.log(refreshToken);
            // if (refreshToken) {
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
            
                try {
                    const response = await axios.post('http://localhost:1338/v1/auth/refresh-tokens', { },{
           
                        withCredentials: true // Ensure credentials are sent (cookies)
                      });
                   

                    localStorage.setItem('token', response.data.tokens.access.token);  //set new user data



                    originalRequest.headers.Authorization = `Bearer ${response.data.tokens.access.token}`;
                    return axios(originalRequest); //recall Api with new token
                } catch (error) {
                    // Handle token refresh failure
                    // mostly logout the user and re-authenticate by login again
                }
             }
        return Promise.reject(error);
    }
);


export default axiosInstance;