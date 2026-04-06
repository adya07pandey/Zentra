import api from "./axios"

export const signupInit = async(data) => {
    return api.post("/auth/signup/init",data);    
}

export const signupVerify = async(data) => {
    return api.post("/auth/signup/verify",data);    
}

export const login = async(data) => {
    return api.post("/auth/login",data);

}

export const logout = async(data) => {
    return api.post("/auth/logout",data);
}

export const getMyself = async () => {
    return api.get("/auth/me");
}