import { ContainerModule } from "inversify";
import { IEventHandler } from "../../core/lib";
import {
  WidgetAddNameToMessageCommandType,
  WidgetAddNameToMessageCommandHandler,
  WidgetAddPhoneToMessageCommandType,
  WidgetAddPhoneToMessageCommandHandler,
  WidgetAddTextToMessageCommandType,
  WidgetAddTextToMessageCommandHandler,
  WidgetCreateMessageCommandType,
  WidgetCreateMessageCommandHandler,
  WidgetSendMessageCommandType,
  WidgetSendMessageCommandHandler,
} from "./message";
import {
  WidgetGetSettingsQueryType,
  WidgetGetSettingsQueryHandler,
} from "./settings";

export const WidgetModule = new ContainerModule(bind => {
  bind<IEventHandler>(WidgetAddNameToMessageCommandType).to(
    WidgetAddNameToMessageCommandHandler
  );
  bind<IEventHandler>(WidgetAddPhoneToMessageCommandType).to(
    WidgetAddPhoneToMessageCommandHandler
  );
  bind<IEventHandler>(WidgetAddTextToMessageCommandType).to(
    WidgetAddTextToMessageCommandHandler
  );
  bind<IEventHandler>(WidgetCreateMessageCommandType).to(
    WidgetCreateMessageCommandHandler
  );
  bind<IEventHandler>(WidgetSendMessageCommandType).to(
    WidgetSendMessageCommandHandler
  );
  bind<IEventHandler>(WidgetGetSettingsQueryType).to(
    WidgetGetSettingsQueryHandler
  );
});
