import { PrivateSDK } from "@huckleberryai/ping";
import { isLeft, left, right, Either } from "fp-ts/lib/Either";
import { Errors, NonEmptyString, UUID } from "@huckleberryai/core";
import { toast } from "react-toastify";

export const isLoggedIn = (): Either<Errors.Unauthenticated.T, UUID.T> => {
  const accountID = localStorage.getItem("accountID");
  if (!UUID.Is(accountID)) {
    localStorage.removeItem("accountID");
    return left(Errors.Unauthenticated.C());
  }
  return right(accountID);
};

export const logout = async (id: UUID.T) => {
  localStorage.removeItem("accountID");
  await PrivateSDK.C().Account.Logout(id);
  window.location.reload();
};

export const login = async (token: NonEmptyString.T) => {
  const idMaybe = await PrivateSDK.C().Account.LoginWithToken(token);
  console.log(idMaybe);
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
  console.log("Auth Login ID Set to LocalStorage: ", id);
  localStorage.setItem("accountID", id);
  return right(null);
};
