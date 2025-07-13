import { Body, Controller, Get, Post } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";

@Controller("reports")
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post("/generate_report")
    async createReport(@Body() body: CreateReportDto) {
        return await this.reportsService.Create(body.price);
    }

    @Get()
    async getAllReports() {
        return await this.reportsService.getAll();
    }

    @Get()
    async findReports() {
        
    }
}
