import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import  PageNotFound from './pages/PageNotFound';
import Login from './auth/Login/Login';
import Register from './auth/Register/Register';
import Panel from './pages/Panel';
import 'react-toastify/dist/ReactToastify.css';
import TokenExpired from './auth/TokenExpired/TokenExpired';
import ResetPassword from './auth/ForgetPassword/ResetPassword';

function App() {
  return <React.Fragment>
    <Routes>
      <Route path='/' element={<Suspense fallback={<></>}><Login /></Suspense>} />
      <Route path='/login' element={<Suspense fallback={<></>}><Login /></Suspense>} />
      <Route path='/panel/*' element={<Suspense fallback={<></>}><Panel /></Suspense>} />
      <Route path='/register' element={<Suspense fallback={<></>}><Register /></Suspense>} />
      <Route path='/token-expired' element={<Suspense fallback={<></>}><TokenExpired /></Suspense>} />
      <Route path='/reset-password' element={<Suspense fallback={<></>}><ResetPassword /></Suspense>} />
      <Route path='/*' element={<Suspense fallback={<></>}><PageNotFound /></Suspense>} />
    </Routes>
  </React.Fragment>
}

export default App;
