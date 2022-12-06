import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../App';
import style from './tempMain.module.css';
import { urlAPI } from '../../global';

const TempMain = () => {
  const [products, setProducts] = React.useState([]) // state для хранения товаров
  const [firstRender, setFirstRender] = React.useState(true)
  const [categorySort, setCategorySort] = React.useState("Все категории")
  const [filterItems, setFilterItems] = React.useState([])
  const [search, setSearch] = React.useState('')

  // использование контекста
  const context = React.useContext(AppContext)

  // использование навигации - переброс на другой url
  let navigate = useNavigate()

  const onClickSignIn = () => {
    navigate('/registration');
  }

  const onClickLogIn = () => {
    navigate('/authorization');
  }

  /** Получение данных из БД */
  const axiosData = async () => {

    if (firstRender) {
      try {
        const productsData = await axios.get(urlAPI + "/api/product/all_products")
        setProducts(productsData.data)
        setFilterItems(productsData.data)
      } catch (error) {
        console.log("Ошибка получения всех продуктов")
      }
      setFirstRender(false)
    }

  }

  const sortDescendingPrice = () => {
    setFilterItems((prev) => prev.sort((a, b) => a.price > b.price ? 1 : -1))
    context.updateRender()
  }

  const sortAscendingPrice = () => {
    setFilterItems((prev) => prev.sort((a, b) => a.price < b.price ? 1 : -1))
    context.updateRender()
  }

  const sortCategory = () => {
    if (categorySort === "Все категории") {
      setFilterItems(products)
    }
    else {
      setFilterItems(products.filter((item) =>
        item.category.includes(categorySort)
      ))
    }
    if (search) {
      setFilterItems(
        filterItems.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase()))
      )
    }
  }

  const sortCategoryChange = (event) => {
    setCategorySort(event.target.value)
  }

  const onSearchInput = (inputValue) => {
    setSearch(inputValue.target.value)
  }

  const viewInfo = (id) => {
    context.setInfoId(id)
    navigate("/product/info")
  }

  React.useEffect(() => {
    axiosData()
    sortCategory()
  }, [categorySort, search])

  const debug = () => {
    console.log(categorySort)
  }

  return (
    <>
      <p>Главная страница</p>
      <p className={style["p-button"]} onClick={onClickLogIn}>Войти</p>
      <p className={style["p-button"]} onClick={onClickSignIn}>Зарегистрироваться</p>
      <br /><br />
      <input onChange={onSearchInput} placeholder="Поиск по товарам" /><br />
      <button onClick={debug}>debug</button>
      <button onClick={sortDescendingPrice}>Сначала дешевле</button>
      <button onClick={sortAscendingPrice}>Сначала дороже</button>
      <select value={categorySort} onChange={(event) => sortCategoryChange(event)}>
        <option value="Все категории">Все категории</option>
        <option value="Одежда">Одежда</option>
        <option value="Обувь">Обувь</option>
        <option value="Аксессуары">Аксессуары</option>
      </select>
      <br />
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
          </tr>
          {filterItems.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td onClick={() => viewInfo(el.id)}>{el.title}</td>
                <td>{el.seller}</td>
                <td>{el.price}</td>
                <td>{el.category}</td>
                <td>{el.description}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </>
  )
}

export default TempMain
