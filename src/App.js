import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { urlAPI } from './global';
import './App.css';
import AuthorizationPage from './pages/AuthorizationPage';
import RegistrationPage from './pages/RegistrationPage';
import PersonalPage from './pages/PersonalPage';
import MainPage from './pages/MainPage';
import ProductInfo from './components/productInfo/ProductInfo';
import ImageUploader from './components/imageUploader/ImageUploader';

// контекст
export const AppContext = React.createContext({})

function App() {
  const [passwordUser, setPasswordUser] = React.useState('')  // state для хранения пароля
  const [loginUser, setLoginUser] = React.useState('')  // state для хранения логина
  const [render, setRender] = React.useState(0);  // state для обновления рендера
  const [infoId, setInfoId] = React.useState('')

  let navigate = useNavigate()  // использование навигации - переброс на другой url

  /** Проверка авторизации */
  const isAuthorization = async () => {

    let tokenBrowser = ""
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }

    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;
    try {
      let tokenSpring
      await instance.get(urlAPI + "/api/authentication/token")
        .then((response) => response.data)
        .then((data) => { tokenSpring = data.value })
      if (tokenBrowser != tokenSpring)
        navigate('/authorization')
    } catch (error) {
      console.log("Ошибка получения токена")
      navigate('/authorization')
    }

  }

  /** Получение роли пользователя */
  const getRole = async () => {
    try {
      let tokenBrowser = localStorage.getItem('JSESSIONID')
      let instance = axios.create();
      instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;
      let role
      await instance.get(urlAPI + "/api/authentication/role")
        .then((response) => response.data)
        .then((data) => { role = data.value })
      return role
    } catch (error) {
      console.log("Ошибка получения роли пользователя")
      navigate('/authorization')
    }
  }

  const updateRender = () => {
    setRender(render + 1)
  }

  React.useEffect(() => { }, [render])

  return (
    <AppContext.Provider value={{
      passwordUser, setPasswordUser,
      loginUser, setLoginUser,
      infoId, setInfoId,
      isAuthorization,
      getRole,
      render, setRender, updateRender
    }}>
      <Routes>
        <Route
          path='/authorization'
          element={
            <AuthorizationPage />
          }
        />
        <Route
          path='/registration'
          element={
            <RegistrationPage />
          }
        />
        <Route
          path='/'
          element={
            <MainPage />
            // <ImageUploader/>
          }
        />
        <Route
          path='/personal'
          element={
            <PersonalPage />
          }
        />
        <Route
          path='/product/info'
          element={
            <ProductInfo />
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
