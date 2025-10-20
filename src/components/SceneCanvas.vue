<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { useModelManager } from '@/composables/useModelManager'
const { models } = useModelManager()
</script>

<template>
  <TresCanvas clear-color="#82DBC5" window-size>
    <TresPerspectiveCamera :position="[7, 7, 7]" :look-at="[0, 0, 0]" />

    <!-- Lights for better visualization and shadows -->
    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight :position="[3, 10, 5]" :intensity="1" cast-shadow />

    <!-- A simple plane to receive shadows -->
    <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[50, 50, 1, 1]" />
      <TresMeshStandardMaterial color="#ffffff" />
    </TresMesh>

    <primitive
      v-for="model in models"
      :key="model.id"
      :object="model.scene"
      :position="[0, 0, 0]"
    />

    <!-- Visual Helpers -->
    <TresAxesHelper />
    <TresGridHelper />
    <OrbitControls />
  </TresCanvas>
</template>
