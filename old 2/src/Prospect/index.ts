import uuidv4 from "uuid/v4";
import moment from "moment";
import {
  IResource,
  ISerializable,
  IPersistable,
  ResourceMeta
  //missing files causing erros
} from "../Resource";
// @ts-ignore
import { IFactories } from "../Factories";
import Collection from "../Collection";
import Edge from "../Edge";
// @ts-ignore
import Person from "../Person";
// @ts-ignore
import Organization from "../Organization";
// @ts-ignore
import Phone from "../Phone";
// @ts-ignore
import Email from "../Email";
// @ts-ignore
import Web from "../Web";
// @ts-ignore
import LinkedIn from "../LinkedIn";
import Place from "../Place";

type Organizations = Array<{
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
}>;
type People = Array<{
  name: string;
  organization: string;
  email: string;
  phone: string;
  linkedin: string;
}>;
type Goldmines = Array<{
  url: string;
  description: string;
}>;
type Notes = Array<string>;
export type SerializedProspectSession = {
  type: string;
  id: string;
  userID: string;
  createdAt: string;
  completedAt: string;
  modifiedAt: string;
  isCompleted: boolean;
  searchListID: string;
  searchListCursor: number;
  organizations: Organizations;
  people: People;
  goldmines: Goldmines;
  notes: Notes;
};
export interface IProspectSession {
  userID: string;
  createdAt: string;
  completedAt: string;
  modifiedAt: string;
  isCompleted: boolean;
  searchListID: string;
  searchListCursor: number;
  people: People;
  organizations: Organizations;
  init(): void;
  completeSearch(
    people: People,
    organizations: Organizations,
    goldmines: Goldmines,
    notes: string
  ): void;
  complete(): void;
}
export default class ProspectSession
  implements
    IResource,
    ISerializable<SerializedProspectSession>,
    IPersistable,
    IProspectSession {
  _id!: string;
  userID!: string;
  createdAt!: string;
  completedAt!: string;
  modifiedAt!: string;
  isCompleted!: boolean;
  searchListID!: string;
  searchListCursor!: number;
  people!: People;
  organizations!: Organizations;
  goldmines!: Goldmines;
  notes!: Notes;
  cache: any;
  constructor(
    from: "serialized" | "cachedID" | "userID",
    input: SerializedProspectSession | string,
    factories: IFactories
  ) {
    this.cache = factories.cache.get(this.id);
    if (from === "serialized") {
      this.deserialize(input);
    } else if (from === "cachedID") {
      this._id = input.id;
      this.init();
    } else if (from === "userID") {
      this.userID = input.userID;
      this._id = uuidv4();
      this.createdAt = moment().toISOString();
      this.modifiedAt = this.createdAt;
      this.isCompleted = false;
      this.searchListCursor = 0;
      this.organizations = [];
      this.people = [];
      this.goldmines = [];
      this.notes = [];
    }
  }
  get meta() {
    return {
      type: this.type,
      id: this.id
    };
  }
  get type() {
    return ProspectSession.type;
  }
  get id() {
    return this._id;
  }
  get serialize(): SerializedProspectSession {
    return {
      type: this.type,
      id: this.id,
      userID: this.userID,
      createdAt: this.createdAt,
      modifiedAt: this.modifiedAt,
      isCompleted: this.isCompleted,
      searchListID: this.searchListID,
      searchListCursor: this.searchListCursor,
      organizations: this.organizations,
      people: this.people,
      goldmines: this.goldmines,
      notes: this.notes,
      completedAt: this.completedAt
    };
  }
  deserialize(input: SerializedProspectSession): void {
    this._id = input.id;
    this.userID = input.userID;
    this.createdAt = input.createdAt;
    this.modifiedAt = input.modifiedAt;
    this.isCompleted = input.isCompleted;
    this.searchListID = input.searchListID;
    this.searchListCursor = input.searchListCursor;
    this.organizations = input.organizations;
    this.people = input.people;
    this.goldmines = input.goldmines;
    this.notes = input.notes;
  }
  async init() {
    const serialized = await this.cache.getData(this.id);
    this.deserialize(serialized);
  }
  completeSearch(
    people: People,
    organizations: Organizations,
    goldmines: Goldmines,
    notes: string
  ): void {
    this.people.push(...people);
    this.organizations.push(...organizations);
    this.goldmines.push(...goldmines);
    this.notes.push(notes);
    this.searchListCursor = this.searchListCursor + 1;
    this.persist();
  }
  async persist() {
    this.modifiedAt = moment().toISOString();
    const serialized = this.serialize();
    this.cache.save(this.id, JSON.stringify(serialized));
  }
  async complete() {
    const collection = new Collection();
    this.organizations.forEach(entry => {
      const organization = new Organization({
        name: entry.name,
        sales: { stage: "prospect" }
      });
      collection.add(organization);
      if (entry.email) {
        const email = new Email(entry.email);
        const edge = new Edge(organization, email);
        collection.add(email, edge);
      }
      if (entry.phone) {
        const phone = new Phone(entry.phone);
        const edge = new Edge(organization, phone);
        collection.add(phone, edge);
      }
      if (entry.website) {
        const website = new Web(entry.website);
        const edge = new Edge(organization, website);
        collection.add(website, edge);
      }
      if (entry.linkedin) {
        const linkedin = new LinkedIn(entry.linkedin);
        const edge = new Edge(organization, linkedin);
        collection.add(linkedin, edge);
      }
      if (entry.place) {
        const place = new Place(entry.address);
        const edge = new Edge(organization, place);
        collection.add(place, edge);
      }
    });
    this.people.forEach(entry => {
      const person = new Person(entry.name);
      collection.add(person);
      if (entry.email) {
        const email = new Email(entry.email);
        const edge = new Edge(person, email);
        collection.add(email, edge);
      }
      if (entry.phone) {
        const phone = new Phone(entry.phone);
        const edge = new Edge(person, phone);
        collection.add(phone, edge);
      }
      if (entry.website) {
        const website = new Web(entry.website);
        const edge = new Edge(person, website);
        collection.add(website, edge);
      }
      if (entry.linkedin) {
        const linkedin = new LinkedIn(entry.linkedin);
        const edge = new Edge(person, linkedin);
        collection.add(linkedin, edge);
      }
      const organization = collection.get(entry.organization);
      const edge = new Edge(person, organization);
      collection.add(edge);
    });
    await collection.commit();
    this.isCompleted = true;
    this.persist();
  }
}
ProspectSession.type = "ProspectSession";
ProspectSession.id = "prospectsession";
