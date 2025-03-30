<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/stocks">주식 목록</RouterLink>
      <RouterLink to="/players">플레이어 목록</RouterLink>
      <RouterLink to="/register-player">사용자 등록</RouterLink>
      <RouterLink to="/register-stock">주식 등록</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  text-align: center;
  padding: 1rem;
  background: #f1f1f1;
}

nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
