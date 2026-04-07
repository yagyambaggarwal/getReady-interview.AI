import axios from "axios"


const api = axios.create(
    {
        baseURL : "http://localhost:8000",
        withCredentials : true
    }
)


export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register",
            {
                username, email, password
            }
        )

        return response.data

    } catch (error) {
        console.log(error)
    }

}


export async function login({email, password}){
    try {
        const response = await axios.post("/api/auth/logout", 
            {
                email, password
            }
        )

        return response.data

    } catch (error) {
        console.log(error)
    }
}


export async function logout() {
    try {
        const response = await axios.get("/api/auth/logout")
        
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export async function getMe(){
    try {
        const response = await axios.get("/api/auth/get-me")
    
        return response.data;

    } catch (error) {
        console.log(error)
    }
}