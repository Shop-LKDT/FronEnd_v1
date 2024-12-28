import { User } from "./user";

export interface Report {
  id: number;                
  userId: number;       
  reportContent: String;        
  responseFromManagement: string;   
  status: string;   
  created_at: String; 
  updated_at?: string;       
}
