<template lang='pug'>

</template>

<script>
export default {
    name: 'InvoiceEntry',
    props: {

    },
    components: {

    },
    data: () => {
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    beforeCreate: function () {

    },
    created: function () {

    },
    beforeMount: function () {

    },
    mounted: function () {

    },
}
</script>

<style>
/* .entry {
  display: grid;
  grid-template-columns: 1fr 20% 20% 5%;
} */
.entry {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 0.25rem;
}
</style>