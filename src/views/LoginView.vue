<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const id = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/player/login`, {
      id: id.value,
      password: password.value
    })
    localStorage.setItem('playerId', id.value) // ← 로그인 성공 시 저장
    alert(res.data) // 성공 메시지
    router.push('/') // 홈으로 이동
  } catch (error) {
    alert('로그인 실패: ' + error.response?.data?.message || error.message)
  }
}
</script>

<template>
  <div>
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <div>
        <label for="id">아이디:</label>
        <input id="id" v-model="id" required />
      </div>
      <div>
        <label for="password">비밀번호:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>
