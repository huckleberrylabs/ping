import { IDispatch, Type } from "@huckleberryai/core";
import { WidgetAddNameToMessageCommand } from "./command";
import { Widget } from "./event";

const origin = "widget:handler:add-name-to-message-command" as Type;
export const WidgetAddNameToMessageCommandHandler = (dispatch: IDispatch) => (
  command: WidgetAddNameToMessageCommand
) => {
  const event = WidgetNameAddedToMessageEvent(origin, command);
  dispatch(event);
};
