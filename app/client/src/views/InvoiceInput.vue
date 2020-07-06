<template lang='pug'>
div.home.p-3
  h4 Invoice Entry
  div#invoice-entry
    div.invoice
        div.date-group#date-group.mr-2.text-left.mb-2
          label(for='date') #[strong Invoice Date]
          v-date-picker(v-model='invoice.Date' is-required=true)
        div.entry
            div.form-group.amount-group#amount-group.mr-2.text-left(v-for='type in types' :key='type')
                label(for='amount') #[strong {{ type }}]
                div.input-group
                  div.input-group-prepend
                    span.input-group-text $
                  input.form-control#amount(name='amount' :placeholder='invoice[type]' v-model.number='invoice[type]' type="number" autocomplete="off")
        div.d-flex.justify-content-between
          div.form-group.amount-group#amount-group.mr-5.text-left
            label(for='total') #[strong Total Amount]
            div.input-group
              div.input-group-prepend
                span.input-group-text $
              input.form-control#total(name='total' disabled :value='total')
          div.payment-type.text-left.ml-5
            p 
                strong Paid By
            div.form-check#payment-group.mr-4.text-left.form-check-inline(v-for='payment in payments' :key='payment' :value='payment')
                input.form-check-input(type="radio" name="payments" :id="payment" :value="payment" v-model='invoice.paymentType')
                label.form-check-label(:for="payment") {{ payment }}
    div.buttons.d-flex.justify-content-end
      button.mr-2.btn.btn-outline-danger(type='cancel') Cancel
      button.btn.btn-primary(type='submit') Submit

</template>

<script>
import InvoiceEntry from '../components/InvoiceEntry'
import moment from 'moment';

window.moment = moment;

export default {
  name: 'InvoiceInput',
  components: {
    InvoiceEntry
  },
  data: () => {
    return {
      types: ["UPS/FEDEX", "Carton Sales", "Labor", "Warehouse", "Shredding", "Printing", "Fax", "Rent",  "Notary Fees", "Sales Tax"],
      payments: ['Cash', 'Check', 'Credit'],
      invoice: {
        "Date": new Date(),
        "UPS/FEDEX": 0,
        "Carton Sales": 0,
        "Labor": 0,
        "Warehouse": 0,
        "Shredding": 0,
        "Printing": 0,
        "Fax": 0,
        "Rent": 0, 
        "Notary Fees": 0,
        "Sales Tax": 0,
        paymentType: 'Credit'
      }
    }
  },
  computed: {
    total: function() {
      return Number(Number(this.types.map(t => this.invoice[t]).reduce((a,b) => a+b)).toFixed(2));
    }
  },
  methods: {
    cancel: function() {

      if (confirm('Are you sure you want to cancel the entry?')) {

        this.types.forEach(t => this.invoice[t] = 0);
        this.invoice.Date = new Date();
        this.invoice.paymentType = 'Credit';

      }

    },
    submit: function() {

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
.amount-group {
  flex-grow: 1;
}
.payment-type {
  flex-grow: 1;
  margin-left: auto;
  justify-self: flex-end;
}
</style>