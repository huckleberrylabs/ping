const LOCALE = "en-US";

export const formatDate = (date: Date): string => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };
  return date.toLocaleString(LOCALE, options);
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString(LOCALE, { weekday: "long" });
};
