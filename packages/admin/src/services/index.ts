import { AuthService } from "./auth";
import { AccountService } from "./account";

export const authService = new AuthService();
export const accountService = new AccountService(authService);
