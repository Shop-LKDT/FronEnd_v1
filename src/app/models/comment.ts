import { User } from "./user";
export interface Comment{
    id: number;
    created_at: string;
    updated_at: string;
    content: string;
    ratting: number;
    user: User;
    product_id: number;
}