<template>
  <div
    class="rich-text-container"
    ref="richTextBox"
    :class="{ 'hide-statusbar': showStatusBar, fullscreen: fullscreen }"
    :style="fullscreen ? { 'z-index': $ELEMENT.zIndex } : {}"
  >
    <textarea
      class="editor-textarea"
      ref="textarea"
      v-model="content"
    ></textarea>
    <!-- <span v-if="showWordLimit" class="word-limit">{{ count }}/{{ max }}</span> -->
    <add-relation-dialog />
    <add-image-dialog />
  </div>
</template>
<script>
import './plugins/add-relation-content'
import './plugins/image-upload'
import './plugins/preview'
export default {
  name: 'rich-text',
  props: {
    value: {
      type: String,
      default: _ => '写点什么...'
    },
    showWordLimit: {
      type: Boolean,
      default: _ => false
    },
    maxlength: {
      type: [Number, String],
      default: _ => 1000
    },
    config: {
      type: Object,
      default: _ => ({
        items: [
          'fontname',
          'fontsize',
          'forecolor',
          'hilitecolor',
          'emoticons',
          'bold',
          'italic',
          'underline',
          'justifyleft',
          'justifycenter',
          'justifyright',
          'indent',
          'outdent',
          'insertorderedlist',
          'insertunorderedlist',
          'link',
          'portal-image-upload',
          'portal-add-relation-content',
          'preview',
          'fullscreen'
        ]
      })
    },
    showStatusBar: {
      type: Boolean,
      default: _ => true
    },
    autofocus: {
      type: Boolean,
      default: _ => false
    }
  },
  components: {
    'add-relation-dialog': _ => import('./add-relation-content'),
    'add-image-dialog': _ => import('./add-image')
  },
  data() {
    let max = parseInt(this.maxlength)
    max = isNaN(max) ? 1000 : max
    return {
      content: this.value,
      count: 0,
      max,
      fullscreen: false
    }
  },
  mounted() {
    this.editor = this.initEditor()
    this.count = this.getCount('text')
    if (this.autofocus) this.editor.focus()
  },
  watch: {
    /*count(v) {
      if (v >= this.max)
        this.setContent(this.getContent().substring(0, this.max))
    }*/
  },
  methods: {
    initEditor() {
      let that = this
      let option = Object.assign(this.config, {
        afterChange() {
          that.count = this.count('text')
        },
        afterBlur() {
          that.$emit('blur')
          that.$emit('input', this.html())
        }
      })
      let editor = KindEditor.create(this.$refs.textarea, option)
      editor.fullscreen = function() {
        that.toggleFullscreen()
      }
      return editor
    },
    setContent(s) {
      return this.editor.html(s)
    },
    getContent() {
      return this.editor.html()
    },
    setText(s) {
      return this.editor.text(s)
    },
    getText() {
      return this.editor.text()
    },
    isEmpty() {
      return this.editor.isEmpty()
    },
    clear() {
      return this.editor.html('')
    },
    getCount(s) {
      return this.editor.count(s)
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>
<style src="./index.scss" lang="scss" scoped />
