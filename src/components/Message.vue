<template>
  <v-bottom-sheet v-model="sheet" inset>
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="color || 'primary'" dark v-bind="attrs" v-on="on"><slot></slot></v-btn>
    </template>
    <v-sheet>
      <v-form style="padding: 10px 30px 20px;">
        <v-card-subtitle>{{ msg.key }}
          <v-switch dense v-model="pushOn" label="开启推送" style="display: inline-block; margin-left: 15px;"></v-switch>
        </v-card-subtitle>
        <v-text-field dense outlined label="消息标题" v-model="msg.value"></v-text-field>
        <v-text-field dense outlined type="number" label="消息持续时间（秒）" v-model="msg.expire"></v-text-field>
        <template v-if="pushOn">
          <v-text-field dense outlined label="推送链接" v-model="push.link"></v-text-field>
          <v-text-field dense outlined label="推送链接文字" v-model="push.linkText"></v-text-field>
          <v-textarea rows="4" dense outlined label="推送正文" v-model="push.text"></v-textarea>
        </template>
        <div>{{ tip }}</div>
        <v-btn :color="success ? 'success' : 'primary'" @click="send" :loading="loading">
          <v-icon v-if="success">mdi-check</v-icon>
          <slot v-else></slot>
        </v-btn>
      </v-form>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
const SS = window.sessionStorage
export default {
  name: 'Message',
  props: ['color', 'template', 'group'],
  data: () => ({
    sheet: false,
    loading: false,
    success: false,
    tip: '',
    msg: {
      key: '',
      value: '',
      expire: 86400
    },
    pushOn: true,
    push: {
      link: '',
      linkText: '',
      text: ''
    }
  }),
  mounted () {
    if (this.template) {
      this.msg = this.template.msg
      this.push = this.template.push
    } else {
      this.msg.key = 'MSG' + Math.random().toString(36).substr(2, 8)
    }
  },
  watch: {
    sheet () {
      this.tip = ''
      this.success = false
    }
  },
  methods: {
    async send () {
      this.loading = true
      try {
        await this.$ajax.post('/admin/message', {
          group: this.group,
          msg: this.msg,
          push: (this.pushOn ? this.push : undefined)
        }, { headers: { token: SS.token } })
        this.success = true
        this.loading = false
        await new Promise(resolve => setTimeout(resolve, 2000))
        this.sheet = false
      } catch (err) {
        this.tip = '发送失败'
        if (err.response) this.tip = err.response.data
      }
      this.loading = false
    }
  }
}
</script>
