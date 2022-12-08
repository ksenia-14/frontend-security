import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';
import { OrderContext } from '../Orders';

const OrderEditItem = (props) => {
  const [stateOrder, setStateOrder] = React.useState('В обработке')

  const context = React.useContext(AppContext)
  const contextOrder = React.useContext(OrderContext)

  const onInputChange = (e) => {
    setStateOrder(e.target.value)
  }

  const btnChangeState = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      await instance.post(urlAPI + "/api/admin/order/change_state", 
      {number: props.numberOrder, state: stateOrder})
    } catch (error) {
      console.log("Ошибка изменения статуса заказа")
    }

    contextOrder.setFirstRenderOrder(true)
    context.updateRender()
  }


  return (
    <>
      <select value={stateOrder}
        onChange={(e) => onInputChange(e)}>
        <option>В обработке</option>
        <option>Отправлен</option>
        <option>Доставлен</option>
        <option>Отменен</option>
      </select>
      <button onClick={btnChangeState}>Изменить статус</button>
    </>
  )
}
export default OrderEditItem
