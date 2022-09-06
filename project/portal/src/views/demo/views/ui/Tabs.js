const UiTabs = {
  name: 'UiTabs',

  data() {
    return {
      activeName: 'second',
      tabsOptions: [
        {
          value: 'first',
          label: '用户管理'
        },
        {
          value: 'second',
          label: '配置管理'
        },
        {
          value: 'third',
          label: '角色管理'
        },
        {
          value: 'fourth',
          label: '定时任务补偿'
        }
      ]
    }
  },

  render(h) {
    const CommonTabs = () => (
      <el-tabs v-model={this.activeName}>
        {this.tabsOptions.map(option => (
          <el-tab-pane label={option.label} name={option.value}>
            {option.label}
          </el-tab-pane>
        ))}
      </el-tabs>
    )

    const TitleTabs = () => (
      <el-tabs class="tabs-title" v-model={this.activeName}>
        {this.tabsOptions.map(option => (
          <el-tab-pane label={option.label} name={option.value}>
            {option.label}
          </el-tab-pane>
        ))}
      </el-tabs>
    )

    return (
      <div>
        <el-row>
          <h3>普通Tabs</h3>
          <CommonTabs />
        </el-row>
        <el-row>
          <h3>标题Tabs</h3>
          <TitleTabs />
        </el-row>
      </div>
    )
  }
}

export default UiTabs
