export class UpdateUserDTO {
    fullName: string;    
    address: string;    
    password: string;    
    retype_password: string;    
    date_of_birth: Date;    
    
    constructor(data: any) {
        this.fullName = data.fullName;
        this.address = data.address;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.date_of_birth = data.date_of_birth;        
    }
}