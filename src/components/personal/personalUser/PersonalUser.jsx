import React from 'react';
import { useNavigate } from 'react-router-dom'
import Products from './products/Products';

const PersonalUser = () => {
  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  const onSubmit = () => {
    localStorage.clear();
    navigate('/authorization')
  }

  return (
    <div>
      Вы вошли в личный кабинет покупателя<br/>
      <Products/>
      <br/><br/>
      <button onClick={onSubmit}>Выйти</button>
    </div>
  )
}

export default PersonalUser