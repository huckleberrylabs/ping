import {
  controller,
  httpGet,
  httpPost,
  request,
  requestBody,
  BaseHttpController,
} from "inversify-express-utils";
import {
  EmailSendGridEvent,
  EmailProcessedEvent,
  EmailDroppedEvent,
  EmailDeliveredEvent,
  EmailDeferredEvent,
  EmailBouncedEvent,
  EmailSpamEvent,
  EmailUnsubscribedEvent,
  EmailOpenedEvent,
} from "./events";
import { EventBus, LoggedRequest } from "../../utilities";

@controller("/email")
export class EmailController extends BaseHttpController {
  constructor(private eventBus: EventBus) {
    super();
  }
  @httpGet("/openevent.gif")
  async onOpenEventObserver(@request() req: LoggedRequest) {
    const nodeID = "9e9765de-acbd-45b5-9026-b6ed1db76f99";
    try {
      const evt = new EmailOpenedEvent(nodeID, req);
      this.eventBus.emit(evt);
      const content = new Buffer(42);
      content.write(
        "GIF89a\u0001\u0000\u0001\u0000�\u0000\u0000\u0000\u0000\u0000ÿÿÿ!ù\u0004\u0001\u0000\u0000\u0000\u0000,\u0000\u0000\u0000\u0000\u0001\u0000\u0001\u0000\u0000\u0002\u0001D\u0000;",
        "binary"
      );
      return this.ok(content);
    } catch (error) {
      return this.statusCode(400);
    }
  }
  @httpPost("/sendgridevent")
  async onSendGridEventObserver(
    @request() req: LoggedRequest,
    @requestBody() body: EmailSendGridEvent[]
  ) {
    const nodeID = "744c8562-e896-48ec-b047-569bd0efe096";
    try {
      body.forEach(event => {
        switch (event.event) {
          case "processed":
            this.eventBus.emit(new EmailProcessedEvent(nodeID, event));
            break;
          case "dropped":
            this.eventBus.emit(new EmailDroppedEvent(nodeID, event));
            break;
          case "delivered":
            this.eventBus.emit(new EmailDeliveredEvent(nodeID, event));
            break;
          case "deferred":
            this.eventBus.emit(new EmailDeferredEvent(nodeID, event));
            break;
          case "bounce":
            this.eventBus.emit(new EmailBouncedEvent(nodeID, event));
            break;
          case "open":
            throw new Error("SendGrid Webhook open Event not supported");
          case "click":
            throw new Error("SendGrid Webhook click Event not supported");
          case "spam_report":
            this.eventBus.emit(new EmailSpamEvent(nodeID, event));
            break;
          case "unsubscribe":
            this.eventBus.emit(new EmailUnsubscribedEvent(nodeID, event));
            break;
          case "group_unsubscribe":
            throw new Error(
              "SendGrid Webhook group_unsubscribe Event not supported"
            );
          case "group_resubscribe":
            throw new Error(
              "SendGrid Webhook group_resubscribe Event not supported"
            );
          default:
            throw new Error("Unknown SendGrid WebHook Event");
        }
      });
      return this.statusCode(200);
    } catch (err) {
      return this.statusCode(400);
    }
  }
}
