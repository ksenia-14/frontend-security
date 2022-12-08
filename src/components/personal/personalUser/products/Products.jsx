import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import style from './products.module.css';
import ProductItem from '../../../productItem/ProductItem';

const Products = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  let navigate = useNavigate()

  const [products, setProducts] = React.useState([]) // state для хранения товаров
  const [productsCart, setProductsCart] = React.useState([])
  const [order, setOrder] = React.useState([])
  const [firstRender, setFirstRender] = React.useState(true)
  const [categorySort, setCategorySort] = React.useState("Все категории")
  const [filterItems, setFilterItems] = React.useState([])
  const [search, setSearch] = React.useState('')

  // state для продукта
  const [product, setProduct] = useState({
    title: "",
    seller: "",
    price: "",
    category: "",
    description: ""
  })

  // объект продукта
  const { title, seller, price, category, description } = product

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    if (firstRender) {
      try {
        const productsData = await instance.get(urlAPI + "/api/product/all_products")
        setProducts(productsData.data)
        setProducts((prev) => prev.sort((a, b) => a.id > b.id ? 1 : -1))
        setFilterItems(productsData.data)
      } catch (error) {
        console.log("Ошибка получения всех продуктов")
      }
      setFirstRender(false)
    }

    try {
      const productsCartData = await instance.get(urlAPI + "/api/user/product/cart")
      setProductsCart(productsCartData.data)
    } catch (error) {
      console.log("Ошибка получения продуктов в корзине")
    }

    try {
      const orderData = await instance.get(urlAPI + "/api/user/product/orders")
      setOrder(orderData.data)
    } catch (error) {
      console.log("Ошибка получения заказов")
    }

  }

  const addToCart = async (id) => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/user/product/add_cart/${id}`) // отправка запроса
      .catch((err) => err);
    context.updateRender()
  }

  const deleteToCart = async (id) => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/user/product/delete_cart/${id}`) // отправка запроса
      .catch((err) => err);
    context.updateRender()
  }

  const makeOrder = async () => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + "/api/user/product/make_order") // отправка запроса
      .catch((err) => err);
    context.updateRender()
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
          item.title.slice(-4).toLowerCase().includes(search.toLowerCase()))
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
  }, [context.render, categorySort, search])

  const debug = () => {
    console.log(categorySort)
  }

  return (
    <>
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
                <button onClick={() => addToCart(el.id)}>Добавить в корзину</button>
              </div>
            )
          })}
        </div>
      </div>
      <br />
    </>
  )
}
export default Products