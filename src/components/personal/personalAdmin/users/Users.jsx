import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import UserEditItem from './userEditItem/UserEditItem';

const Users = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  const [users, setUsers] = React.useState([]) // state для хранения пользователей
  const [changeOn, setChangeOn] = React.useState([])

  const [loginError, setloginError] = useState('');  // ошибка в логине
  const [passwordError, setPasswordError] = useState('');  // ошибка в пароле
  const [idError, setIdError] = useState('');  // ошибка в id

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

  React.useEffect(() => {
    axiosData()
  }, [context.render])

  /** Получение данных из БД */
  const axiosData = async () => {

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    try {
      const usersData = await instance.get(urlAPI + "/api/admin/user/all")
      setUsers(usersData.data)
    } catch (error) {
      console.log("Ошибка получения всех пользователей")
    }

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
          context.setRender(context.render + 1)
        }
      })
      .catch((err) => err);
  }

  const clickChangeUser = (id) => {
    console.log(id)
    setChangeOn(id)
  }

  const btnDelete = async (id) => {
    setIdError('')

    let tokenBrowser = ""
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    await instance.get(urlAPI + `/api/admin/user/delete/${id}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'idError') {
              setIdError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          console.log("Ok")
          context.updateRender()
        }
      })
      .catch((err) => err);
  }


  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Роль</th>
            <th name="btnChange"></th>
            <th name="btnDelete"></th>
            <th name="divInputNew"></th>
          </tr>
          {users.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.login}</td>
                <td>{el.role}</td>
                <td><button onClick={() => clickChangeUser(el.id)}>Изменить</button></td>
                <td><button onClick={() => btnDelete(el.id)}>Удалить</button></td>
                <td>
                  <UserEditItem
                    id={el.id}
                    login={el.login}
                    role={el.role}
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
      <br /><br />
      <>
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
      </></>
  )
}
export default Users