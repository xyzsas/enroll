<template>
  <div class="overview">
    <h1 style="margin: 0 0 30px -10px;">{{ tip }}</h1>
    <p>管理员： {{ SS.name }}</p>
    <p>用户组权限： {{ SS.group }}</p>
    <p>功能简介：事务列表可以查看权限范围内的选课信息并添加选课事务，事务详情用于查看管理具体选课任务。</p>
    <p>事务详情：可以修改特定事务的信息，点击课程列表可以对该课程进行重命名，删除等操作。</p>
  </div>
</template>

<script>
const SS = window.sessionStorage

export default {
  name: 'Overview',
  data: () => ({
    SS: SS
  }),
  computed: {
    tip () {
      if (SS.role === 'ADMIN') return '选课管理'
      else return '权限不足'
    }
  }
}
</script>

<style scoped>
  div.overview {
    padding: 30px 50px;
  }
</style>
