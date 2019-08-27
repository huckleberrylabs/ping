import { getDayName } from "../../helpers";
import { SendMailOptions } from "../../utilities";
import { DaysAvailable } from "./model";

const SHOWING_ADMIN_EMAIL = "showings@huckleberry.app";
const PUBLIC_EMAIL = "ask@huckleberry.app";
const SOCIAL_HANDLE = "@askhuckleberry";

const companySignature = `
  -- Your friends at Huckleberry ❤️

  Don't be a stranger! Let us know how we're doing at ${PUBLIC_EMAIL} or ${SOCIAL_HANDLE} on social.
`;

const getEmailIntro = () => {
  const INTROS = [
    "Wake up pal!",
    "Howdy partner!",
    "Hi friend!",
    "Ahoy, matey!",
    "Ello, gov'nor!",
    "We come in peace 👽!",
    "What's cookin', good lookin'?",
    "Aloha!",
    "Buongiorno!",
    "Ciao!",
    "Salut!",
    "Guten tag!",
    "Hola! Mucho Gusto!",
    "Konichiwa!",
    `Happy ${getDayName(new Date())}!`
  ];
  return INTROS[Math.floor(Math.random() * INTROS.length)];
};

const printShowingDaysAvailable = (daysAvailable: number[]): string => {
  if (daysAvailable.length === 7) {
    return "any day";
  }
  const dayNames = daysAvailable.map(number => {
    switch (number) {
      case 1:
        return "Mondays";
      case 2:
        return "Tuesdays";
      case 3:
        return "Wednesdays";
      case 4:
        return "Thursdays";
      case 5:
        return "Fridays";
      case 6:
        return "Saturdays";
      case 7:
        return "Sundays";
      default:
        throw new Error("daysAvailable can only be between 1 and 7");
    }
  });
  if (dayNames.length === 1) {
    return dayNames[0];
  }
  return `${dayNames.slice(0, -1).join(", ")} and ${dayNames.slice(-1)}`;
};

export const showingRequestCreatedEmail = (
  userEmail: string,
  userFirstName: string,
  joinees: string[],
  showingAddress: string,
  daysAvailable: DaysAvailable[],
  timesAvailable: string
): SendMailOptions => {
  return {
    to: SHOWING_ADMIN_EMAIL,
    from: userEmail,
    cc: joinees,
    subject: `${userFirstName} would like to check out ${showingAddress}`,
    text: `${getEmailIntro()}
          
          ${userFirstName} would appreciate it if you helped them find their next home. 
          
          For starters, they'd like to kick the tires on this badboy:
          
          ${showingAddress}

          Generally ${userFirstName} is available on ${printShowingDaysAvailable(
      daysAvailable
    )},
          preferably around ${timesAvailable}.

        
          We'll let you folks take it from here!

         ${companySignature}`,
    html: `INSERT HTML HERE`
  };
};
