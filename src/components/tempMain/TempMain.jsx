import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../App';
import style from './tempMain.module.css';
import { urlAPI } from '../../global';

const TempMain = () => {
  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  const onClickSignIn = () => {
    navigate('/registration');
  }

  const onClickLogIn = () => {
    navigate('/authorization');
  }

  return (
    <>
      <p>Главная страница</p>
      <p className={style["p-button"]} onClick={onClickLogIn}>Войти</p>
      <p className={style["p-button"]} onClick={onClickSignIn}>Зарегистрироваться</p>
    </>
  )
}

export default TempMain
