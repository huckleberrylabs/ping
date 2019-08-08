import {
  controller,
  httpPost,
  requestBody,
  BaseHttpController,
} from "inversify-express-utils";
import { ReminderService } from "./service";
import { ReminderEvent } from "./events";

@controller("/reminder")
export class ReminderController extends BaseHttpController {
  constructor(private service: ReminderService) {
    super();
  }
  @httpPost("")
  async onReminderEventObserver(@requestBody() event: ReminderEvent) {
    try {
      await this.service.remind(event);
      return this.statusCode(200);
    } catch (error) {
      return this.statusCode(400);
    }
  }
}
