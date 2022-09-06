const UiDialog = {
  name: 'UiDialog',

  data() {
    return {
      showCommonDlg: false
    }
  },

  methods: {
    openCommonDlg() {
      this.showCommonDlg = true
    },

    cancelCommonDlg() {
      this.showCommonDlg = false
    }
  },

  render(h) {
    const CommonDialog = () => (
      <el-dialog title="通用对话在框" visible={this.showCommonDlg}>
        <span>这是一段消息</span>
        <template slot="footer">
          <el-button
            class="btn-gray"
            type="text"
            onClick={this.cancelCommonDlg}
          >
            取消
          </el-button>
          <el-button type="primary" onClick={this.cancelCommonDlg}>
            确定
          </el-button>
        </template>
      </el-dialog>
    )

    return (
      <div>
        <el-row>
          <h3>通用对话框</h3>
          <el-button onClick={this.openCommonDlg}>打开</el-button>
        </el-row>
        <CommonDialog />
      </div>
    )
  }
}

export default UiDialog
