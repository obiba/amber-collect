<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="text-h6 text-grey-8">
        Our Changing Planet
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      {{ text }}
    </q-card-section>
    <q-card-actions align="left">
      <q-btn label="Start" icon-right="play_arrow" class="text-capitalize q-ma-sm" color="indigo-7" to="/test"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CaseReportFormCard',
  setup () {
    return {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
})
</script>
