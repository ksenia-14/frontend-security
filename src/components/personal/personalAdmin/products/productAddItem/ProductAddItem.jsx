import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';

const ProductAddItem = (props) => {
  const context = React.useContext(AppContext)

  const [titleError, setTitleError] = useState('')
  const [sellerError, setSellerError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [categoryError, setCategoryError] = useState('')

  // state для продукта
  const [product, setProduct] = useState({
    title: "",
    seller: "",
    price: 0,
    category: "Одежда",
    description: ""
  })

  // объект пользователя с логином и паролем
  const { title, seller, price, category, description } = product

  // при изменении в полях логина и пароля изменяются поля в объекте
  const onInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  /** Добавить товар */
  const btnAdd = async () => {
    setTitleError('') // обнуление полей ошибок
    setSellerError('')
    setPriceError('')

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.post(urlAPI + "/api/admin/product/add", product) // отправка запроса
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'title') {
              setTitleError(fieldError.message);
            }
            if (fieldError.field === 'seller') {
              setSellerError(fieldError.message);
            }
            if (fieldError.field === 'price') {
              setPriceError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          context.updateRender()
        }
      })
      .catch((err) => err);

    context.updateRender()
  }

  return (
    <div>
      <input
        name="title"
        placeholder='Название'
        value={title}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <input
        name="seller"
        placeholder='Продавец'
        value={seller}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <input
        type="number"
        name="price"
        placeholder='Цена'
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
        placeholder='Описание'
        value={description}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <button onClick={btnAdd}>Добавить</button><br />
    </div>
  )
}

export default ProductAddItem