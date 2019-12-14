<template>
  <div class="demo-page">
    <button @click="showPopup = !showPopup">Popup</button>
    <pop-up position="right" v-model="showPopup">
      <div class="popup-inner" style="background-color: #fff">你哈皮吗？</div>
    </pop-up>
    <picker
      ref="picker"
      :data="pickerData"
      @initialed="onPickerInitialed"
      @change="onPickerConfirm"
      is-view
    ></picker>
  </div>
</template>
<script>
export default {
  name: 'demo-page',
  components: {
    'pop-up': _ => import('./components/popup'),
    'picker': _ => import('./components/picker')
  },
  data() {
    return {
      showPopup: false,
      pickerData: [
        [
          {label: 2010, value: 2010},
          {label: 2011, value: 2011},
          {label: 2012, value: 2012},
          {label: 2013, value: 2013},
          {label: 2014, value: 2014},
          {label: 2015, value: 2015},
          {label: 2016, value: 2016},
          {label: 2017, value: 2017},
          {label: 2018, value: 2018},
          {label: 2019, value: 2019}
        ]
      ],
      pickerDataNew: [
        {
          text: 'Hello World',
          value: 9999,
        },
      ],
      pickerValue: ''
    }
  },
  methods: {
    onPickerInitialed() {
      const value = this.$refs.picker.getColumnValues()
      console.log(`[Mand Mobile] Picker Initialed: ${JSON.stringify(value)}`)
    },
    onPickerConfirm(columnIndex, itemIndex, value) {
      if (value) {
        console.log(value)
        this.pickerValue = value.text
      }
    }
  }
};
</script>
<style>
.popup-inner {
  background-color: #fff
}
</style>