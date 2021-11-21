<template>
  <div>
    <div class="row q-mb-lg">
      <div class="col" v-for="num in nums1" :key="num">
        <q-btn
          class="q-ml-md"
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
          class="q-ml-md"
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
          class="q-ml-md"
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
          class="q-ml-md bg-blue-5"
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
          class="q-ml-md"
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
          class="q-ml-md bg-blue-5"
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

export default defineComponent({
  name: 'LockPad',

  data () {
    function shuffleArray (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])

    return {
      modelValue: '',
      nums1: nums.slice(0, 3),
      nums2: nums.slice(3, 6),
      nums3: nums.slice(6, 9),
      nums4: nums.slice(9, 10)
    }
  },

  methods: {
    onAppend (value) {
      this.modelValue = this.modelValue + value
      this.$emit('update:modelValue', this.modelValue)
    },
    onErase () {
      if (this.modelValue.length > 0) {
        this.modelValue = this.modelValue.substring(0, this.modelValue.length - 1)
        this.$emit('update:modelValue', this.modelValue)
      }
    },
    onClear () {
      this.modelValue = ''
      this.$emit('update:modelValue', this.modelValue)
    }
  }

})
</script>
