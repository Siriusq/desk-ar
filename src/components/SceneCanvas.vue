<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
</script>

<template>
  <TresCanvas clear-color="#82DBC5" window-size>
    <TresPerspectiveCamera :position="[7, 7, 7]" :look-at="[0, 0, 0]" />
    <!-- The Donut -->
    <TresMesh :position="[0, 2, 0]">
      <TresTorusGeometry :args="[1, 0.4, 16, 32]" />
      <TresMeshBasicMaterial color="#ff6b35" />
    </TresMesh>

    <!-- Visual Helpers -->
    <TresAxesHelper />
    <TresGridHelper />
    <OrbitControls />
  </TresCanvas>
</template>
