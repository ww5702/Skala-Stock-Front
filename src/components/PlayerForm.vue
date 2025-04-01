<script setup>
import { ref } from 'vue'
import axios from 'axios'

const id = ref('')
const password = ref('')
const money = ref()

const registerPlayer = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/players`, {
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
  <div class="form-wrapper">
    <h2 class="form-title">📝 사용자 등록</h2>
    <form @submit.prevent="registerPlayer" class="form-box">
      <div class="form-group">
        <label for="id">아이디:</label>
        <input id="id" v-model="id" required />
      </div>
      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <div class="form-group">
        <label for="money">초기 자산:</label>
        <input id="money" type="number" v-model="money" required />
      </div>
      <button type="submit" class="submit-btn">등록</button>
    </form>
  </div>
</template>

<style scoped>
.form-wrapper {
  padding: 4rem 1rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9f9f9, #e0ecff);
  text-align: center;
}

.form-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2rem;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-box {
  max-width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #34495e;
}
</style>
