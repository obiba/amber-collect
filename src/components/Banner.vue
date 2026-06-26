<template>
    <div>
        <div v-if="settings.theme.logo" class="col text-center">
            <img :src="settings.theme.logo" />
        </div>
        <div class="col text-center q-mb-lg">
            <div class="text-h1">
                {{$t('main.brand')}}
            </div>
            <div v-if="$t('main.brand_caption')" class="text-subtitle1">
                {{$t('main.brand_caption')}}
            </div>
        </div>
    </div>
</template>

<script>
import { settings } from '../boot/settings'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBanner',
  setup () {
    return {
      settings
    }
  }
})
</script>
