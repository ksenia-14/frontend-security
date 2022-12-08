import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../../../global';
import { AppContext } from '../../../../App';
import style from './openElement.module.css';

const OpenElement = (props) => {
  return (
    <div className={style["container-open"]}>
      <span>{props.title}</span>
      <img src='./img/caret-down.svg'></img>
    </div>
  )
}
export default OpenElement