import { toast } from "react-toastify";
import { Errors } from "@huckleberryai/core";

export const showErrorToast = (input: unknown) => {
  if (Errors.Adapter.Is(input)) {
    toast.error("We're having network issues, please try again later.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  } else if (Errors.Forbidden.Is(input)) {
    toast.error("You don't have access to this functionality.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  } else if (Errors.NotFound.Is(input)) {
    toast.error("We can't find what you are looking for.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  } else if (Errors.Validation.Is(input)) {
    toast.error("Invalid inputs.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  } else {
    toast.error("An unexpected error has occured, please try again later.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }
};
