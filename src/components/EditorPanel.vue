<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

// 使用 Composable 共享状态
const { isControlPanelOpen, toggleControlPanel } = useUIState()

const { width } = useWindowSize()
// 定义宽屏断点 (Bootstrap lg 断点是 992px)
const LG_BREAKPOINT = 992

// 计算属性，决定 OffCanvas 的弹出位置
const placement = computed(() => {
  return width.value >= LG_BREAKPOINT ? 'end' : 'bottom'
})
</script>

<template>
  <!--控制面板-->
  <BOffcanvas
    :model-value="isControlPanelOpen"
    @update:model-value="toggleControlPanel"
    :placement="placement"
    id="controlOffcanvas"
    title="控制面板"
    no-backdrop
    no-close-on-backdrop
  >
    <div class="row g-2 mb-3">
      <div class="col-6 col-md-3">
        <BButton variant="primary" class="w-100" @click="$router.push('/')">
          <i class="bi bi-plus-lg" />
          添加
        </BButton>
      </div>

      <div class="col-6 col-md-3">
        <BButton variant="success" class="w-100" @click="$router.push('/preview')">
          <i class="bi bi-badge-ar" />
          预览
        </BButton>
      </div>

      <div class="col-6 col-md-3">
        <BButton variant="warning" class="w-100" @click="$router.push('/')">
          <i class="bi bi-save" />
          保存
        </BButton>
      </div>

      <div class="col-6 col-md-3">
        <BButton variant="danger" class="w-100" @click="$router.push('/')">
          <i class="bi bi-escape" />
          退出
        </BButton>
      </div>
    </div>

    <h6>What is Lorem Ipsum?</h6>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
      was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
      passages, and more recently with desktop publishing software like Aldus PageMaker including
      versions of Lorem Ipsum.
    </p>
    <h4>Where does it come from?</h4>
    <p>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
      classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a
      Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin
      words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in
      classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections
      1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
      Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during
      the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a
      line in section 1.10.32.
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
      page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
      normal distribution of letters, as opposed to using 'Content here, content here', making it
      look like readable English. Many desktop publishing packages and web page editors now use
      Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web
      sites still in their infancy. Various versions have evolved over the years, sometimes by
      accident, sometimes on purpose (injected humour and the like).
    </p>
    <h2>Where can I get some?</h2>
    <p>
      There are many variations of passages of Lorem Ipsum available, but the majority have suffered
      alteration in some form, by injected humour, or randomised words which don't look even
      slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure
      there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators
      on the Internet tend to repeat predefined chunks as necessary, making this the first true
      generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a
      handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The
      generated Lorem Ipsum is therefore always free from repetition, injected humour, or
      non-characteristic words etc.
    </p>
  </BOffcanvas>
</template>

<style scoped></style>
