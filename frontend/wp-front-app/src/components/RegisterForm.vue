<template>
  <div>
    <h2>회원가입</h2>
    <form @submit.prevent="registerUser">
      <label for="user_id">유저 아이디</label>
      <input type="text" id="user_id" v-model="user_id" required>
      <label for="email">이메일</label>
      <input type="email" id="email" v-model="email" required>
      <label for="password">비밀번호</label>
      <input type="password" id="password" v-model="password" required>
      <button type="submit">가입하기</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import config from "../../config.js";

export default {
  data() {
    return {
      user_id: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post(`${config.serverUrl}/account/register/`, {
          user_id: this.user_id,
          email: this.email,
          password: this.password,
        });

        // 회원가입 성공 시 로그인 페이지로 이동 또는 다른 작업 수행
        console.log(response.data);
      } catch (error) {
        // 회원가입 실패 시 에러 처리
        console.error(error);
      }
    }
  },
};
</script>