import { School } from "@huckleberry/models";

export class SchoolService {
  async getAll(): Promise<School[]> {
    const response = await fetch("/api/schools");
    const schools: School[] = await response.json();
    return schools;
  }
  async getById(id: string): Promise<School> {
    const response = await fetch(`/api/schools/${id}`);
    const school: School = await response.json();
    return school;
  }
}
