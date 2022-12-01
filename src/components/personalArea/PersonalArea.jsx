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

  const isAuthorization = async () => {
    let tokenBrowser = ""
    let instance = axios.create();
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }

    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;
    try {
      let tokenSpring
      await instance.get(urlAPI + "/api/token")
        .then((response) => response.data)
        .then((data) => { tokenSpring = data.value })
      if (tokenBrowser != tokenSpring)
        navigate('/authorization')
    } catch (error) {
      console.log(error)
      navigate('/authorization')
    }
  }
  isAuthorization()

  return (
    <div>
      Вы вошли в личный кабинет
      <button onClick={onSubmit}>Выйти</button>
    </div>
  )
}

export default PersonalArea