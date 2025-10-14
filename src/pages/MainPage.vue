<template>
  <div class="welcome">
    <h1>DeskAR场景</h1>
    <button @click="$router.push('/preview')">进入预览页面</button>
    <button @click="$router.push('/')">返回欢迎页面</button>
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
