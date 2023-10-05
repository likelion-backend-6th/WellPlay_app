import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import axiosService from '../helpers/axios';

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;
  return {
    login,
    register,
    logout,
    edit,
  };

  function setUserData(data) {
    localStorage.setItem(
        'auth',
        JSON.stringify({
          access: data.access,
          refresh: data.refresh,
          user: data.user,
        }),
    );
  }

  function register(data) {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      setUserData(res.data);
      navigate('/');
    });
  }

  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      setUserData(res.data);
      navigate('/');
    });
  }

  function logout() {
    localStorage.removeItem('auth');
    navigate('/login');
  }

  function edit(data, userId) {
    return axiosService.patch(`${baseURL}/user/${userId}/`,
        data, {
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
      // Registering the account in the store
      localStorage.setItem(
          'auth',
          JSON.stringify({
            access: getAccessToken(),
            refresh: getRefreshToken(),
            user: res.data,
          }),
      );
    });
  }

}

function getUser() {
  const auth = JSON.parse(localStorage.getItem('auth')) || null;
  if (auth) {
    return auth.user;
  } else {
    return null;
  }
}

// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth.access;
}

// Get the refresh token
function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth.refresh;
}

export {useUserActions, getUser, getAccessToken, getRefreshToken};
