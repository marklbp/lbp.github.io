<template>
  <div class="container">
    <div>
      Hello {{ $store.state.authUser.username }}!
      <pre>I am the secret content, I am shown only when the use is connected.</pre>
      <p><i>You can also refresh this page, you'll still be connected!</i></p>
      <button @click="logout">Logout</button>
    </div>
    <p><router-link to="/secret">Super secret page</router-link></p>
  </div>
</template>


<style scoped>
.container {
  padding: 100px;
}
.error {
  color: red;
}
</style>

<script>
export default {
  data() {
    return {
      formError: null,
      formUsername: '',
      formPassword: ''
    }
  },
  methods: {
    async logout() {
      let d = new Date();
      d.setTime(d.getTime() -1);
      document.cookie += ';username=;expires='+ d.toGMTString();
      try {
        await this.$store.dispatch('logout');
        window.location.reload()
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>