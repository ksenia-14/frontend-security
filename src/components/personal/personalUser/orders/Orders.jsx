import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../../../App';
import { urlAPI } from '../../../../global';
import style from './orders.module.css';
import ProductItem from '../../../productItem/ProductItem';

const Orders = () => {
  const context = React.useContext(AppContext)

  const [order, setOrder] = React.useState([])

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const orderData = await instance.get(urlAPI + "/api/user/product/orders")
      setOrder(orderData.data)
      setOrder((prev) => prev.sort((a, b) => a.id > b.id ? 1 : -1))
    } catch (error) {
      console.log("Ошибка получения заказов")
    }

  }



  React.useEffect(() => {
    axiosData()
  }, [context.render])

  return (
    <div className={style["container-orders"]}>
      <h3>Заказы</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Цена товара</th>
            <th>Сумма заказа</th>
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
                <td>{el.price}</td>
                <td>{el.number}</td>
                <td>{el.status}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>

    </div>
  )
}
export default Orders