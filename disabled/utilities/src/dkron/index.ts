import { JobsApi, Job } from "./api";
import { Config } from "@huckleberry/config";

export { Job as DkronJob } from "./api";

export class Dkron {
  private jobsAPI: JobsApi;
  // private defaultAPI: DefaultApi;
  // private membersAPI: MembersApi;
  // private executionsAPI: ExecutionsApi;
  constructor(config: Config) {
    this.jobsAPI = new JobsApi(config.dkron.baseUrl);
    // this.defaultAPI = new DefaultApi(config.dkron.baseUrl);
    // this.membersAPI = new MembersApi(config.dkron.baseUrl);
    // this.executionsAPI = new ExecutionsApi(config.dkron.baseUrl);
  }
  async createOrUpdateJob(job: Job): Promise<Job> {
    const result = await this.jobsAPI.createOrUpdateJob(job);
    return result.body;
  }
  async deleteJob(jobName: string): Promise<Job> {
    const result = await this.jobsAPI.deleteJob(jobName);
    return result.body;
  }
  async getJobs(tags: string[] | undefined): Promise<Job[]> {
    const result = await this.jobsAPI.getJobs(tags);
    return result.body;
  }
  async runJob(jobName: string): Promise<Job> {
    const result = await this.jobsAPI.runJob(jobName);
    return result.body;
  }
  async showJobByName(jobName: string): Promise<Job> {
    const result = await this.jobsAPI.showJobByName(jobName);
    return result.body;
  }
  async toggleJob(jobName: string): Promise<Job> {
    const result = await this.jobsAPI.toggleJob(jobName);
    return result.body;
  }
}
