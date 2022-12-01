import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from "../../App";
import style from './personalArea.module.css';

const PersonalArea = () => {

  // использование навигации - переброс на другой url
  let navigate = useNavigate()
  // использование контекста
  const context = React.useContext(AppContext)

  // state для пользователя
  // const [user, setUser] = useState({
  //   login: localStorage.getItem('USERNAME'),
  //   password: localStorage.getItem('PASSWORD')
  // })

  // объект пользователя с логином и паролем
  const user = {
    "login": localStorage.getItem('USERNAME'),
    "password": localStorage.getItem('PASSWORD')
  }


  const onSubmit = () => {
    localStorage.clear();
    navigate('/authorization')
  }

  const isAuthorization = async () => {
    console.log(user)
    let tokenBrowser = "fdgfg"
    let instance = axios.create();
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }

    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      let tokenSpring
      await instance.get('http://localhost:8081/api/token')
        .then((response) => response.data)
        .then((data) => { tokenSpring = data.value })
      if (tokenBrowser != tokenSpring)
        navigate('/authorization')
    } catch (error) {
      console.log(error)
      navigate('/authorization')
    }

    // let tokenSpring = await axios.get("http://localhost:8081/api/token", user,
    //   { headers: headers })

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