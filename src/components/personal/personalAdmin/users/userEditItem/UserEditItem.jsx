import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../../global';
import { AppContext } from '../../../../../App';
import style from './userEditItem.module.css';

const UserEditItem = (props) => {
  const [loginError, setloginError] = useState('');  // ошибка в логине
  const [roleError, setRoleError] = useState('');  // ошибка в пароле

  // использование контекста
  const context = React.useContext(AppContext)

  // state для пользователя
  const [user, setUser] = useState({ login: "", role: "" })
  // объект пользователя с логином и паролем
  const { login, role } = user

  // при изменении в полях логина и пароля изменяются поля в объекте
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  /** Редактирование пользователя */
  const btnOkChanges = async (e) => {

    e.preventDefault();
    setloginError('') // обнуление полей ошибок
    setRoleError('')

    let tokenBrowser = ""
    if (localStorage.getItem('JSESSIONID')) {
      tokenBrowser = localStorage.getItem('JSESSIONID')
    }
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;


    await instance.post(urlAPI + `/api/admin/user/edit/${props.id}`, user) // отправка запроса
      .then((response) => response.data)
      .then((data) => {
        if (data.fieldErrors) { // если есть ошибки
          data.fieldErrors.forEach(fieldError => {
            if (fieldError.field === 'loginError') {
              setloginError(fieldError.message);
            }
            if (fieldError.field === 'roleError') {
              setRoleError(fieldError.message);
            }
          });
        } else { // если нет ошибок
          props.setChangeOn(false)
          console.log("Ok")
          context.updateRender()
        }
      })
      .catch((err) => err);
  }

  React.useEffect(() => {
    setUser({ login: props.login, role: props.role })
  }, [context.render])

  return (
    <div className={(props.changeOn == props.id) ?
      style['change-user-on']
      :
      style['change-user-off']}>
      <input
        name="login"
        placeholder='Новый логин'
        value={login}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <input
        name="role"
        placeholder='Новая роль'
        value={role}
        onChange={(e) => onInputChange(e)}
      >
      </input>
      <button onClick={btnOkChanges}>OK</button><br />
      {loginError ? <span style={{ color: 'red', fontSize: '12px' }}>{loginError}</span> : ''}<br />
      {roleError ? <span style={{ color: 'red', fontSize: '12px' }}>{roleError}</span> : ''}<br />
    </div>
  )
}

export default UserEditItem