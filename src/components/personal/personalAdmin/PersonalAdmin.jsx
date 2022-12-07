import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../global';
import { AppContext } from '../../../App';
import style from './personalAdmin.module.css';
import Users from './users/Users';
import Products from './products/Products';
import Orders from './orders/Orders';
import OpenElement from './openElement/OpenElement';

const PersonalAdmin = () => {
  const [viewUsers, setViewUsers] = React.useState(true)
  const [viewProducts, setViewProducts] = React.useState(true)
  const [viewOrders, setViewOrders] = React.useState(true)

  // использование контекста
  const context = React.useContext(AppContext)

  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  React.useEffect(() => {
  }, [context.render, viewUsers, viewProducts, viewOrders])

  const btnLogout = async () => {
    localStorage.clear();
    navigate('/authorization')
  }

  return (
    <div className={style["main-container-admin"]}>
      <h1>Вы вошли в личный кабинет администратора</h1>
      <div onClick={() => setViewUsers(!viewUsers)}>
        <OpenElement title="Пользователи" />
        {viewUsers ? <Users /> : null}
      </div>

      <div onClick={() => setViewProducts(!viewProducts)}>
        <OpenElement title="Товары" />
        {viewProducts ? <Products /> : null}
      </div>

      <div onClick={() => setViewOrders(!viewOrders)}>
        <OpenElement title="Заказы" />
        {viewOrders ? <Orders /> : null}
      </div>
      <button className={style["btn-exit"]} onClick={btnLogout}>Выйти</button><br /><br />
    </div>
  )
}

export default PersonalAdmin