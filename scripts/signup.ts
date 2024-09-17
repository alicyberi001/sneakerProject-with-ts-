import { toast } from "../libs/toast.ts";
import { login } from "../apis/services/auth.service.ts";
import { errorHandler } from "../libs/errorHandling.ts";
import { setSessionToken } from "../libs/session_manager.ts";

const signupForm = document.getElementById(
  "signupForm"
) as HTMLFormElement | null;
const inputpass = document.getElementById(
  "password"
) as HTMLInputElement | null;
const inputuser = document.getElementById(
  "inputuser"
) as HTMLInputElement | null;
const eyes = document.getElementById("eyes") as HTMLElement | null;
const loginBtn = document.getElementById(
  "loginBtn"
) as HTMLButtonElement | null;

function hideHandler(): void {
  if (inputpass && eyes) {
    if (inputpass.type === "password") {
      inputpass.type = "text";
      eyes.classList.remove("fa-eye");
      eyes.classList.add("fa-eye-slash");
    } else {
      inputpass.type = "password";
      eyes.classList.remove("fa-eye-slash");
      eyes.classList.add("fa-eye");
    }
  }
}

function enableBtn(): void {
  if (inputpass && inputuser && loginBtn) {
    if (inputpass.value !== "" && inputuser.value !== "") {
      loginBtn.style.backgroundColor = "black";
    } else {
      loginBtn.style.backgroundColor = "";
    }
  }
}

inputpass?.addEventListener("input", enableBtn);

eyes?.addEventListener("click", hideHandler);

// ================================================================================================

signupForm?.addEventListener("submit", async (event: Event) => {
  event.preventDefault();
  const target = event.target as HTMLFormElement;
  const usernameInput: HTMLInputElement = target.username;
  const passwordInput = target.password as HTMLInputElement;

  try {
    const response = await login({
      username: usernameInput.value,
      password: passwordInput.value,
    });
    setSessionToken(response.token);
    toast("Logged in", "success");
    setTimeout(() => {
      window.location.href = "/home";
    }, 3000);
  } catch (error) {
    console.error(error);
    errorHandler(error);
  }
});
