import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from "../../App";
import style from './personalArea.module.css';
import { urlAPI } from '../../global';

const PersonalArea = () => {
  // использование навигации - переброс на другой url
  let navigate = useNavigate()
  // использование контекста
  const context = React.useContext(AppContext)

  const onSubmit = () => {
    localStorage.clear();
    navigate('/authorization')
  }

  return (
    <div>
      Вы вошли в личный кабинет
      <button onClick={onSubmit}>Выйти</button>
    </div>
  )
}

export default PersonalArea