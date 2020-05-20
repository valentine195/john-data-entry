<template lang='pug'>
div#app
  InvoiceInput
</template>
<script>
import InvoiceInput from './views/InvoiceInput'
export default {
  name: 'App',
  components: {
    InvoiceInput
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

input[disabled] {
  background-color: var(--light)
}
</style>
