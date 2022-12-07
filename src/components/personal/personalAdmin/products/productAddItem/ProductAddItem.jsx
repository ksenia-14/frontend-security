import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';
import style from './productAddItem.module.css';

const ProductAddItem = (props) => {
  const context = React.useContext(AppContext)

  const [titleError, setTitleError] = useState('')
  const [sellerError, setSellerError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [selectedFile, setSelectedFile] = React.useState(null);

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

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  /** Добавить товар */
  const btnAdd = async (event) => {
    event.preventDefault()
    setTitleError('') // обнуление полей ошибок
    setSellerError('')
    setPriceError('')

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    formData.append("product", JSON.stringify(product));

    await instance({
      method: "post",
      url: urlAPI + "/api/admin/product/add",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }) // отправка запроса
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
    <div className={style["main-container-add"]}>
      <h3>Добавить товар</h3>
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
      <div>
        <span>Загрузить картинку </span>
        <input type="file" name="file" onChange={handleFileSelect} />
      </div>
      <button onClick={btnAdd}>Добавить</button><br />
    </div>
  )
}

export default ProductAddItem