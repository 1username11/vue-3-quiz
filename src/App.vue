<template>
  <div class="app__container">
    <div class="app__overlay" />
    <div class="app__content">
      <ElConfigProvider
        :locale="{
          name: locale,
          el: messages[locale]?.el as TElementPlus['TranslatePair']
        }"
      >
        <router-view />
      </ElConfigProvider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { messages, locale } = useI18n()
</script>

<style lang="scss">
@use './assets/styles/layout/app.scss';
</style>
