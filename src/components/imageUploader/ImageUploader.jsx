import React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import { urlAPI } from '../../global';
import { AppContext } from '../../App';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [image, setImage] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault()

    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    try {
      await instance({
        method: "post",
        url: urlAPI + "/api/file/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
    } catch (error) {
      console.log("Ошибка загрузки изображения")
    }
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const getImage = async () => {
    let tokenBrowser = localStorage.getItem('JSESSIONID')
    let instance = axios.create();
    instance.defaults.headers.common['Authorization'] = "Bearer " + tokenBrowser;

    const id = "b6b9970a-5259-4d61-b8e6-3e51c14e77b9"
    let imageBlob
    try {
      imageBlob = (await instance({
        method: "get",
        url: urlAPI + `/api/file/get/${id}`,
        responseType: 'blob'
      })).data
      setImage(URL.createObjectURL(imageBlob))
    } catch (error) {
      console.log("Ошибка загрузки изображения")
    }
  }

  React.useEffect(() => { }, [image])

  return (
    <>
      <div>
        <label>Upload Your File </label>
        <input type="file" name="file" onChange={handleFileSelect} />
        <button onClick={handleSubmit}>Отправить</button>
        <button onClick={getImage}>Получить</button>
        <div><img src={image}></img></div>
      </div>
    </>
  )
}
export default ImageUploader