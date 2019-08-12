import {
  ID,
  Result,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberryai/core";
import { TextWidgetSettingsQuery } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { TextWidgetSettingsRepository } from "../widget-repository";
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
    console.log("QUERY: ", event);
    const widgetID = event.widgetID;
    await this.eventRepo.add(event);
    const widgetSettings = await this.settingsRepo.getByID(widgetID);
    console.log("WidgetSettings: ", widgetSettings);
    const result = new Result(
      widgetSettings,
      this.id,
      event.corrID,
      event.id,
      event.type
    );
    console.log("RESULT: ", result);
    return result;
  }
}
