import { toast } from "react-toastify";
import { Errors } from "@huckleberryai/core";

export const showErrorToast = (input: unknown) => {
  if (Errors.Adapter.Is(input)) {
    toast.error("We're having network issues, please try again later.");
  } else if (Errors.Forbidden.Is(input)) {
    toast.error("You don't have access to this functionality.");
  } else if (Errors.NotFound.Is(input)) {
    toast.error("We can't find what you are looking for.");
  } else if (Errors.Validation.Is(input)) {
    toast.error("Invalid inputs.");
  } else {
    toast.error("An unexpected error has occured, please try again later.");
  }
};
