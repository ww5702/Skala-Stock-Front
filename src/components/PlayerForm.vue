<template>
    <div>
      <h2>사용자 등록</h2>
      <form @submit.prevent="registerPlayer">
        <label for="id">아이디:</label>
        <input type="text" id="id" v-model="playerId" required />
  
        <label for="money">초기 자산:</label>
        <input type="number" id="money" v-model="money" required />
  
        <button type="submit">등록</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'PlayerForm',
    data() {
      return {
        playerId: '',
        money: 0,
        message: '',
      }
    },
    methods: {
      async registerPlayer() {
        try {
          const response = await axios.post('http://localhost:8080/api/players', {
            id: this.playerId,
            money: this.money,
          })
          this.message = `사용자 등록 성공: ${response.data.id}`
          this.playerId = ''
          this.money = 0
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
  