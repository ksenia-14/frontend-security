import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { base64StringToBlob } from 'blob-util';
import { urlAPI } from '../../global';
import { AppContext } from '../../App';
import style from './productItem.module.css';

const ProductItem = (props) => {
  const [image, setImage] = React.useState(null);
  const [imgId, setImgId] = React.useState(null)

  let navigate = useNavigate()

  const context = React.useContext(AppContext)

  React.useEffect(() => {
    getImage()
  }, [props.imageId, imgId])
  
  const getImage = async () => {
    setImgId(props.imageId)

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

  const viewInfo = () => {
    context.setInfoProductId(props.id)
    navigate('/product/info')
  }

  return (
    <div onClick={viewInfo} className={style["container-card"]}>
      <div className={style["container-img"]}>
        {
          image ?
          <img src={image}></img>
          :
          <img src="./img/no-image.jpeg" alt="no image"></img>
        }
        
      </div>
      <div>
        <span>ID товара: </span>
        {props.id}
      </div>
      <div>
        <span>Наименование: </span>
        {props.title}
      </div>
      <div>
        <span>Продавец: </span>{props.seller}</div>
      <div>
        <span>Цена: </span>
        {props.price}
      </div>
      <div>
        <span>Категория: </span>
        {props.category}
      </div>
      <div>
        <span>Описание: </span>
        {props.description}
      </div>
    </div>
  )
}
export default ProductItem