import { login, getIngredients, host } from '../services/api';
import { getAccessToken, storeAccessToken } from '../services/storage';

jest.mock('../services/storage');


describe('auth', () => {
    describe('login', () => {
        it('should call storeAccessToken on successful login', async () => {
            const mockStoreAccessToken = jest.fn();
            storeAccessToken.mockImplementation(mockStoreAccessToken);
            const mockResponse = { token: 'abc123' };

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockResponse),
                })
            );

            await login('test_user', 'password');

            expect(fetch).toHaveBeenCalledWith(`${host}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'test_user', password: 'password' }),
            });
            expect(mockStoreAccessToken).toHaveBeenCalledWith(mockResponse.token);
        });

        it('should throw error on failed login', async () => {

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                })
            );

            try {
                await login('test_user', 'wrong_password');
            } catch (error) {
                expect(error.message).toEqual(`Login failed with status 401`);
            }
        });
    });

    describe('getIngredients', () => {
        it('should throw error if no access token is found', async () => {
            getAccessToken.mockReturnValue(null);

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );
            try {
                await getIngredients();
            } catch (error) {
                expect(error.message).toEqual('AUTH1');
            }
        });

        it('should fetch ingredients with authorization header on successful token retrieval', async () => {
            const mockAccessToken = 'valid_token';
            getAccessToken.mockReturnValue(mockAccessToken);
            const mockResponse = { ingredients: [1,2,3] };

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockResponse),
                })
            );
            const res = await getIngredients();

            expect(fetch).toHaveBeenCalledWith(`${host}ingredients`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${mockAccessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            expect(res.ingredients).toHaveLength(3)
        });

        it('should throw error on failed ingredient fetch', async () => {
            const mockAccessToken = 'valid_token';
            getAccessToken.mockReturnValue(mockAccessToken);
            const mockResponse = { message: 'Failed to retrieve ingredients' };

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500
                })
            );

            try {
                await getIngredients();
            } catch (error) {
                expect(error.message).toEqual(`GET request failed with status 500`);
            }
        });
    });
});