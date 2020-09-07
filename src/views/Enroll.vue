<template>
  <div class="enroll">
    <h1>{{ title }}</h1>
    <p v-if="!(record || loading)">请点击选择课程<br>括号中的数字为剩余名额</p>
    <p v-if="record && !loading">您已完成选课：</p>
    <v-btn
      v-for="(value, i) in courses"
      :key="i"
      @click="dialog=true; course=i"
      text large
      :disabled="Boolean(record || !value.space)"
      style="width: 100%; max-width: 600px; text-align: left; display: block; white-space: normal;"
    >
      <span style="width: 92%">{{ value.name }}</span>
      <span style="width: 8%; float: right;"><b>({{ value.space }})</b></span>
    </v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title>确认选课</v-card-title>
        <v-card-text>你确认要选择<code>{{ courses[course] ? courses[course].name : '' }}</code>么？</v-card-text>
        <v-card-text :style="style">{{ tip }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" :loading="enrolLoading" @click="enroll">确定</v-btn>
          <v-btn text @click="dialog=false; tip=''">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    loading: true,
    dialog: false,
    tip: '',
    style: '',
    course: 0,
    record: null,
    enrolLoading: false,
    countdown: -100,
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
  watch: {
    countdown () {
      if (this.countdown <= 0) {
        clearInterval(timer)
        this.title = '正在加载选课数据...'
        this.fetchCourses()
        return
      }
      let sec = this.countdown
      const hh = String(Math.floor(sec / 3600)).padStart(2, '0')
      sec = sec % 3600
      const mm = String(Math.floor(sec / 60)).padStart(2, '0')
      sec = sec % 60
      const ss = String(sec).padStart(2, '0')
      this.title = `距离选课开始还有 ${hh}:${mm}:${ss}`
    }
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
        this.loading = false
      } catch (err) {
        this.title = err.response.data
        if (err.response.status === 403) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          window.location.href = '/index.html'
        }
        if (err.response.status === 406) {
          this.countdown = err.response.data
          timer = setInterval(() => {
            this.countdown--
          }, 1000)
        }
      }
    },
    async enroll () {
      if (this.record || this.enrolLoading) {
        this.dialog = false
        this.tip = ''
        return
      }
      this.enrolLoading = true
      try {
        await this.$ajax.post('/enroll', {
          course: this.course.toString()
        }, {
          headers: { ticket: this.ticket }
        })
        this.tip = '选课成功！'
        this.style = 'color: green;'
        await new Promise(resolve => setTimeout(resolve, 1500))
        this.dialog = false
        this.tip = ''
        this.courses = [this.courses[this.course]]
        this.record = this.course.toString()
      } catch (err) {
        this.tip = err.response.data
        this.style = 'color: red;'
        await new Promise(resolve => setTimeout(resolve, 2000))
        await this.fetchCourses()
        this.dialog = false
        this.tip = ''
      }
      this.enrolLoading = false
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
