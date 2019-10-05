export const getElementById = (id: string) => {
  const element = document.getElementById(id);
  return element ? element : new Error(`element not found`);
};
