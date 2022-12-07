import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import OrderEditItem from './orderEditItem/OrderEditItem';
import style from './orders.module.css';

export const OrderContext = React.createContext({})

const Orders = (props) => {
  const [order, setOrder] = React.useState([])
  const [filterItems, setFilterItems] = React.useState([])
  const [search, setSearch] = React.useState('')
  const [firstRenderOrder, setFirstRenderOrder] = React.useState(true)

  // state для заказа
  const [orderInfo, setOrderInfo] = useState({
    state: "",
    number: ""
  })

  // объект пользователя с логином и паролем
  const { state, number } = orderInfo

  const context = React.useContext(AppContext)

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    if (firstRenderOrder) {
      try {
        const orderData = await instance.get(urlAPI + "/api/admin/order/get_all")
        setOrder(orderData.data)
        setOrder((prev) => prev.sort((a, b) => a.id > b.id ? 1 : -1))
        setFilterItems(orderData.data)
      } catch (error) {
        console.log("Ошибка получения заказов")
      }
      setFirstRenderOrder(false)
    }
  }

  const onSearchInput = (inputValue) => {
    setSearch(inputValue.target.value)
  }

  const filterSearch = () => {
    setFilterItems(
      order.filter((item) =>
        item.number.toLowerCase().includes(search.toLowerCase())))
  }

  React.useEffect(() => {
    axiosData()
    filterSearch()
  }, [context.render, search])

  return (
    <div className={style["container-order"]}>
      <p>Введите последние 4 цифры заказа</p>
      <input onChange={onSearchInput} placeholder="Поиск по заказам" /><br />
      <h3>Заказы</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>USER ID</th>
            <th>Логин</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Сумма заказа</th>
            <th>Номер заказа</th>
            <th>Статус</th>
            <th>Новый статус</th>
          </tr>
          {filterItems.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.person.id}</td>
                <td>{el.person.login}</td>
                <td>{el.product.id}</td>
                <td>{el.product.title}</td>
                <td>{el.product.price}</td>
                <td>{el.price}</td>
                <td>{el.number}</td>
                <td>{el.status}</td>
                <td>
                  <OrderContext.Provider value={{
                    firstRenderOrder, setFirstRenderOrder
                  }}>
                    <OrderEditItem
                      curState={el.status}
                      numberOrder={el.number}
                    />
                  </OrderContext.Provider>
                </td>
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
