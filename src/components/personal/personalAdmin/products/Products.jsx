import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { base64StringToBlob } from 'blob-util';
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import ProductAddItem from './productAddItem/ProductAddItem';
import ProductEditItem from './productEditItem/ProductEditItem';
import ProductItem from '../../../productItem/ProductItem';
import style from './products.module.css';

const Products = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  const [products, setProducts] = React.useState([]) // state для хранения товаров
  const [changeOn, setChangeOn] = React.useState([])

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const productsData = await instance.get(urlAPI + "/api/product/all_products")
      setProducts(productsData.data)
      setProducts((prev) => prev.sort((a, b) => a.id > b.id ? 1 : -1))
    } catch (error) {
      console.log("Ошибка получения всех продуктов")
    }

  }

  /** Удалить товар */
  const btnDelete = async (id) => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/admin/product/delete/${id}`) // отправка запроса
      .catch((err) => err);

    context.updateRender()
  }

  const clickChangeProduct = (id) => {
    console.log(id)
    setChangeOn(id)
  }

  React.useEffect(() => {
    axiosData()
  }, [context.render])

  return (
    <div className={style["container-products"]}>
      {products.map(el => {
        return (
          <div className={style["container-card-button"]}>
            <div className={style["card"]}>
              <ProductItem
                id={el.id}
                title={el.title}
                seller={el.seller}
                price={el.price}
                category={el.category}
                description={el.description}
                imageId={el.imageId}
              />
            </div>
            <button className={style["btn-change"]}
              onClick={() => clickChangeProduct(el.id)}>
              Изменить
            </button>
            <button className={style["btn-delete"]}
              onClick={() => btnDelete(el.id)}>
              Удалить
            </button>
            <div className={style["container-edit"]}>
              <ProductEditItem
                id={el.id}
                title={el.title}
                seller={el.seller}
                price={el.price}
                category={el.category}
                description={el.description}
                changeOn={changeOn}
                setChangeOn={setChangeOn}
              />
            </div>
          </div>
        )
      })}
      <div>
        <ProductAddItem />
      </div>
      

    </div>
  )
}
export default Products