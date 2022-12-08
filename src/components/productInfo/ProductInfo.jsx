import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { base64StringToBlob } from 'blob-util';
import { urlAPI } from '../../global';
import { AppContext } from '../../App';
import style from './productInfo.module.css';

const ProductInfo = (props) => {
  const [image, setImage] = React.useState(null);
  const [imgId, setImgId] = React.useState(null)
  const [product, setProduct] = React.useState([])

  const context = React.useContext(AppContext)

  /** Получение данных из БД */
  const axiosData = async () => {
    let id = context.infoProductId
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const productsData = await instance.get(urlAPI + `/api/product/get_product/${id}`)
      setProduct(productsData.data)
    } catch (error) {
      console.log("Ошибка получения всех продукта")
    }
  }


  const getImage = async () => {
    setImgId(product.imageId)

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    let imageBlob
    try {
      imageBlob = (await instance({
        method: "get",
        url: urlAPI + `/api/file/get/${imgId}`,
        responseType: 'blob'
      })).data
      setImage(URL.createObjectURL(imageBlob))
      context.updateRender()
    } catch (error) {
      console.log("Ошибка загрузки изображения")
    }
  }

  React.useEffect(() => {
    axiosData()
    getImage()
  }, [product.imageId, imgId])

  return (
    <div className={style["container-card"]}>
      <div className={style["container-img"]}>
        {
          image ?
            <img src={image}></img>
            :
            <img src="./img/no-image.jpeg" alt="no image"></img>
        }

      </div>
      <div className={style["container-text"]}>
        <div>
          <h3>{product.title}</h3>
        </div>
        <div>
          <span>Продавец: </span>{product.seller}</div>
        <div>
          <span>Цена: </span>
          {product.price}
        </div>
        <div>
          <span>Категория: </span>
          {product.category}
        </div>
        <div>
          <span>Описание: </span>
          {product.description}
        </div>
      </div>
    </div>
  )
}
export default ProductInfo