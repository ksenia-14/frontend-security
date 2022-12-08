import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../../../App';
import { urlAPI } from '../../../../global';
import style from './cart.module.css';
import ProductItem from '../../../productItem/ProductItem';

const Cart = () => {
  const context = React.useContext(AppContext)
  const [productsCart, setProductsCart] = React.useState([])

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const productsCartData = await instance.get(urlAPI + "/api/user/product/cart")
      setProductsCart(productsCartData.data)
      setProductsCart((prev) => prev.sort((a, b) => a.product.id > b.product.id ? 1 : -1))
    } catch (error) {
      console.log("Ошибка получения продуктов в корзине")
    }

  }

  const addToCart = async (id) => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/user/product/add_cart/${id}`) // отправка запроса
      .catch((err) => err);
    context.updateRender()
  }

  const deleteToCart = async (id) => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/user/product/delete_cart/${id}`) // отправка запроса
      .catch((err) => err);
    context.updateRender()
  }

  const makeOrder = async () => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + "/api/user/product/make_order") // отправка запроса
      .catch((err) => err);
    context.updateRender()
  }

  React.useEffect(() => {
    axiosData()
  }, [context.render])

  return (
    <div>
      <h3 className={style["title"]}>Корзина</h3>
      {productsCart.map(el => {
        return (
          <div className={style["container-cart"]}>
            <div className={style["card"]}>
              <ProductItem
                id={el.product.id}
                idProduct={el.product.id}
                title={el.product.title}
                seller={el.product.seller}
                price={el.product.price}
                category={el.product.category}
                description={el.product.description}
                imageId={el.product.imageId}
              />
            </div>
            <button className={style["btn-add"]} onClick={() => addToCart(el.product.id)}>+</button>
            <button className={style["btn-delete"]} onClick={() => deleteToCart(el.id)}>Удалить из корзины</button>
          </div>
        )
      })}
      <button className={style["btn-make-order"]} onClick={makeOrder}>Заказать</button>
    </div>
  )
}
export default Cart