## User Story

## Create a ShowingRequest

1. User is in SwipeView OR User is in PropertyDetailView.
2. User clicks on "Request Showing" Button. User is now in CreateShowingRequestView
3. User Fills out form with details:
   - Joinee Emails
   - Time Available (for now, freehand text)
   - Days Available (select multiple)
4. User is taken back to SwipeView OR PropertyDetailView, "Request Showing" Button Animation Indicates Success.
5. "Request Showing" Button is now disabled on Property SwipeView AND PropertyDetailView
6. An Email is sent to:
   - The Administrator
   - The Joinees
   - The User

## Domain Model Notes

- A Property can only have One ShowingRequest per User
- A ShowingRequest can have Many Joinees
- A User can have Many ShowingRequests
- For now, Times Available is a free hand string
