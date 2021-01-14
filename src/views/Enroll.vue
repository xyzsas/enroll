<template>
  <div class="enroll">
    <h1>{{ title }}</h1>
    <p v-if="!record && courses.length">请点击选择课程<br>括号中的数字为剩余名额</p>
    <p v-if="record && courses.length">您已完成选课：</p>
    <v-btn
      v-for="(value, i) in courses"
      :key="i"
      @click="enroll(i)"
      text large
      :disabled="Boolean(record || !value.space)"
      style="width: 100%; max-width: 600px; text-align: left; display: block; white-space: normal;"
    >
      <span style="width: 92%">{{ value.name }}</span>
      <span style="width: 8%; float: right;"><b>({{ value.space }})</b></span>
    </v-btn>
    <v-overlay :value="enrolLoading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
const SS = window.sessionStorage
let timer

export default {
  name: 'Enroll',
  data: () => ({
    title: '正在加载选课数据...',
    courses: [],
    record: null,
    enrolLoading: false,
    start: -1,
    ticket: false
  }),
  mounted () {
    if (!SS.token) {
      this.title = '请先登录'
      window.location.href = '/user/#/?c=/enroll/%23/enroll/' + this.$route.params.id
      return
    }
    this.fetchCourses()
  },
  methods: {
    async fetchCourses () {
      try {
        const { data } = await this.$ajax({
          method: 'GET',
          url: `/enroll?id=${this.$route.params.id}`,
          headers: { token: SS.token }
        })
        this.courses = data.courses
        this.title = data.title
        this.ticket = data.ticket
        if (data.record) {
          this.courses = [data.courses[data.record]]
          this.record = data.record
        } else this.courses = data.courses
      } catch (err) {
        this.title = err.response.data
        if (err.response.status === 403) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          window.location.href = '/index.html'
        }
        if (err.response.status === 406) {
          this.start = Math.floor(Date.now() / 1000) + Number(err.response.data)
          timer = setInterval(this.countdown, 200)
        }
      }
    },
    async enroll (c) {
      if (this.record || this.enrolLoading) return
      const res = await this.$swal.fire({
        title: '确认选课',
        html: `你确认要选择<code> ${this.courses[c].name} </code>么？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (!res.isConfirmed) return
      this.enrolLoading = true
      await this.$ajax.post('/enroll', {
        course: c.toString()
      }, { headers: { ticket: this.ticket } })
        .then(res => {
          this.courses = [this.courses[c]]
          this.record = c.toString()
        })
        .catch(err => {
          console.log(err)
          this.$swal.fire('错误', err.response ? err.response.data : '网络错误', 'error')
          this.title = '正在加载选课数据...'
          this.courses = []
          this.fetchCourses()
        })
      this.enrolLoading = false
    },
    countdown () {
      const sec = this.start - Math.floor(Date.now() / 1000)
      if (sec <= 0) {
        clearInterval(timer)
        this.title = '正在加载选课数据...'
        this.fetchCourses()
        return
      }
      const hh = String(Math.floor(sec / 3600)).padStart(2, '0')
      const mm = String(Math.floor(sec / 60 % 60)).padStart(2, '0')
      const ss = String(sec % 60).padStart(2, '0')
      this.title = `距离选课开始还有 ${hh}:${mm}:${ss}`
    }
  }
}
</script>
<style scoped>
  div.enroll {
    color: #555;
    width: 100%;
    min-height: 100vh;
    padding: 30px 3%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  p {
    max-width: 90%;
    margin-bottom: 30px;
  }
</style>
