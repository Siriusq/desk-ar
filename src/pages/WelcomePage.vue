<template>
  <div class="d-flex align-items-center text-bg-light min-vh-100">
    <div class="welcome-container w-100 p-3 mx-auto text-center">
      <h1 class="mb-4">欢迎使用 DeskAR</h1>

      <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
        <button class="btn btn-lg btn-primary fw-bold w-auto" @click="$router.push('/main')">
          <i class="bi bi-plus-square"></i>
          创建新布局
        </button>

        <button class="btn btn-lg btn-warning fw-bold w-auto" @click="$router.push('/main')">
          <i class="bi bi-file-earmark-arrow-up"></i>
          从文件打开
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  padding: 10px 20px;
}
.welcome-container {
  max-width: 32em;
}
</style>
