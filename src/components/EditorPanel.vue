<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'

// 使用 Composable 共享状态
const { isControlPanelOpen, toggleControlPanel } = useUIState()
</script>

<template>
  <!--控制面板-->
  <div
    :class="['offcanvas', 'offcanvas-responsive-position', { show: isControlPanelOpen }]"
    tabindex="-1"
    id="infoOffcanvas"
    aria-labelledby="infoOffcanvasLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="infoOffcanvasLabel">控制面板</h5>
      <button
        type="button"
        class="btn-close text-reset"
        @click="toggleControlPanel"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <h6>What is Lorem Ipsum?</h6>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
      <h4>Where does it come from?</h4>
      <p>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
        of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
        a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the
        word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from
        sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
        Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very
        popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
        amet..", comes from a line in section 1.10.32.
      </p>
      <p>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
        interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are
        also reproduced in their exact original form, accompanied by English versions from the 1914
        translation by H. Rackham.
      </p>
      <h1>Why do we use it?</h1>
      <p>
        It is a long established fact that a reader will be distracted by the readable content of a
        page when looking at its layout. The point of using Lorem Ipsum is that it has a
        more-or-less normal distribution of letters, as opposed to using 'Content here, content
        here', making it look like readable English. Many desktop publishing packages and web page
        editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will
        uncover many web sites still in their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and the like).
      </p>
      <h2>Where can I get some?</h2>
      <p>
        There are many variations of passages of Lorem Ipsum available, but the majority have
        suffered alteration in some form, by injected humour, or randomised words which don't look
        even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be
        sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum
        generators on the Internet tend to repeat predefined chunks as necessary, making this the
        first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined
        with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        The generated Lorem Ipsum is therefore always free from repetition, injected humour, or
        non-characteristic words etc.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* OffCanvas 控制面板 */
/* 窄屏幕 底部弹出 */
.offcanvas-responsive-position {
  /* 强制设置为底部弹出 */
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  height: auto;
  max-height: 50vh; /* 限制高度，只占屏幕的一半 */
  width: 100vw;
  transform: translateY(100%);
}

/* 宽屏幕 大于等于 Bootstrap 的 lg 断点 */
/* 强制设置为右侧弹出 */
@media (min-width: 992px) {
  .offcanvas-responsive-position {
    top: 0;
    right: 0;
    bottom: 0;
    left: auto;
    width: 400px; /* 固定的右侧面板宽度 */
    height: 100vh;
    max-height: 100vh;
    transform: translateX(100%);
  }

  /* 悬浮按钮位置调整 */
  .overlay-button-position {
    right: 420px; /* 宽屏时，将按钮移到面板左边一点 */
  }
}

/* 窄屏 悬浮按钮定位 */
/* 如果按钮定位在右侧，它会和底部的 Offcanvas 错开 */
.overlay-button-position {
  position: absolute;
  top: 20px;
  right: 20px; /* 窄屏时在右上角 */
  z-index: 10;
}

/* 当面板展开时，覆盖 transform 实现滑出效果 */
.offcanvas-responsive-position.show {
  transform: none; /* 移除 transform，使其完全滑出 */
}

.offcanvas {
  /* 半透明度背景 */
  background-color: rgba(255, 255, 255, 0.5);
  /* 背景毛玻璃效果 */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px); /* 兼容性 */
}

/* 滚动条样式 */
.offcanvas-body {
  /* 滚动条整体 */
  &::-webkit-scrollbar {
    width: 8px; /* 垂直滚动条的宽度 */
    height: 15px; /* 水平滚动条的高度 */
    background-color: transparent; /* 背景透明 */
  }

  /* 滚动条轨道 (背景) */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 滚动条滑块 (拖动手柄) */
  &::-webkit-scrollbar-thumb {
    background-color: #a6a6a6; /* 深灰色滑块 */
    border-radius: 3em; /* 圆角 */
  }

  /* 滑块悬停时的样式 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #666666; /* 悬停时颜色变深 */
  }
}
</style>
