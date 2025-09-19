import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/features/auth/authSlice";

import React from 'react'

const RequireAuth = () => {

  const dispatch = useDispatch()
  const stateToken = selectCurrentToken()
  const storageAuth = JSON.parse(localStorage.getItem('auth'))
  console.log('useer !!!', storageAuth)

  const token = storageAuth?.jwt
  console.log('token !!!', token)


  return (
    token
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location.pathname }} replace />
  )
}

export default RequireAuth