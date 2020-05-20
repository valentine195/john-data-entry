<template lang='pug'>
div.home.p-3
  h4 Invoice Entry
  div#invoice-entry
    div.invoice
        div.entry
            div.form-group.amount-group#amount-group.mr-2.text-left(v-for='type in types' :key='type')
                label(for='amount') {{ type }}
                input.form-control#amount(name='amount')
        div.form-group.amount-group#amount-group.mr-2.text-left
            label(for='total') Total Amount
            input.form-control#total(name='total' disabled)
        div.payment-type.text-left
            p 
                strong Paid By
            div.form-check#payment-group.mr-4.text-left.form-check-inline(v-for='payment in payments' :key='payment' :value='payment')
                input.form-check-input(type="radio" name="payments" :id="payment" :value="payment" checked)
                label.form-check-label(:for="payment") {{ payment }}
    div.buttons.d-flex.justify-content-end
      button.mr-2.btn.btn-outline-danger(type='cancel') Cancel
      button.btn.btn-primary(type='submit') Submit

</template>

<script>
import InvoiceEntry from '../components/InvoiceEntry'
export default {
  name: 'InvoiceInput',
  components: {
    InvoiceEntry
  },
  data: () => {
    return {
      types: ["UPS/FEDEX", "Shredding", "Printing", "Fax", "Rent", "Warehouse", "Labor", "Carton sales", "Notary Fees", "Sales tax"],
      payments: ['Cash', 'Check', 'Credit']
    }
  }
}
</script>

<style scoped>
.add {
  width: 100%;
  height: 2rem;
  border: 0;
}
</style>