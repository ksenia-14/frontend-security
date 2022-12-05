import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';
import style from './productEditItem.module.css';

const ProductEditItem = (props) => {
  const context = React.useContext(AppContext)

  const [titleError, setTitleError] = useState('')
  const [sellerError, setSellerError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [categoryError, setCategoryError] = useState('')

  // state для продукта
  const [product, setProduct] = useState({
    title: "",
    seller: "",
    price: "",
    category: "Одежда",
    description: ""
  })

  // объект пользователя с логином и паролем
  const { title, seller, price, category, description } = product

  // при изменении в полях логина и пароля изменяются поля в объекте
  const onInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const btnOkChanges = async (e) => {
    e.preventDefault();
    setTitleError('') // обнуление полей ошибок
    setSellerError('')
    setPriceError('')

    let tokenBrowser = ""
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.post(urlAPI + `/api/admin/product/edit/${props.id}`, product) // отправка запроса
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'loginError') {
              setTitleError(fieldError.message);
            }
            if (fieldError.field === 'roleError') {
              setSellerError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          props.setChangeOn(false)
          console.log("Ok")
          context.updateRender()
        }
      })
      .catch((err) => err);
  }

  React.useEffect(() => {
    setProduct({
      title: props.title,
      seller: props.seller,
      price: props.price,
      category: props.category,
      description: props.description
    })
  }, [context.render])

  return (
    <div className={(props.changeOn == props.id) ?
      style['change-product-on']
      :
      style['change-product-off']}>
      <input
        name="title"
        value={title}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <input
        name="seller"
        value={seller}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <input
        type="number"
        name="price"
        value={price}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <select name="category"
        value={category}
        onChange={(e) => onInputChange(e)}>
        <option value="Одежда">Одежда</option>
        <option value="Обувь">Обувь</option>
        <option value="Аксессуары">Аксессуары</option>
      </select>
      <input
        name="description"
        value={description}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <button onClick={btnOkChanges}>OK</button><br />
      <span style={{ color: 'red', fontSize: '12px' }}>
        {titleError} {sellerError} {priceError} {categoryError}
      </span><br />
    </div>
  )
}
export default ProductEditItem