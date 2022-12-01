import React from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css';
import RegistrationForm from './components/registrationForm/RegistrationForm';
import AuthorizationForm from './components/authorizationForm/AuthorizationForm';
import PersonalArea from './components/personalArea/PersonalArea';
import TempMain from './components/tempMain/TempMain';

// контекст
export const AppContext = React.createContext({})

function App() {
  // state для хранения пароля
  const [passwordUser, setPasswordUser] = React.useState('')
  // state для хранения логина
  const [loginUser, setLoginUser] = React.useState('')

  return (
    <AppContext.Provider value={{
      passwordUser, setPasswordUser,
      loginUser, setLoginUser
    }}>
      <Routes>
        <Route
          path='/authorization'
          element={
            <AuthorizationForm />
          }
        />
        <Route
          path='/registration'
          element={
            <RegistrationForm />
          }
        />
        <Route
          path='/'
          element={
            <TempMain />
          }
        />
        <Route
          path='/personal'
          element={
            <PersonalArea />
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
