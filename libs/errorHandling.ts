import { toast } from "./toast";
import { removeSessionToken } from "./session_manager";

export const errorHandler = (error: any): void => {
  const message: string | string[] | undefined = error.response?.data?.message;
  
  if (typeof message === "string") {
  toast(message);
  } else if (Array.isArray(message)) {
  message.forEach((msgText: string) => {
  toast(msgText);
  });
  }
  
  const statusCode: number = Number(error.response?.data?.statusCode || 0);
  if (statusCode === 403) {
  toast("Please login again");
  removeSessionToken();
  setTimeout(() => {
  window.location.href = "/login.html";
  }, 3000);
  }
  };
  