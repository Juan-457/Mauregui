const Auth = (() => {
  const AUTH_KEY = "mauregui_authed";

  const isAuthenticated = () => sessionStorage.getItem(AUTH_KEY) === "true";

  const login = (password) => {
    if (password === APP_CONFIG.PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
})();
