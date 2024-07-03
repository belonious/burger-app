import React, { useEffect, useState } from 'react';
import { getIngredients, host } from '../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearAccessToken } from '../services/storage';

interface IIngredient {
  name: string;
  src: string;
  id: number;
}

const StyledBurgerBuilder = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const StyledIngredientOptions = styled.div`
  flex: 0 0 20%;
  background-color: #fff3a0;
  padding: 20px;
`;

const StyledBurger = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const StyledIngredientOption = styled.img`
    max-width: 120px;
    width: 70%;
`;

const StyledUsedIngredient = styled.div`
    margin-top:-20px;
    &:hover {
      background-color: #ebebeb;
    }
`;

const StyledBottomBun = styled.div`
    margin-top:-20px;
`;

const StyledUsedIngredientImg = styled.img`
    max-width: 300px;
    width: 70%;
`;

/**
 * Burger builder page for constructing burger.
 */
const BurgerBuilder = () => {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [burgerIngredients, setBurgerIngredients] = useState<IIngredient[]>([]);
  const navigate = useNavigate();

  const addIgredient = (ingredient: IIngredient) => setBurgerIngredients([ingredient, ...burgerIngredients]);

  const removeIgredient = (indexToRemove: number) => setBurgerIngredients([...burgerIngredients
    .filter((ingredient, index) => { return indexToRemove !== index })]);

  useEffect(() => {
    async function populateIngredients() {
      try {
        const ingredients = await getIngredients();
        setIngredients(ingredients);
      } catch (e) {
        clearAccessToken()
        navigate('/');
      }
    }
    populateIngredients();
  }, [])


  return <StyledBurgerBuilder>
    <StyledIngredientOptions>
      <h2>Click to add an ingredient</h2>
      {ingredients && ingredients.length > 0 && ingredients.map((i, index) => {
        return <div key={i.id} onClick={() => addIgredient(i)}>
          <StyledIngredientOption src={`${host}img/${i.src}`} alt={i.name} /></div>
      })}
    </StyledIngredientOptions>
    <StyledBurger>
      <h2>Click to remove an ingredient</h2>
      <div><StyledUsedIngredientImg src={`${host}img/bun_top.png`} alt="bun_top" /></div>
      {burgerIngredients.map((i, index) => {
        return <StyledUsedIngredient data-testid={`${i.name}_${index}`} key={index} onClick={() => removeIgredient(index)}>
          <StyledUsedIngredientImg src={`${host}img/${i.src}`} alt={`${i.name}_${index}`} /></StyledUsedIngredient>
      })}
      <StyledBottomBun><StyledUsedIngredientImg src={`${host}img/bun_bottom.png`} alt="bun_bottom" /></StyledBottomBun>
    </StyledBurger>
  </StyledBurgerBuilder>
}

export default BurgerBuilder