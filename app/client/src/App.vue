<template lang='pug'>
div#app.d-flex.flex-column.justify-content-between
  router-view.mb-auto
  notifications(group='success')
  notifications(group='error')
  
</template>
<script>
import InvoiceInput from './views/InvoiceInput'
import { ipcRenderer } from 'electron';
export default {
  name: 'App',
  components: {
    InvoiceInput
  },
  mounted: function() {

    ipcRenderer.on('success', (e, {msg}) => {
      this.$notify({
        group: 'success',
        text: msg,
        type: 'success'
      })
    })
    ipcRenderer.on('error', (e, {msg}) => {
      this.$notify({
        group: 'error',
        text: msg,
        type: 'error'
      })
    })

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
