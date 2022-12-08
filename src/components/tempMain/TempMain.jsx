import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { AppContext } from '../../App';
import style from './tempMain.module.css';
import { urlAPI } from '../../global';
import ProductItem from '../productItem/ProductItem';

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
      <div className={style["container-header"]}>
        <p>Главная страница</p>
        <div className={style["p-button"]} onClick={onClickLogIn}>Войти</div>
        <div className={style["p-button"]} onClick={onClickSignIn}>Зарегистрироваться</div>
      </div>
      <br /><br />

      <div className={style["container-products-filter"]}>
        <input onChange={onSearchInput} placeholder="Поиск по товарам" /><br />
        <button onClick={sortDescendingPrice}>Сначала дешевле</button>
        <button onClick={sortAscendingPrice}>Сначала дороже</button>
        <select value={categorySort} onChange={(event) => sortCategoryChange(event)}>
          <option value="Все категории">Все категории</option>
          <option value="Футболки">Футболки</option>
          <option value="Толстовки">Толстовки</option>
          <option value="Обувь">Обувь</option>
        </select>
        <br />

        <div className={style["container-products"]}>
          {filterItems.map(el => {
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
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TempMain
