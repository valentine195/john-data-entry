<template lang='pug'>
div#app.d-flex.flex-column.justify-content-between
  router-view.mb-auto
  //-div
    hr
    div.d-flex.align-items-center.justify-content-center
      ul.mb-2
        li
          router-link(to='/input').h5 Input Invoice
        li
          span.h5 |
        li
          span(to='/view' disabled).h5 View Invoices
  
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
  height: 100vh;
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

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
