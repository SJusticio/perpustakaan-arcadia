export interface ApiResponse{
    userId?: any;
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

export interface BookPayload{
   role: string | null; 
}  

export interface LoanPayload{
    token: string | null;
}
