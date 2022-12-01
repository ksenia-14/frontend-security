import React from 'react';
import axios from 'axios';


const getToken = () => {
  return localStorage.getItem('JSESSIONID'); // чтение из браузера
}

export const userLogin = (authRequest) => {
  return axios({
    'method': 'POST',
    'url': `${process.env.hostUrl || 'http://localhost:8081'}/api/login`,
    'data': authRequest
  })
}

export const fetchUserData = (authRequest) => {
  return axios({
    method: 'GET',
    url: `${process.env.hostUrl || 'http://localhost:8081'}/api/userinfo`,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  })
}