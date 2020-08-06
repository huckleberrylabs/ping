Invite

## TODO

1. is the agent allowed to sign up with email? (check Invite.restrictions.ssoOnly)
2. is the agent signing up with the same email as Invite.email if Invite.restrictions.sameEmailOnly is on
3. is the invite invalid? check with jwt expiry and invalidInviteRepo
4. apply default authorizations for new user along with Invite.restrictions.accessPolicies and Invite.grants.accessPolicies
5. add referral, promocode and reseller to a transient registration object
6. set EmailVerification to false (in Domain), require it on first login

1) account.sendInvite(email, role)
2) account.revokeInvite(inviteID)

```
export type Invite = {
  restrictions: {
    ssoOnly: boolean;
    sameEmailOnly: boolean;
    accessPolicies: AccessControlPolicy[];
  };
  grants: {
    accessPolicies: AccessControlPolicy[];
  };
  exipres: TimeStamp.T;
  referrer: UUID.T;
  promoCode: string;
};
```
