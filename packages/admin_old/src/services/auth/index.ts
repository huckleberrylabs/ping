import { isLeft, left, right, Either, isRight } from "fp-ts/lib/Either";
import { Errors, NonEmptyString, UUID } from "@huckleberrylabs/ping-core";
import { toast } from "react-toastify";
import { SDK } from "../../sdk";

const LocalStorageAccountIDKey = "accountID";

export const isLoggedIn = (): Either<Errors.Unauthenticated.T, UUID.T> => {
  const accountID = localStorage.getItem(LocalStorageAccountIDKey);
  if (!UUID.Is(accountID)) {
    localStorage.removeItem(LocalStorageAccountIDKey);
    return left(Errors.Unauthenticated.C());
  }
  return right(accountID);
};

export const logout = async (id: UUID.T) => {
  localStorage.removeItem(LocalStorageAccountIDKey);
  await SDK.Account.Logout(id);
  window.location.reload();
};

export const login = async (token: NonEmptyString.T) => {
  const idMaybe = await SDK.Account.LoginWithToken(token);
  if (isLeft(idMaybe)) {
    switch (idMaybe.left.type) {
      case Errors.NotFound.Name:
        toast.warn("Account doesn't exist.");
        break;
      case Errors.Unauthorized.Name:
        toast.warn("Login link expired or invalid, please login again.");
        break;
      default:
        break;
    }
    return left(Errors.Unauthenticated.C());
  }
  const id = idMaybe.right;
  localStorage.setItem(LocalStorageAccountIDKey, id);
  return right(null);
};

export const Auth = () => {
  const state = { loggedIn: false };
  const maybeLoggedIn = isLoggedIn();
  if (isRight(maybeLoggedIn)) state.loggedIn = false;
};
