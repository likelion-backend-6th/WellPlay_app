import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import axiosService from '../helpers/axios';
import {useEffect} from "react";

function useUserActions() {
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_API_URL;
    return {
        login,
        register,
        logout,
        edit,
        getProfile,
        getUserProfile,
        getFollowing,
        getFollower,
        updateUsernameLol,
        apiUsernameLol,
        apiUsernameLol,
    };

    function updateUsernameLol(data, axiosConfig) {
        return axiosService.post(`${baseURL}/account/LOLinfo/`, data, axiosConfig);
    }

    function apiUsernameLol(data, axiosConfig) {
        return axiosService.post(`${baseURL}/account/riot_summoner_info/`, data, axiosConfig);
    }

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

    function getProfile() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            // 액세스 토큰이 없으면 프로필 정보를 가져올 수 없음
            return Promise.reject('액세스 토큰이 없습니다.');
        }
        return axiosService.get(`${baseURL}/account/profile/current/`, {});
    }

    function getUserProfile(userId) {
        return axios.get(`${baseURL}/account/profile/${userId}/`, {});
    }

    function getFollowing() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            return Promise.reject('액세스 토큰이 없습니다.');
        }
        return axiosService.get(`${baseURL}/account/following/`, {});
    }

    function getFollower() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            return Promise.reject('액세스 토큰이 없습니다.');
        }
        return axiosService.get(`${baseURL}/account/follower/`, {});
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