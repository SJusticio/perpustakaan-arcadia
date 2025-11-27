export interface ApiResponse{
    message: string;
    data?: any;
} 

export interface RegisterPayload{
    name: string;
    username:string;
    password: string;
}

export interface LoginPayload{
    username: string;
    password: string;
}