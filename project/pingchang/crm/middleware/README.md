# MIDDLEWARE

This directory contains your Application Middleware.
The middleware lets you define custom function to be ran before rendering a page or a group of pages (layouts).

More information about the usage of this directory in the documentation:
https://nuxtjs.org/guide/routing#middleware

**This directory is not required, you can delete it if you don't want to use it.**



https://github.com/nuxt/example-auth0/blob/master/utils/auth.js


```
<nuxt-link v-if="isAuthenticated" to="/secret">Top Secret</nuxt-link>
<nuxt-link v-if="!isAuthenticated" to="/auth/sign-in">Sign In</nuxt-link>
<nuxt-link v-else to="/auth/sign-off">Sign Off</nuxt-link>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters(['isAuthenticated'])
}
</script>
```