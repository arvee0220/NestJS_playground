import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    async Create(price: number) {
        const report = this.repo.create({ price });

        return await this.repo.save(report) ;
    }

    async getAll() {
        const reports = await this.repo.find({
            select: ["id", "price"],
            order: {
                id: "ASC"
            }
        });

        console.log(`Found ${reports.length} reports`);

        return reports;
    }
}
