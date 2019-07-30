import type Source from "../index";
import Task from "../../Entities/Task";
import Contact from "./Contact";
import Company from "./Company";
import Search from "./Search";

const SOURCE = "canadianlawlist";

async function validateURL(url: string): Promise<boolean> {
  try {
    const input = new URL(url);
    const identity = new URL("http://canadianlawlist.com");
    return identity.hostname === input.hostname;
  } catch (error) {
    return false;
  }
}

const CanadianLawList: Source = {
  SOURCE,
  validateURL,
  rootTask: Task(SOURCE, "index"),
  index: Search.index,
  processSearch: Search.process,
  processContact: Contact.process,
  processCompany: Company.process,
};

export default CanadianLawList;
