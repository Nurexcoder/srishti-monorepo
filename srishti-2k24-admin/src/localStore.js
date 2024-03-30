export const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
