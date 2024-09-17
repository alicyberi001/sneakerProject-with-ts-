import { tokenName } from "./constans";

export const setSessionToken = (token : string) => {
  localStorage.setItem(tokenName, token);
};

export const getSessionToken = () => {
  return localStorage.getItem(tokenName);
};

export const removeSessionToken = () => {
  localStorage.removeItem(tokenName);
};