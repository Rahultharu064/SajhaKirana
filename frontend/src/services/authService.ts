import api from "./api";

export const login =(identifier: string, password: string) =>{
    return api.post('/auth/login', {identifier, password});
}
export const register =(data:{name: string, email:string , password:string, phone?:string}) =>{
    return api.post('/auth/register',data);
}


export const getCurrentUser =() => {
    const token = localStorage.getItem('token');
    console.log('getCurrentUser: Token from localStorage:', token);
    return api.get('/auth/me');
}

export const getProfile =() =>{
    return api.get('/auth/profile');
}

export const updateProfile = (data: { name?: string; phone?: string; address?: string }, profileImage?: File) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (profileImage) formData.append('profileImage', profileImage);
    return api.put('/auth/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
}

export const logout =() =>{
    return api.post('/auth/logout');
}

export const forgetPassword =(email: string) =>{
    return api.post('/auth/forget-password', { email });
}

export const resetPassword =(token: string, newPassword: string) =>{
    return api.post('/auth/reset-password', { token, newPassword });
}

export const verifyEmail =(token: string) =>{
    return api.post('/auth/verify-email', { token });
}

export const sendVerificationEmail =() =>{
    return api.post('/auth/send-verification');
}
