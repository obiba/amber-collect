<template>
  <div>
    <div class="row q-mb-lg">
      <div class="col" v-for="num in nums1" :key="num">
        <q-btn
          class="q-ml-xs"
          round
          dense
          color="primary"
          size="lg"
          :label="num"
          @click="onAppend(num)"
        />
      </div>
    </div>
    <div class="row q-mb-lg">
      <div class="col" v-for="num in nums2" :key="num">
        <q-btn
          class="q-ml-xs"
          round
          dense
          color="primary"
          size="lg"
          :label="num"
          @click="onAppend(num)"
        />
      </div>
    </div>
    <div class="row q-mb-lg">
      <div class="col" v-for="num in nums3" :key="num">
        <q-btn
          class="q-ml-xs"
          round
          dense
          color="primary"
          size="lg"
          :label="num"
          @click="onAppend(num)"
        />
      </div>
    </div>
    <div class="row q-mb-lg">
      <div class="col">
        <q-btn
          class="q-ml-xs bg-blue-5"
          round
          dense
          color="primary"
          size="lg"
          icon="clear"
          @click="onClear"
        />
      </div>
      <div class="col" v-for="num in nums4" :key="num">
        <q-btn
          class="q-ml-xs"
          round
          dense
          color="primary"
          size="lg"
          :label="num"
          @click="onAppend(num)"
        />
      </div>
      <div class="col">
        <q-btn
          class="q-ml-xs bg-blue-5"
          round
          dense
          color="primary"
          size="lg"
          icon="chevron_left"
          @click="onErase"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { settings } from '../boot/settings'

export default defineComponent({
  name: 'LockPad',

  props: ['modelValue'],
  emits: ['update:modelValue'],

  setup () {
    function shuffleArray (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const nums = settings.lock && settings.lock.shuffle ? shuffleArray(numArray) : numArray

    return {
      nums1: nums.slice(0, 3),
      nums2: nums.slice(3, 6),
      nums3: nums.slice(6, 9),
      nums4: nums.slice(9, 10)

    }
  },

  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
    onAppend (val) {
      const nval = this.value ? this.value + '' + val : val + ''
      this.value = nval
    },
    onErase () {
      if (this.value && this.value.length > 0) {
        this.value = this.value.substring(0, this.value.length - 1)
      }
    },
    onClear () {
      this.value = ''
    }
  }

})
</script>
