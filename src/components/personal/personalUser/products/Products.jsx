import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';

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
                <td><button onClick={() => addToCart(el.id)}>Добавить в корзину</button></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <h3>Корзина</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Продавец</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Описание</th>
            <th></th>
            <th></th>
          </tr>
          {productsCart.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.product.id}</td>
                <td>{el.product.title}</td>
                <td>{el.product.seller}</td>
                <td>{el.product.price}</td>
                <td>{el.product.category}</td>
                <td>{el.product.description}</td>
                <td><button onClick={() => addToCart(el.id)}>+</button></td>
                <td><button onClick={() => deleteToCart(el.id)}>Удалить из корзины</button></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <button onClick={makeOrder}>Заказать</button>
      <br />
      <h3>Заказы</h3>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>ID товара</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Номер заказа</th>
            <th>Статус</th>
          </tr>
          {order.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.product.id}</td>
                <td>{el.product.title}</td>
                <td>{el.product.price}</td>
                <td>{el.number}</td>
                <td>{el.status}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </>
  )
}
export default Products