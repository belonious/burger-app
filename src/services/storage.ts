const storeAccessToken = (token: string) => localStorage.setItem("accessToken", token);
const getAccessToken = () => localStorage.getItem("accessToken");
const clearAccessToken = () => localStorage.removeItem("accessToken");

export {
    storeAccessToken,
    getAccessToken,
    clearAccessToken
}