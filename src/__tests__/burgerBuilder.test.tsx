import React from 'react';
import { render, screen, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import BurgerBuilder from '../components/burgerBuilder';
import * as api from '../services/api';
jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(() => { return () => { } }),
}));

const mockedIngredients = [
    { id: '1', name: 'tomato', src: 'tomato.png' },
    { id: '2', name: 'potato', src: 'potato.png' },
];

describe('BurgerBuilder', () => {
    beforeEach(() => {
        api.getIngredients = jest.fn().mockResolvedValue(mockedIngredients);
    });

    it('renders ingredients and allows adding them to the burger', async () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        const { getByAltText } = render(<BurgerBuilder />);

        // Wait for the ingredients to be populated
        const ingredientOptions = await screen.findAllByRole('img', { name: /tomato|potato/ });

        // Check if the ingredients are displayed
        expect(ingredientOptions).toHaveLength(2);

        // Click to add an ingredient
        fireEvent.click(ingredientOptions[0]); // Add tomato
        fireEvent.click(ingredientOptions[1]); // Add potato

        const usedIngredients = await screen.findAllByRole('img', { name: /tomato_1|potato_0/ });
        expect(ingredientOptions).toHaveLength(2);
    });

    it('should allow to remove ingredient from the burger', async () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        render(<BurgerBuilder />);
        const ingredientOptions = await screen.findAllByRole('img', { name: /tomato|potato/ });

        expect(ingredientOptions).toHaveLength(2);
        fireEvent.click(ingredientOptions[0]);
        fireEvent.click(ingredientOptions[1]);

        // remove potato
        const potato = screen.getByTestId('potato_0')
        fireEvent.click(potato);
        screen.debug();
        await waitFor(() => expect(() => screen.getByTestId('potato_1')).toThrow());
    });
});
