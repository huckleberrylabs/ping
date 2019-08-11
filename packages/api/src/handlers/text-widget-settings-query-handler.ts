import {
  ID,
  Result,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberry/core";
import { TextWidgetSettingsQuery } from "@huckleberry/text";
import { EventRepository } from "../event-repository";
import { TextWidgetSettingsRepository } from "../app-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetSettingsQueryHandler implements IEventHandler {
  public id = new ID("1aa5921c-68e8-4e30-86ac-40d0ce279796");
  public static type = TextWidgetSettingsQuery.type;
  constructor(
    private settingsRepo: TextWidgetSettingsRepository,
    private eventRepo: EventRepository
  ) {}
  async handle(event: TextWidgetSettingsQuery) {
    const appID = event.appID;
    const appSettings = await this.settingsRepo.getByID(appID);
    await this.eventRepo.add(event);
    return new Result(appSettings, this.id, event.corrID, event.id, event.type);
  }
}
