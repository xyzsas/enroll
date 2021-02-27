<template>
  <div>
    <v-text-field
      :value="date + ' ' + time"
      :label="label"
      prepend-inner-icon="mdi-calendar-range"
      outlined
      @focus="dialog = true"></v-text-field>
    <v-dialog v-model="dialog" max-width="290">
      <v-date-picker
        v-if="step == 'date'"
        @input="step = 'time'"
        v-model="date"
        scrollable />
      <v-time-picker
        v-else
        @click:minute="submit"
        v-model="time" />
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TimeSelector',
  props: ['value', 'label'],
  data: () => ({
    step: 'date',
    time: '',
    date: '',
    tzoffset: (new Date()).getTimezoneOffset() * 60000,
    dialog: false
  }),
  mounted () {
    this.parseDate()
  },
  watch: {
    value () {
      this.parseDate()
    }
  },
  methods: {
    submit () {
      this.dialog = false
      this.step = 'date'
      this.$emit('input', Math.floor(Date.parse(this.date + ' ' + this.time) / 1000))
    },
    parseDate () {
      if (!this.value || this.value === 'undefined') return
      try {
        const s = new Date(this.value * 1000 - this.tzoffset).toISOString().split('T')
        this.date = s[0]
        this.time = s[1].substr(0, 5)
      } catch {
      }
    }
  }
}
</script>
