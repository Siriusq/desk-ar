<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUIState } from '@/composables/useUIState'

const { isHelpModalOpen, toggleHelpModal } = useUIState()
</script>

<template>
  <BModal
    :model-value="isHelpModalOpen"
    @update:model-value="toggleHelpModal"
    :title="t('helps')"
    size="xl"
    scrollable
    no-footer
  >
    <!-- 操作 -->
    <BAccordion id="help-accordion">
      <BAccordionItem :title="$t('help.controls.title')" body-class="text-start">
        <p>{{ $t('help.controls.intro') }}</p>
        <ul class="i18n-list">
          <li v-html="$t('help.controls.list.rotate')"></li>
          <li v-html="$t('help.controls.list.zoom')"></li>
          <li v-html="$t('help.controls.list.pan')"></li>
          <li v-html="$t('help.controls.list.select')"></li>
          <li v-html="$t('help.controls.list.toggleGizmo')"></li>
          <li v-html="$t('help.controls.list.deselect')"></li>
        </ul>
      </BAccordionItem>

      <!-- 快捷键 -->
      <BAccordionItem :title="$t('help.shortcuts.title')" body-class="text-start">
        <ul class="i18n-list">
          <li v-html="$t('help.shortcuts.list.undo')"></li>
          <li v-html="$t('help.shortcuts.list.redo')"></li>
          <li v-html="$t('help.shortcuts.list.save')"></li>
          <li v-html="$t('help.shortcuts.list.add')"></li>
          <li v-html="$t('help.shortcuts.list.delete')"></li>
          <li v-html="$t('help.shortcuts.list.exit')"></li>
          <li v-html="$t('help.shortcuts.list.help')"></li>
          <li v-html="$t('help.shortcuts.list.menu')"></li>
          <li v-html="$t('help.shortcuts.list.preview')"></li>
        </ul>
      </BAccordionItem>

      <!-- AR 预览 -->
      <BAccordionItem :title="$t('help.arPreview.title')" body-class="text-start">
        <ul class="i18n-list">
          <li v-html="$t('help.arPreview.list.warning')"></li>
          <li v-html="$t('help.arPreview.list.step1')"></li>
          <li v-html="$t('help.arPreview.list.step2')"></li>
          <li v-html="$t('help.arPreview.list.step3')"></li>
        </ul>
      </BAccordionItem>

      <!-- 菜单功能 -->
      <BAccordionItem :title="$t('help.menu.title')" body-class="text-start">
        <ul class="i18n-list">
          <li v-html="$t('help.menu.list.itemSelect')"></li>
          <li v-html="$t('help.menu.list.sceneName')"></li>
          <li v-html="$t('help.menu.list.positionRotation')"></li>
          <li v-html="$t('help.menu.list.verticalDrop')"></li>
          <li v-html="$t('help.menu.list.name')"></li>
          <li v-html="$t('help.menu.list.preset')"></li>
          <li v-html="$t('help.menu.list.numericInput')"></li>
          <li v-html="$t('help.menu.list.mounting')"></li>
        </ul>
      </BAccordionItem>

      <!-- 模型导入 -->
      <BAccordionItem :title="$t('help.import.title')" body-class="text-start">
        <ul class="i18n-list">
          <li v-html="$t('help.import.list.format')"></li>
          <li
            v-html="$t('help.import.list.download', { sketchfabLink: $t('link.sketchfab') })"
          ></li>
          <li v-html="$t('help.import.list.scale')"></li>
        </ul>
      </BAccordionItem>

      <!-- 关于 -->
      <BAccordionItem :title="$t('help.about.title')" body-class="text-start">
        <ul class="i18n-list">
          <li v-html="$t('help.about.list.github', { githubLink: $t('link.githubRepo') })"></li>
          <li
            v-html="$t('help.about.list.githubPages', { ghPagesLink: $t('link.githubPages') })"
          ></li>
          <li v-html="$t('help.about.list.vue', { vueLink: $t('link.vue') })"></li>
          <li v-html="$t('help.about.list.three', { threeLink: $t('link.three') })"></li>
          <li
            v-html="$t('help.about.list.modelViewer', { modelViewerLink: $t('link.modelViewer') })"
          ></li>
          <li v-html="$t('help.about.list.bootstrap', { bvNextLink: $t('link.bvNext') })"></li>
          <li v-html="$t('help.about.list.hdr')"></li>
          <li v-html="$t('help.about.list.pattern')"></li>
          <li v-html="$t('help.about.list.speakerMesh')"></li>
          <li v-html="$t('help.about.list.micMesh')"></li>
          <li v-html="$t('help.about.list.githubCorner')"></li>
        </ul>
      </BAccordionItem>
    </BAccordion>
  </BModal>
</template>
