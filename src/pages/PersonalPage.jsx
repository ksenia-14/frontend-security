import React from 'react';
import PersonalArea from "../components/personal/PersonalArea"
import { AppContext } from "../App"
import PersonalAdmin from '../components/personal/personalAdmin/PersonalAdmin';
import PersonalUser from '../components/personal/personalUser/PersonalUser';
import PersonalSeller from '../components/personal/personalSeller/PersonalSeller';

const PersonalPage = () => {
  // state от зацикленности React.useEffect
  const [value, setValue] = React.useState('');
  // state для хранения состояния загрузки
  const [loading, setLoading] = React.useState(true)
  //  state для хранения возвращаемого компонента
  const [obj, setObg] = React.useState()

  // использование контекста
  const context = React.useContext(AppContext)

  const renderPage = async () => {
    await context.isAuthorization()
    const role = await context.getRole()
    if (role === "ROLE_ADMIN") {
      setObg (<PersonalAdmin />)
    } else if (role === "ROLE_USER") {
      setObg (<PersonalUser />)
    } else if (role === "ROLE_SELLER") {
      setObg (<PersonalSeller />)
    } else {
      setObg (<>Ошибка авторизации</>)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    renderPage()
  }, [value])

  return (
    <>
    {
      loading ?
      <>Загрузка...</>
      :
      <>{obj}</>
    }
    </>
  )
}

export default PersonalPage