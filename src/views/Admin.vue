<template>
  <div class="admin">
    <v-tabs v-model="tab">
      <v-tab key="overview">概览</v-tab>
      <v-tab key="list">事务列表</v-tab>
      <v-tab key="task">事务详情</v-tab>
      <v-tab key="record">导出记录</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="overview">
        <overview></overview>
      </v-tab-item>
      <v-tab-item key="list">
        <list @task="task" :random="lRandom"></list>
      </v-tab-item>
      <v-tab-item key="task">
        <task :tid="tid" :random="tRandom" @back="back" @record="record"></task>
      </v-tab-item>
      <v-tab-item key="record">
        <record :id="rid"></record>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Overview from '@/components/Overview.vue'
import List from '@/components/List.vue'
import Task from '@/components/Task.vue'
import Record from '@/components/Record.vue'

export default {
  name: 'Admin',
  data: () => ({
    tab: 0,
    tid: '',
    rid: '',
    tRandom: 0,
    lRandom: 0
  }),
  components: {
    Overview, List, Task, Record
  },
  mounted () {
    if (window.sessionStorage.role !== 'ADMIN') window.location.href = '/index.html'
  },
  methods: {
    task (tid) {
      this.tab = 2
      this.tid = tid
      this.tRandom++
    },
    back () {
      this.tab = 1
      this.lRandom++
    },
    record (id) {
      this.rid = id
      this.tab = 3
    }
  }
}
</script>

<style scoped>
  div.admin {
    color: #333;
    width: 100%;
    height: 100vh;
  }

  h3 {
    position: relative;
    width: 100%;
    color: #555;
    margin: 10px 0 20px;
  }

  .form {
    height: 310px;
    padding: 30px 100px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.5s ease;
  }

  @media (max-width: 500px) {
    .form {
      width: 100%;
      padding: 30px 10px;
    }
  }
</style>
