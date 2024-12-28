export class ReportDto {
    userId: number;
    status: string;
    responseFromManagement: string;

    constructor(userId: number, status: string, responseFromManagement: string) {
        this.userId = userId;
        this.status = status;
        this.responseFromManagement = responseFromManagement;
    }
}