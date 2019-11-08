import { toast } from "react-toastify";
import { Errors } from "@huckleberryai/core";

export const showErrorToast = (input: unknown) => {
  if (Errors.Adapter.Is(input)) {
    toast.error("we're having network issues, please try again later.");
  } else if (Errors.Forbidden.Is(input)) {
    toast.error("you don't have access to this functionality.");
  } else if (Errors.NotFound.Is(input)) {
    toast.error("we can't find what you are looking for.");
  } else if (Errors.Validation.Is(input)) {
    toast.error("invalid inputs.");
  } else {
    toast.error("an unexpected error has occured, please try again later.");
  }
};
