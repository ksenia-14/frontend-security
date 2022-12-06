import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../global';
import { AppContext } from '../../../App';
import style from './personalAdmin.module.css';
import UserEditItem from './users/userEditItem/UserEditItem';
import Users from './users/Users';
import Products from './products/Products';
import Orders from './orders/Orders';

const PersonalAdmin = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  React.useEffect(() => {
  }, [context.render])

  const btnLogout = async() => {
    localStorage.clear();
    navigate('/authorization')
  }

  return (
    <div>
      Вы вошли в личный кабинет администратора<br /><br />
      <Users />
      <br /><br />
      <Products />
      <br /><br />
      <Orders/>
      <br /><br />
      <button onClick={btnLogout}>Выйти</button><br /><br />
    </div>
  )
}

export default PersonalAdmin