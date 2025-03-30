<template>
    <div>
      <h1>📈 전체 주식 목록</h1>
      <ul>
        <li v-for="stock in stocks" :key="stock.name">
          {{ stock.name }} - {{ stock.price }}원
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const stocks = ref([])
  
  onMounted(async () => {
    const res = await axios.get('http://localhost:8080/api/stocks')
    stocks.value = res.data
  })
  </script>
  