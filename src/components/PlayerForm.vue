<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 사용자 아이디와 비밀번호를 입력받기 위한 반응형 변수 선언
const id = ref('')
const password = ref('') // ← 비밀번호 필드 추가
const money = ref(1000000) // 초기값

// 사용자 등록 요청 함수
const registerPlayer = async () => {
  try {
    // 입력된 id와 password를 함께 POST 요청으로 보냄
    await axios.post('/api/players', {
      id: id.value,
      password: password.value,
      money: money.value
    })
    alert('사용자 등록 성공')
  } catch (error) {
    alert('등록 실패: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<template>
  <div>
    <h2>사용자 등록</h2>
    <form @submit.prevent="registerPlayer">
      <div>
        <label for="id">아이디:</label>
        <input id="id" v-model="id" required />
      </div>
      <div>
        <label for="password">비밀번호:</label> <!-- 비밀번호 입력 필드 -->
        <input id="password" v-model="password" type="password" required />
      </div>
      <div>
        <label for="money">초기 자산:</label>
        <input id="money" type="number" v-model="money" required />
      </div>
      <button type="submit">등록</button>
    </form>
  </div>
</template>
