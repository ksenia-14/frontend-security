import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import UserEditItem from './userEditItem/UserEditItem';
import style from './users.module.css';
import UserAddItem from './userAddItem/UserAddItem';

const Users = () => {
  // использование контекста
  const context = React.useContext(AppContext)

  const [users, setUsers] = React.useState([]) // state для хранения пользователей
  const [changeOn, setChangeOn] = React.useState([])

  const [loginError, setloginError] = useState('');  // ошибка в логине
  const [passwordError, setPasswordError] = useState('');  // ошибка в пароле
  const [idError, setIdError] = useState('');  // ошибка в id

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
      setUsers((prev) => prev.sort((a, b) => a.id > b.id ? 1 : -1))
    } catch (error) {
      console.log("Ошибка получения всех пользователей")
    }
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
            <th name="divInputNew" className={style["hide-column"]}></th>
          </tr>
          {users.map(el => {
            return (
              <tr>
                <td>{el.id}</td>
                <td>{el.login}</td>
                <td>{el.role}</td>
                <td><button onClick={() => clickChangeUser(el.id)}>Изменить</button></td>
                <td><button onClick={() => btnDelete(el.id)}>Удалить</button></td>
                <td className={style["hide-column"]}>
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
      <UserAddItem/>
    </>
  )
}
export default Users