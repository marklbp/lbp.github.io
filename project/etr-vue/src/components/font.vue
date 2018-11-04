<template>
  <i class="fa-font">
    <font-awesome-icon :icon="[prefix||'far', icon]"/>
    <!-- <font-awesome-layers full-width class="fa-4x">
      <font-awesome-icon :icon="['far', 'archive']"/>
      <font-awesome-layers-text class="red8" transform="down-3 shrink-14" value="SECRET" />
    </font-awesome-layers> -->
  </i>
</template>
<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import * as fasIcons from '@fortawesome/free-solid-svg-icons'
  import * as farIcons from '@fortawesome/free-regular-svg-icons'
  import { FontAwesomeIcon/*, FontAwesomeLayers, FontAwesomeLayersText*/} from '@fortawesome/vue-fontawesome'

  library.add(...Object.keys(fasIcons).filter(k=>/^fa[A-Z].+$/.test(k)).map(k=>fasIcons[k]))

  library.add(...Object.keys(farIcons).filter(k=>/^fa[A-Z].+$/.test(k)).map(k=>farIcons[k]))

  export default {
    name: 'font-icon',
    props: {
      icon: {
        type: String,
        default: ''
      },
      prefix: {
        type: String,
        default: ''
      }
    },
    components: {
      FontAwesomeIcon/*,
      FontAwesomeLayers, 
      FontAwesomeLayersText*/
    }
  }
</script>