import { getAccessToken, storeAccessToken } from "./storage";

const host = 'https://react-interview.xm.com/';

/**
 * Login api service
 */
async function login(name: string, password: string) {
  const url = `${host}login`;

  const data = { name, password };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });


  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  const responseJson = await response.json();
  storeAccessToken(responseJson.token);
  return responseJson;
};
/**
 * Fetch ingredients
 */
async function getIngredients() {
  const token = getAccessToken();
  if (!token) {
    throw new Error('AUTH1');
  }
  const url = `${host}ingredients`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`GET request failed with status ${response.status}`);
  }

  const responseJson = await response.json();
  return responseJson;
};

export { login, getIngredients, host};