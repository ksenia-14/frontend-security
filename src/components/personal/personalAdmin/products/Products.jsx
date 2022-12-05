import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import ProductAddItem from './productAddItem/ProductAddItem';
import ProductEditItem from './productEditItem/ProductEditItem';

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
                <td><button onClick={() => clickChangeProduct(el.id)}>Изменить</button></td>
                <td><button onClick={() => btnDelete(el.id)}>Удалить</button></td>
                <td>
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
                </td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <ProductAddItem />
    </>
  )
}
export default Products