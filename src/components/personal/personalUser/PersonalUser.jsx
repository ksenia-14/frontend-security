import React from 'react';
import { useNavigate } from 'react-router-dom'
import Cart from './cart/Cart';
import Orders from './orders/Orders';
import Products from './products/Products';
import style from './personalUser.module.css';

const PersonalUser = () => {
  const [viewProducts, setViewProducts] = React.useState(true)
  const [viewCart, setViewCart] = React.useState(false)
  const [viewOrders, setViewOrders] = React.useState(false)
  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  const onSubmit = () => {
    localStorage.clear();
    navigate('/authorization')
  }

  const clickProducts = () => {
    setViewProducts(true)
    setViewCart(false)
    setViewOrders(false)
  }

  const clickCart = () => {
    setViewProducts(false)
    setViewCart(true)
    setViewOrders(false)
  }

  const clickOrders = () => {
    setViewProducts(false)
    setViewCart(false)
    setViewOrders(true)
  }

  return (
    <>
      <div className={style["header"]}>
        <div className={style["hello"]}>Вы вошли в личный кабинет покупателя</div>
        <div onClick={clickProducts} className={style["header-item"]}>Все продукты</div>
        <div onClick={clickCart} className={style["header-item"]}>Корзина</div>
        <div onClick={clickOrders} className={style["header-item"]}>Заказы</div>
        <div className={style["header-item"]} onClick={onSubmit}>Выйти</div>
      </div>
      <div className={style["main-container-user"]}>
        { viewProducts ? <Products /> : null }
        { viewCart ? <Cart /> : null }
        { viewOrders ? <Orders /> : null }
      </div>
    </>
  )
}

export default PersonalUser