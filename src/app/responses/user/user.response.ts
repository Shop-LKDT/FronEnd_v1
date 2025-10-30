import { Role } from "../../models/role";
export interface UserResponse {
    id: number;
    fullName: string;
    phoneNumber: string;
    address:string;
    active: boolean;
    dateOfBirth: Date;
    facebookAccountId: number;
    googleAccountId: number;
    role: Role;    
    email: string;
}

