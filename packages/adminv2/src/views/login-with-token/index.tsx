import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { isLeft } from "fp-ts/lib/Either";

// Providers and Services
import { useObservable } from "../../observable";
import { authService } from "../../services";

// Toast
import { toast } from "react-toastify";
import { Routes } from "../../config";

type Props = RouteComponentProps & {};

export const LoginWithToken = (props: Props) => {
  const loading = useObservable(authService.loading);
  const query = new URLSearchParams(props.location.search);
  const token = query.get("token");

  if (typeof token === "string" && token.length > 0 && !loading) {
    authService.loginWithToken(token).then((result) => {
      if (isLeft(result)) {
        // TODO more specific toast message
        toast.warn("a valid email must be provided.");

        // TODO check if these are necessary
        window.location.replace(Routes.sendLoginEmail);
        props.history.push(Routes.sendLoginEmail);
      } else {
        toast.success("login successful");
      }
    });
  }
  return <></>;
};
