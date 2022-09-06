<template>
  <div class="ui-container">
    <div class="ui-header">
      <!-- <page-header title="ROSS Portal前端UI组件规范示例" :with-path="true" /> -->
    </div>
    <div class="ui-main">
      <div class="ui-section">
        <div class="ui-section__title">Button</div>
        <div class="ui-section__body">
          <popover-warrper>
            <el-button slot="trigger">focus 激活</el-button>
          </popover-warrper>
          <ui-button />
        </div>
      </div>
      <div class="ui-section">
        <div class="ui-section__title">Dropdown</div>
        <div class="ui-section__body">
          <ui-dropdown />
        </div>
      </div>
      <div class="ui-section">
        <div class="ui-section__title">Checkbox/Radio/Switch</div>
        <div class="ui-section__body">
          <ui-checkbox />
          <ui-radio />
        </div>
      </div>
      <div class="ui-section">
        <div class="ui-section__title">Dialog</div>
        <div class="ui-section__body">
          <ui-dialog />
        </div>
      </div>
      <div class="ui-section">
        <div class="ui-section__title">Tabs</div>
        <div class="ui-section__body">
          <ui-tabs />
        </div>
      </div>
      <div class="ui-section">
        <div class="ui-section__title">PageHeader</div>
        <div class="ui-section__body">
          <!-- <ui-page-header /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from './Button'
import UiDropdown from './Dropdown'
import UiDialog from './Dialog'
import UiTabs from './Tabs'
import UiRadio from './Radio'
import UiCheckbox from './Checkbox'
import PopoverWarrper from '~/components/popover-warrper'

export default {
  components: {
    UiButton,
    UiDropdown,
    UiTabs,
    UiDialog,
    UiRadio,
    UiCheckbox,
    PopoverWarrper
  },

  data() {
    return {}
  }
}
</script>

<style scoped src="./ui.scss"></style>
