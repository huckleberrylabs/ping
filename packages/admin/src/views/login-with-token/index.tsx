import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { isLeft } from "fp-ts/lib/Either";

// Providers and Services
import { authService } from "../../services";

// Toast
import { toast } from "react-toastify";
import { Routes } from "../../config";
import { NonEmptyString } from "@huckleberrylabs/ping-core";

type Props = RouteComponentProps & {};

export const LoginWithToken = (props: Props) => {
  const query = new URLSearchParams(props.location.search);
  const token = query.get("token");
  if (NonEmptyString.Is(token)) {
    authService.loginWithToken(token).then((result) => {
      if (isLeft(result)) {
        toast.warn("login link expired or invalid.");
        window.location.replace(Routes.sendLoginEmail);
        props.history.push(Routes.sendLoginEmail);
      } else {
        toast.success("login successful");
      }
    });
  } else {
    window.location.replace(Routes.sendLoginEmail);
    props.history.push(Routes.sendLoginEmail);
  }
  return <></>;
};
