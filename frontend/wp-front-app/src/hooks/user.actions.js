import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import axiosService from '../helpers/axios';

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8000";
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
          access: data.token.access,
          refresh: data.token.refresh,
          user: data.user,
        }),
    );
  }

  function register(data) {
    return axios.post(`${baseURL}/account/register/`, data).then((res) => {
      setUserData(res.data);
      navigate('/');
    });
  }

  function login(data) {
    return axios.post(`${baseURL}/account/login/`, data).then((res) => {
      setUserData(res.data);
      navigate('/');
    });
  }

  function logout() {
    localStorage.removeItem('auth');
    navigate('/');
  }

  function edit(data, userId) {
    return axiosService.patch(`${baseURL}//${userId}/`,
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
