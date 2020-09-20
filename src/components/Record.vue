<template>
  <div style="padding: 30px 5%;">
    <p>{{ load }}<v-btn text color="primary" v-if="content" @click="copy">复制全部</v-btn></p>
    <v-alert dense v-if="tip" :type="alertType">{{ tip }}</v-alert>
    <v-textarea
      v-if="content"
      outlined
      auto-grow
      style="background: white; padding: 20px; height: min-content; min-height: 100%;"
      ref="output"
      label="记录数据"
      :value="content"
    ></v-textarea>
  </div>
</template>

<script>
const SS = window.sessionStorage

export default {
  name: 'Record',
  data: () => ({
    content: '',
    load: '请在事务列表选择事务',
    tip: '',
    alertType: 'success'
  }),
  props: ['id'],
  mounted () {
    this.fetchRecord()
  },
  watch: {
    id () {
      this.fetchRecord()
    }
  },
  methods: {
    async fetchRecord () {
      if (!this.id) return
      this.content = ''
      this.load = '正在加载事务信息...'
      try {
        const affair = await this.$ajax.get('/admin/affair?id=' + this.id, { headers: { token: SS.token } })
        if (!affair.data.course) {
          this.load = '暂无选课数据'
          return
        }
        this.load = '正在加载事务记录...'
        const record = await this.$ajax.get('/admin/record?id=' + this.id, { headers: { token: SS.token } })
        this.load = '正在加载用户组信息...'
        const group = await this.$ajax.get('/admin/user?group=' + SS.group, { headers: { token: SS.token } })
        const courses = affair.data.course.split(',')
        this.content = '用户组\t姓名\t课程\n'
        for (const g in group.data) {
          for (const i in group.data[g]) {
            if (i in record.data) this.content += `${g}\t${group.data[g][i]}\t${courses[record.data[i].value]}`
          }
        }
        this.load = '下列数据可以直接复制进Excel'
      } catch (err) {
        this.load = '加载事务信息失败'
        if (err.response) this.load += err.response.data
      }
    },
    async copy () {
      try {
        const output = this.$refs.output.$el.getElementsByTagName('textarea')[0]
        output.select()
        document.execCommand('copy')
        this.alertType = 'success'
        this.tip = '复制成功'
      } catch (err) {
        this.alertType = 'error'
        this.tip = '复制失败'
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.tip = ''
      this.alertType = ''
    }
  }
}
</script>
