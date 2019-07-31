import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { Config } from "../config";
import { WebController } from "../domain/web/controller";
import {
  Dkron,
  IMAP,
  Logger,
  Mongo,
  Server,
  SMTP,
  EventBus,
} from "../utilities";

const config = new ContainerModule(bind => {
  bind<Config>(Config).toSelf();
});

// Domain
const domain = new ContainerModule(bind => {
  bind<WebController>(WebController).toSelf();
});

// Utilities
const utilities = new ContainerModule(bind => {
  bind<Dkron>(Dkron)
    .toSelf()
    .inSingletonScope();
  bind<IMAP>(IMAP)
    .toSelf()
    .inSingletonScope();
  bind<EventBus>(EventBus)
    .toSelf()
    .inSingletonScope();
  bind<Logger>(Logger)
    .toSelf()
    .inSingletonScope();
  bind<Mongo>(Mongo)
    .toSelf()
    .inSingletonScope();
  bind<Server>(Server)
    .toSelf()
    .inSingletonScope();
  bind<SMTP>(SMTP)
    .toSelf()
    .inSingletonScope();
});

const IoCContainer = new Container();
IoCContainer.load(config, domain, utilities);

export { IoCContainer };
