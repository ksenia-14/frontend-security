import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';
import style from './userAddItem.module.css';

const UserAddItem = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  const [loginError, setloginError] = useState('');  // ошибка в логине
  const [passwordError, setPasswordError] = useState('');  // ошибка в пароле

  // state для пользователя
  const [user, setUser] = useState({
    login: "",
    password: ""
  })

  // объект пользователя с логином и паролем
  const { login, password } = user

  // при изменении в полях логина и пароля изменяются поля в объекте
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  /** Добавление пользователя */
  const addUser = async (e) => {
    e.preventDefault();
    setloginError('') // обнуление полей ошибок
    setPasswordError('')
    await axios.post(urlAPI + "/api/authentication/registration", user) // отправка запроса
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'login') {
              setloginError(fieldError.message);
            }
            if (fieldError.field === 'password') {
              setPasswordError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          user.login = ""
          user.password = ""
          context.updateRender()
        }
      })
      .catch((err) => err);
  }

  return (
    <div className={style["main-container-add"]}>
      <h3>Добавить пользователя</h3><br />
      <font>Login: </font>
      <input
        placeholder="Логин"
        id="login" name="login"
        value={login}
        onChange={(e) => onInputChange(e)}></input><br />
      {loginError ? <span style={{ color: 'red', fontSize: '12px' }}>{loginError}</span> : ''}<br />
      <font>Password: </font>
      <input type="password"
        placeholder="Пароль"
        id="password" name="password"
        value={password}
        onChange={(e) => onInputChange(e)}></input><br />
      {passwordError ? <span style={{ color: 'red', fontSize: '12px' }}>{passwordError}</span> : ''}<br />
      <button onClick={addUser}>Добавить</button>
    </div>
  )
}

export default UserAddItem