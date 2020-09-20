<template>
  <div>
    <h3>
      课程列表 ({{ value.length }})
      <v-btn outlined style="margin: 10px" color="primary" @click="dialog = true; index = -1">添加课程</v-btn>
    </h3>
    <v-btn
      v-for="(v, i) in value"
      :key="i"
      text large
      @click="open(i)"
      style="width: 100%; max-width: 600px; text-align: left; display: block; white-space: normal;"
    >
      <span style="width: 85%">{{ v.name }}</span>
      <span style="width: 15%; float: right;"><b>({{v.space}})</b></span>
    </v-btn>
    <v-dialog v-model="dialog" max-width="400px" justify="center">
      <v-card style="padding: 0 30px;">
        <v-card-title>课程信息</v-card-title>
        <v-text-field dense outlined v-model="course.name" label="名称" :error-messages="error"></v-text-field>
        <v-text-field dense outlined type="number" v-model="course.space" label="名额"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">关闭</v-btn>
          <v-btn v-if="index >= 0" color="error" text @click="remove">删除</v-btn>
          <v-btn color="primary" text @click="submit">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Course',
  props: ['value'],
  data: () => ({
    course: {
      name: '',
      space: ''
    },
    dialog: false,
    error: '',
    index: -1
  }),
  watch: {
    course () {
      this.error = ''
    }
  },
  methods: {
    open (i) {
      this.course = {
        name: this.value[i].name,
        space: this.value[i].space
      }
      this.index = i
      this.dialog = true
    },
    submit () {
      if (!this.course.name) {
        this.error = '请填写名称'
        return
      }
      if (!this.course.space) {
        this.error = '请填写名额'
        return
      }
      for (const c of this.value) {
        if (c.name === this.course.name) {
          this.error = '课程已存在'
          return
        }
      }
      if (this.index < 0) this.value.push(this.course)
      else this.value[this.index] = this.course
      this.course = { name: '', space: '' }
      this.index = -1
      this.dialog = false
    },
    remove () {
      this.value.splice(this.index, 1)
      this.course = { name: '', space: '' }
      this.index = -1
      this.dialog = false
    }
  }
}
</script>
