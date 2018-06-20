<style>
.container {
  padding: 100px;
}
.error {
  color: red;
}
</style>

<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <p class="error" v-if="formError">{{ formError }}</p>
      <p><i>To login, use <b>demo</b> as username and <b>demo</b> as password.</i></p>
      <p>Username: <input type="text" v-model="formUsername" name="username" /></p>
      <p>Password: <input type="password" v-model="formPassword" name="password" /></p>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

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
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.formUsername,
          password: this.formPassword
        })
        let cookie = document.cookie;
        cookie += cookie.lastIndexOf(";") == cookie.length - 1 ? "":";";
        cookie += "username=" + this.formUsername;
        document.cookie = cookie;
        this.$router.push("/")
        this.formUsername = ''
        this.formPassword = ''
        this.formError = null;

      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>