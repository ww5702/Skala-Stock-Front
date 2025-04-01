<template>
  <div class="form-wrapper">
    <h2 class="form-title">🏢 주식 등록</h2>
    <form @submit.prevent="registerStock" class="form-box">
      <div class="form-group">
        <label for="name">주식명:</label>
        <input type="text" id="name" v-model="name" required />
      </div>

      <div class="form-group">
        <label for="price">가격:</label>
        <input type="number" id="price" v-model="price" required />
      </div>

      <button type="submit" class="submit-btn">등록</button>
    </form>

    <p v-if="message" class="result-message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StockForm',
  data() {
    return {
      name: '',
      price: 0,
      message: '',
    }
  },
  methods: {
    async registerStock() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/stocks`, {
          name: this.name,
          price: this.price,
        })
        this.message = `✅ 등록 성공: ${response.data.name}`
        this.name = ''
        this.price = 0
      } catch (error) {
        this.message = `❌ ${error.response?.data?.message || '등록 실패'}`
      }
    },
  },
}
</script>

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

.result-message {
  margin-top: 1rem;
  font-weight: bold;
  color: #2c3e50;
}
</style>
