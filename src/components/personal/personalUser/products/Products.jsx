import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';

const Products = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  const [products, setProducts] = React.useState([]) // state для хранения товаров
  const [productsCart, setProductsCart] = React.useState([])
  const [order, setOrder] = React.useState([])

  // state для продукта
  const [product, setProduct] = useState({
    title: "",
    seller: "",
    price: "",
    category: "",
    description: ""
  })

  // объект продукта
  const { title, seller, price, category, description } = product

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const productsData = await instance.get(urlAPI + "/api/product/all_products")
      setProducts(productsData.data)
    } catch (error) {
      console.log("Ошибка получения всех продуктов")
    }

    try {
      const productsCartData = await instance.get(urlAPI + "/api/user/product/cart")
      setProductsCart(productsCartData.data)
    } catch (error) {
      console.log("Ошибка получения продуктов в корзине")
    }

    try {
      const orderData = await instance.get(urlAPI + "/api/user/product/orders")
      setOrder(orderData.data)
    } catch (error) {
      console.log("Ошибка получения заказов")
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
    <>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Продавец</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Описание</th>
            <th></th>
            <th></th>
          </tr>
          {products.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.title}</td>
                <td>{el.seller}</td>
                <td>{el.price}</td>
                <td>{el.category}</td>
                <td>{el.description}</td>
                <td><button onClick={() => addToCart(el.id)}>Добавить в корзину</button></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <h3>Корзина</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Продавец</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Описание</th>
            <th></th>
            <th></th>
          </tr>
          {productsCart.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.product.id}</td>
                <td>{el.product.title}</td>
                <td>{el.product.seller}</td>
                <td>{el.product.price}</td>
                <td>{el.product.category}</td>
                <td>{el.product.description}</td>
                <td><button onClick={() => addToCart(el.id)}>+</button></td>
                <td><button onClick={() => deleteToCart(el.id)}>Удалить из корзины</button></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <button onClick={makeOrder}>Заказать</button>
      <br />
      <h3>Заказы</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Номер заказа</th>
            <th>Статус</th>
          </tr>
          {order.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.product.id}</td>
                <td>{el.product.title}</td>
                <td>{el.product.price}</td>
                <td>{el.number}</td>
                <td>{el.status}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </>
  )
}
export default Products