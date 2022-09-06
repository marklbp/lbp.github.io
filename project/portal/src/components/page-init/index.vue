<template>
  <div
    class="page-init"
    v-if="customLoading"
    :class="{
      done: message.length <= 0 && !loading,
      empty: message.length > 0 && !loading,
      error: message.length > 0 && !loading && code > 0
    }"
  >
    <slot name="loading" v-if="loading" />
    <slot v-if="message.length <= 0 && !loading" />
    <empty
      v-if="message.length > 0 && !loading && !code"
      :message="message"
      :iconSize="iconSize"
    />
    <error
      v-if="message.length > 0 && !loading && code"
      :code="code"
      :message="message"
      :iconSize="iconSize"
    />
  </div>
  <div
    v-loading="loading"
    class="page-init"
    v-else
    :class="{
      done: message.length <= 0 && !loading,
      empty: message.length > 0 && !loading,
      error: message.length > 0 && !loading && code > 0
    }"
  >
    <slot v-if="message.length <= 0 && !loading" />
    <empty
      v-if="message.length > 0 && !loading && !code"
      :type="isSearch"
      :message="message"
      :iconSize="iconSize"
    />
    <error
      v-if="message.length > 0 && !loading && code"
      :code="code"
      :message="message"
      :iconSize="iconSize"
    />
  </div>
</template>
<script>
export default {
  name: 'page-init',
  props: {
    customLoading: {
      type: Boolean,
      default: _ => false
    },
    loading: {
      type: Boolean,
      default: _ => true
    },
    message: {
      type: String,
      default: _ => '初始化失败，请稍后再试'
    },
    code: {
      type: [String, Number],
      default: _ => 0
    },
    isSearch: {
      type: [String, Number],
      default: _ => 0
    },
    iconSize: {
      type: Array,
      default: _ => []
    }
  },
  components: {
    empty: _ => import('~/components/empty'),
    error: _ => import('~/views/error')
  }
}
</script>
<style lang="scss" scoped>
.page-init {
  position: relative;
  background-color: #fff;
  min-height: 400px;
  &.done {
    background-color: transparent;
  }
  &.error {
    @extend .done;
    &:after {
      display: none;
    }
    display: flex;
    .error-page {
      flex: 1;
    }
  }
  &.empty {
    @extend .error;
    .component-empty {
      flex: 1;
    }
  }
}
</style>
