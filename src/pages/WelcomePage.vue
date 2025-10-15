<template>
  <div class="d-flex align-items-center text-bg-dark min-vh-100">
    <div class="cover-container w-100 p-3 mx-auto text-center">
      <h1>欢迎使用 DeskAR</h1>

      <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
        <button
          class="btn btn-lg btn-light fw-bold border-white bg-white"
          @click="$router.push('/main')"
        >
          创建新布局
        </button>

        <button class="btn btn-lg btn-outline-light fw-bold" @click="$router.push('/main')">
          从文件打开
        </button>
      </div>
    </div>
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
.cover-container {
  max-width: 42em;
}
.btn-light,
.btn-light:hover,
.btn-light:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
}
</style>
