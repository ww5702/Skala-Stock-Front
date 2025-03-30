<template>
    <div>
      <h2>주식 등록</h2>
      <form @submit.prevent="registerStock">
        <label for="name">주식명:</label>
        <input type="text" id="name" v-model="name" required />
  
        <label for="price">가격:</label>
        <input type="number" id="price" v-model="price" required />
  
        <button type="submit">등록</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
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
          const response = await axios.post('http://localhost:8080/api/stocks', {
            name: this.name,
            price: this.price,
          })
          this.message = `등록 성공: ${response.data.name}`
          this.name = ''
          this.price = 0
        } catch (error) {
          this.message = error.response?.data?.message || '등록 실패'
        }
      },
    },
  }
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 300px;
  }
  </style>
  