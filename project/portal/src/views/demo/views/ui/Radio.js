const UiRadio = {
  name: 'UiRadio',

  data() {
    return {
      radio: '5',
      groupOne: '2',
      groupTwo: '2',
      groupThree: '2'
    }
  },

  render(h) {
    return (
      <div>
        <el-row>
          <h3>Radio</h3>
          <el-radio v-model={this.radio} label="1">
            Default
          </el-radio>
          <el-radio v-model={this.radio} label="5" disabled>
            Disabled
          </el-radio>
        </el-row>
        <el-row>
          <p>带边框</p>
          <el-radio size="medium" v-model={this.radio} label="2" border>
            Medium
          </el-radio>
          <el-radio size="small" v-model={this.radio} label="3" border>
            Small
          </el-radio>
          <el-radio size="mini" v-model={this.radio} label="4" border>
            Mini
          </el-radio>
          <p>分组</p>
          <el-radio-group v-model={this.groupOne}>
            <el-radio size="medium" label="2">
              one
            </el-radio>
            <el-radio size="medium" label="3">
              two
            </el-radio>
            <el-radio size="medium" label="4">
              Three
            </el-radio>
          </el-radio-group>
          <p>按钮样式</p>
          <el-radio-group v-model={this.groupTwo}>
            <el-radio-button size="medium" label="2">
              one
            </el-radio-button>
            <el-radio-button size="medium" label="3">
              two
            </el-radio-button>
            <el-radio-button size="medium" label="4">
              Three
            </el-radio-button>
          </el-radio-group>
        </el-row>
      </div>
    )
  }
}

export default UiRadio
