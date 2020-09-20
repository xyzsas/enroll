<template>
  <div class="task">
    <h1>
      <span>{{ tip }}</span>
    </h1>
    <div v-if="courses">
      <p style="color: #757575">
        {{ id }}
        <v-btn text v-if="courses" color="primary" @click="$emit('record', id)">点击导出记录</v-btn>
      </p>
      <group v-model="group"></group>
      <time-selector v-model="start" label="选课开始时间" style="width: 300px; margin-top: 30px;"></time-selector>
      <course v-model="courses"></course>
      <v-alert dense v-if="submitTip" :type="alertType">{{ submitTip }}</v-alert>
      <v-row style="max-width: 600px;">
        <v-col>
          <v-btn color="secondary" @click="submit" :loading="submitLoading">修改事务信息</v-btn>
        </v-col>
        <v-col>
          <v-btn color="error" @click="del = true" :loading="submitLoading">删除事务</v-btn>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="del" max-width="400px" justify="center">
      <v-card>
        <v-card-title>删除事务</v-card-title>
        <v-card-text>删除事务会删除此事务以及全部数据，你确定删除么？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="del = false">关闭</v-btn>
          <v-btn color="red" text @click="remove">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Group from '@/components/Group.vue'
import Course from '@/components/Course.vue'
import TimeSelector from '@/components/TimeSelector.vue'
const SS = window.sessionStorage

export default {
  name: 'Task',
  data: () => ({
    title: '',
    courses: null,
    loading: false,
    submitLoading: false,
    id: '',
    start: '',
    group: '',
    submitTip: '',
    alertType: '',
    del: false
  }),
  props: ['tid', 'random'],
  components: {
    Group, TimeSelector, Course
  },
  mounted () {
    if (this.tid) {
      this.id = this.tid
      this.search()
    } else {
      this.courses = null
    }
  },
  watch: {
    random () {
      this.id = this.tid
      this.courses = []
      this.search()
    }
  },
  computed: {
    tip () {
      if (this.loading) return '正在加载数据...'
      if (this.title) return this.title
      return '请在事务列表选择事务'
    }
  },
  methods: {
    async search () {
      this.loading = true
      try {
        const { data } = await this.$ajax.get('/admin/affair?id=' + this.tid, { headers: { token: SS.token } })
        this.title = data.title
        this.id = this.tid
        this.group = data.group
        this.start = String(data.start)
        this.courses = []
        // parse course list
        if (data.course && data.course.length > 0) {
          const names = data.course.split(',')
          for (let i = 0; i < names.length; i++) {
            this.courses.push({ name: names[i], space: data[String(i)] })
          }
        }
      } catch (err) {
        this.courses = null
        if (err.response) this.title = err.response.data
        if (err.response.status === 401) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          window.location.href = '/user/#/?c=' + encodeURIComponent('/enroll/#/admin')
        }
      }
      this.loading = false
      this.$forceUpdate()
    },
    async remove () {
      this.del = false
      this.submitLoading = true
      try {
        await this.$ajax.delete('/admin/record?id=' + this.tid, { headers: { token: SS.token } })
        const { data } = await this.$ajax.delete('/admin/affair?id=' + this.tid, { headers: { token: SS.token } })
        this.submitTip = data
        this.alertType = 'success'
      } catch (err) {
        this.submitTip = '删除失败'
        if (err.response) this.submitTip = err.response.data
        this.alertType = 'error'
      }
      this.submitLoading = false
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.submitTip = ''
      this.courses = null
      this.$emit('back')
    },
    async submit () {
      this.submitLoading = true
      const body = {
        attributes: {
          title: this.title,
          group: this.group,
          start: this.start,
          course: this.courses.map(x => x.name).join(',')
        },
        atomic: {}
      }
      for (let i = 0; i < this.courses.length; i++) {
        body.atomic[String(i)] = this.courses[i].space
      }
      try {
        const { data } = await this.$ajax.put(`/admin/affair?id=${this.id}`, body, {
          headers: { token: SS.token }
        })
        this.submitTip = data
        this.alertType = 'success'
      } catch (err) {
        this.submitTip = '更新失败'
        if (err.response) this.submitTip = err.response.data
        this.alertType = 'error'
      }
      this.submitLoading = false
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.submitTip = ''
    }
  }
}
</script>

<style scoped>
  div.task {
    padding: 30px 5%;
  }
</style>
