<template>
  <div class="group">
    <p v-if="tip" :style="style">{{ tip }}</p>
    <v-btn
      style="position: fixed; bottom: 10%; right: 10%;"
      color="primary"
      @click="dialog = true"
      fab large><v-icon>mdi-plus</v-icon></v-btn>
    <v-list-item
      v-for="(value, id) in list"
      :key="id"
      @click="$emit('task', id)"
    >
      <v-list-item-content>
        <v-list-item-title>{{ value }} ({{ id }})</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-dialog v-model="dialog" max-width="400px" justify="center">
      <v-card style="padding: 0 30px;">
        <v-card-title>创建事务</v-card-title>
        <v-text-field outlined dense type="text" v-model="id" label="事务ID" :disabled="submitLoading" :error-messages="errId"></v-text-field>
        <v-text-field outlined dense type="text" v-model="title" :disabled="submitLoading" label="事务名称" :error-messages="errTitle"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">关闭</v-btn>
          <v-btn :loading="submitLoading" color="primary" text @click="add">添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const SS = window.sessionStorage

export default {
  name: 'List',
  props: ['random'],
  data: () => ({
    loading: false,
    list: null,
    error: '',
    dialog: false,
    id: '',
    title: '',
    errId: '',
    errTitle: '',
    submitLoading: false,
    style: ''
  }),
  mounted () {
    this.getList()
  },
  watch: {
    random () {
      this.getList()
    }
  },
  computed: {
    tip () {
      if (this.loading) return '正在载入...'
      if (this.error) return this.error
      return '您权限内的事务列表如下，点击事务可以查看或编辑事务信息'
    }
  },
  methods: {
    async getList () {
      this.loading = true
      try {
        const { data } = await this.$ajax({
          method: 'GET',
          url: '/admin/affair?app=ENROLL',
          headers: { token: SS.token }
        })
        this.list = data
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = '加载失败'
        if (err.response) this.error = err.response.data
        if (err.response.status === 401) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          window.location.href = '/user/#/?c=' + encodeURIComponent('/enroll/#/admin')
        }
      }
    },
    async add () {
      this.submitLoading = true
      if (!this.id) this.errId = '请填写事务ID'
      if (!this.title) this.errTitle = '请填写事务名称'
      if (this.errId || this.errTitle) return
      try {
        await this.$ajax.post(`/admin/affair?id=ENROLL${this.id}`, { attributes: { title: this.title, group: SS.group } }, {
          headers: { token: SS.token }
        })
        this.dialog = false
        this.$emit('task', 'ENROLL' + this.id)
      } catch (err) {
        this.errId = err.response.data
      }
      this.submitLoading = false
    }
  }
}
</script>

<style scoped>
  div.group {
    padding: 30px 50px;
  }
</style>
