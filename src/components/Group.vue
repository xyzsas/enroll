<template>
  <div>
    <v-card @click="open" style="width: max-content; padding: 0 10px 20px;">
      <v-card-title>用户组<v-card-subtitle>点击可编辑</v-card-subtitle></v-card-title>
      <v-chip v-for="g in value.split(',')" :key="g" style="margin: 3px;">{{ g }}</v-chip>
    </v-card>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" style="background: white;">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>选择用户组</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="save">确认</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-sheet scrollable style="padding: 20px; height: min-content; min-height: 100%;">
        <p>{{ tip }}</p>
        <v-treeview
          v-model="selected"
          :items="items"
          selection-type="independent"
          selectable
          open-all
        ></v-treeview>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
const SS = window.sessionStorage

export default {
  name: 'Group',
  props: ['value'],
  data: () => ({
    dialog: false,
    items: [],
    selected: [],
    groupArray: [],
    visited: [],
    tip: '正在载入用户组信息...'
  }),
  watch: {
    value () {
      this.selected = this.value.split(',')
    }
  },
  methods: {
    open () {
      this.dialog = true
      if (!this.items.length) this.tree()
    },
    save () {
      this.$emit('input', this.selected.join(','))
      this.dialog = false
    },
    async getTree () {
      return await this.$ajax
        .get('/admin/user', { headers: { token: SS.token } })
        .then(resp => resp.data)
        .catch(err => {
          this.tip = err.response.data
          return false
        })
    },
    parseTree (x) { // process the object of groupArray[x]
      this.visited[x] = true
      const g = this.groupArray[x]
      const res = { name: g, id: g, children: [] }
      for (let i = x + 1; i < this.groupArray.length; i++) {
        if (this.visited[i]) continue
        if (this.groupArray[i].indexOf(g) === 0) {
          res.children.push(this.parseTree(i))
        }
      }
      return res
    },
    async tree () {
      const map = await this.getTree()
      if (!map) return
      const groupSet = new Set()
      for (const g in map) {
        const levels = g.substr(SS.group.length).split('/')
        let cur = SS.group
        groupSet.add(cur)
        for (let i = 0; i < levels.length - 1; i++) {
          cur += levels[i] + '/'
          groupSet.add(cur)
        }
      }
      this.groupArray = Array.from(groupSet).sort()
      this.items = [this.parseTree(0)]
      this.tip = '选中的用户组将自动包含子用户组'
      this.selected = this.value.split(',')
    }
  }
}
</script>
