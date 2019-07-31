//@ts-ignore
import { IResource, ResourcMeta } from "../Resource";
//@ts-ignore
import { IFactories } from "../Factories";
import { IRetriever } from "../Retriever";
import Collection from "../Collection";
import Edge from "../Edge";
//@ts-ignore
import Observation from "../Observation";
//@ts-ignore
import Organization from "../Organization";
import Place from "../Place";
//@ts-ignore
import Phone from "../Phone";
//@ts-ignore
import Person from "../Person";
//@ts-ignore
import Web from "../Web";
/* 
- Awards http://lawsocietypei.ca/honours-awards
- Extract Law Society info from site - Org, Place, Email, Phone
*/

type lawyer = {
  first: string;
  last: string;
  queensCounsel: boolean;
  phone: string;
  website: string;
  firm: string;
  address: string;
  locality: string;
  region: string;
  country: string;
  postalCode: string;
};
type SerializedLawSocietyPEI = {
  type: string;
  id: string;
  lawyers: Array<lawyer>;
};
export default class LawSocietyPEI implements IResource {
  factories: IFactories;
  retriever: IRetriever;
  lawyers!: Array<lawyer>;
  constructor(factories: IFactories) {
    this.factories = factories;
    this.retriever = factories.retriever.get(this.NAME);
  }
  get meta(): ResourceMeta {
    return {
      type: this.type,
      id: this.id,
      methods: LawSocietyPEI.methods
    };
  }
  get type(): string {
    return LawSocietyPEI.type;
  }
  get id(): string {
    return LawSocietyPEI.id;
  }
  static async extract() {
    const $ = await this.retriever.getStaticDOM(this.URL);
    this.data = $(".lawyer")
      .map((i: any, li: any) => {
        let region, country;
        const regionCountryData = $(".address", li)
          .contents()
          .get(5).data;
        if (regionCountryData && typeof regionCountryData === "string") {
          const regionCountryString = regionCountryData.split(",");
          if (regionCountryString.length === 2) {
            region = regionCountryString[0];
            country = regionCountryString[1];
          }
        }
        const lawyer = {
          firstName: $(".first-name", li).text(),
          lastName: $(".last-name", li)
            .text()
            .replace(", Q.C.", ""),
          queensCounsel: $(".last-name", li)
            .text()
            .contains(", Q.C."),
          phone: $(".phone", li).text(),
          website: $("a", li).attr("href"),
          firm: $(".law-firm", li).text(),
          address: $(".address", li)
            .contents()
            .first()
            .text(),
          locality: $(".city", li).text(),
          region,
          country,
          postalCode: $(".address", li)
            .contents()
            .last()
            .text()
        };
        return lawyer;
      })
      .get();
  }

  async process() {
    // Meta
    const lawSocietyWebsite = new Web(meta.websiteURL);
    const lawSocietyWebpage = new Web(meta.webpageURL);
    const lawSocietyWebsiteWebpage = new Edge(
      lawSocietyWebsite,
      lawSocietyWebpage
    );
    const lawSocietyOrganization = new Organization(meta.organization);
    const lawSocietyOrganizationWebsite = new Edge(
      lawSocietyOrganization,
      lawSocietyWebsite
    );

    // Collection
    const observation = new Observation(
      meta.name,
      meta.methods.process,
      lawSocietyWebpage
    );

    const collection = new Collection(this.factories, observation);
    collection.add(
      lawSocietyWebsite,
      lawSocietyWebpage,
      lawSocietyWebsiteWebpage,
      lawSocietyOrganization,
      lawSocietyOrganizationWebsite
    );

    const data = await this.extract();
    data.forEach((lawyer: any) => {
      // Person
      const person = new Person({
        name: {
          first: lawyer.firstName,
          last: lawyer.lastName
        }
      });
      collection.add(person);

      const personLawSociety = new Edge(person, lawSocietyOrganization, {
        predicate: "memberOf",
        title: "lawyer"
      });
      collection.add(personLawSociety);

      if (data.queensCounsel) {
        const personAwardLawSociety = new Edge(person, lawSocietyOrganization, {
          predicate: "awardedBy",
          title: "Queens Counsel"
        });
        collection.add(personAwardLawSociety);
      }

      // Organization
      const organization = new Organization({
        name: lawyer.firm
      });
      const personOrganization = new Edge(person, organization, {
        predicate: "employeeOf",
        title: "lawyer"
      });
      collection.add(organization, personOrganization);

      // Place
      const place = new Place({
        address: lawyer.address,
        locality: lawyer.locality,
        region: lawyer.region,
        country: lawyer.country,
        postalCode: lawyer.postalCode
      });
      const organizationPlace = new Edge(organization, place);
      collection.add(place, organizationPlace);

      if (lawyer.website) {
        const website = new Web({
          url: lawyer.website
        });
        const organizationWebsite = new Edge(organization, website);
        collection.add(website, organizationWebsite);
      }

      // Phone
      if (lawyer.phone) {
        const phone = new Phone({
          number: lawyer.phone,
          place: place
        });
        const personPhone = new Edge(person, phone);
        collection.add(phone, personPhone);
      }
    });

    collection.commit();
  }
}
LawSocietyPEI.type = "LawSocietyPEI";
LawSocietyPEI.id = "lawsocietypei";
LawSocietyPEI.methods = {
  extract: {
    name: "extract",
    version: 1.0
  },
  process: {
    name: "process",
    version: 1.0
  }
};
