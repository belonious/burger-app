import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { ProviderWrapperHome } from '../test-utils'
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import LoginForm from '../components/login';
jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(() => { return () => {}}),
}));

// jest.mock('../services/api', () => ({
//     login: jest.fn((u, p) => {
//         return u === 'error' ? Promise.reject('Login failed') : Promise.resolve({});
//     }),
//     getIngredients: jest.fn(() => {
//         return Promise.resolve([{ id: 1, name: 'tomatoe', src: 'tomatoe.png' }])
//     })
// }));
const mockedIngredients = [
    { id: '1', name: 'tomato', src: 'tomato.png' },
    { id: '2', name: 'potato', src: 'potato.png' },
];
const navigate = jest.fn();
useNavigate.mockReturnValue(navigate);
describe('LoginForm', () => {
    beforeEach(() => {
        api.getIngredients = jest.fn().mockResolvedValue(mockedIngredients);
        api.login = jest.fn();
    });
    it('should render the form elements', () => {
        // render(<App />, {wrapper: ProviderWrapperHome});
        render(<LoginForm />);

        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('should update state on input change', () => {
        render(<LoginForm />);;

        const nameInput = screen.getByLabelText('Name:');
        const passwordInput = screen.getByLabelText('Password:');

        fireEvent.change(nameInput, { target: { value: 'test-user' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(screen.getByDisplayValue('test-user')).toBeInTheDocument();
        expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
    });

    it('should submit the form and call login function', async () => {
        render(<LoginForm />);

        const nameInput = screen.getByLabelText('Name:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button');
        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'test-user' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.submit(submitButton);

            await expect(login).toHaveBeenCalledWith('test-user', 'password123');
        })
    });

    it('should show error message on login failure', async () => {
        render(<LoginForm />);
        api.login = jest.fn(() => {
            throw new Error('Login failed')
        });

        const nameInput = screen.getByLabelText('Name:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button');

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'error' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.submit(submitButton);
            expect(login).toHaveBeenCalledWith('error', 'password123');
            // expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
        })
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
});

afterEach(() => {
    jest.clearAllMocks()
});
