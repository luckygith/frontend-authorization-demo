const TOKEN_KEY = "jwt";

 const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

 const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export default setToken, getToken;
