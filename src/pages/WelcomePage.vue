<template>
  <div class="welcome">
    <h1>欢迎使用 DeskAR</h1>
    <button @click="$router.push('/main')">进入主页面</button>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
