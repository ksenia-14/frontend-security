import React from 'react';
import { useNavigate } from 'react-router-dom'

const PersonalSeller = () => {
  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  const onSubmit = () => {
    localStorage.clear();
    navigate('/authorization')
  }

  return (
    <div>
      Вы вошли в личный кабинет продавца
      <button onClick={onSubmit}>Выйти</button>
    </div>
  )
}

export default PersonalSeller