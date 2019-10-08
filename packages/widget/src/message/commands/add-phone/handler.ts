import { IDispatch, Type } from "@huckleberryai/core";
import { WidgetAddPhoneToMessageCommand } from "./command";
import { WidgetPhoneAddedToMessageEvent } from "./event";

const origin = "widget:handler:add-phone-to-message-command" as Type;
export const WidgetAddPhoneToMessageCommandHandler = (dispatch: IDispatch) => (
  command: WidgetAddPhoneToMessageCommand
) => {
  const event = WidgetPhoneAddedToMessageEvent(origin, command);
  dispatch(event);
};
