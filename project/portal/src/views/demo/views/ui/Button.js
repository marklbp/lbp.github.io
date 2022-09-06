const UiButton = {
  render(h) {
    return (
      <div>
        <el-row>
          <h3>大小</h3>
          <el-button type="primary">默认按钮(small)</el-button>
          <el-button size="large" type="primary">
            大型按钮(large)
          </el-button>
          <el-button size="medium" type="primary">
            中等按钮(medium)
          </el-button>
          <el-button size="small" type="primary">
            小型按钮(small)
          </el-button>
          <el-button size="mini" type="primary">
            超小按钮(mini)
          </el-button>
          <el-button size="micro" type="primary">
            微按钮(micro)
          </el-button>
        </el-row>
        <el-row>
          <h3>固定大小</h3>
          <el-button class="btn-fixed">default</el-button>
          <el-button class="btn-fixed" size="large">
            large
          </el-button>
          <el-button class="btn-fixed" size="medium">
            medium
          </el-button>
          <el-button class="btn-fixed" size="small">
            small
          </el-button>
          <el-button class="btn-fixed" size="mini">
            mini
          </el-button>
          <el-button class="btn-fixed" size="micro">
            micro
          </el-button>
        </el-row>
        <el-row>
          <h3>图标按钮</h3>
          <el-button class="btn-icon" icon="el-icon-s-tools" />
          <el-button class="btn-icon" icon="el-icon-s-tools" disabled />
          <el-button class="btn-icon btn-gray" icon="el-icon-s-tools" />
          <el-button
            class="btn-icon btn-gray"
            icon="el-icon-s-tools"
            disabled
          />
          <el-button icon="el-icon-plus" type="primary">
            Add
          </el-button>
          <el-button icon="el-icon-plus" type="primary" disabled>
            Add
          </el-button>
        </el-row>
        <el-row>
          <h3>类型</h3>
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="info">信息按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
        </el-row>
        <el-row>
          <h3>带轮廓按钮</h3>
          <el-button class="btn-outline">default</el-button>
          <el-button class="btn-outline" disabled>
            禁用
          </el-button>
          <el-button class="btn-outline" type="primary">
            primary
          </el-button>
          <el-button class="btn-outline" type="primary" disabled>
            禁用
          </el-button>
        </el-row>
        <el-row>
          <h3>文本按钮</h3>
          <el-button type="text">文字按钮</el-button>
          <el-button type="text" disabled>
            文字按钮禁用
          </el-button>
          <el-button class="btn-link" type="text">
            文字链接按钮
          </el-button>
          <el-button class="btn-gray" type="text">
            灰色文字按钮
          </el-button>
          <el-button class="btn-gray" type="text" disabled>
            灰色文字按钮禁用
          </el-button>
          <el-button class="btn-gray btn-link" type="text">
            灰色链接文字按钮
          </el-button>
        </el-row>
        <el-row>
          <h3>禁用状态</h3>
          <el-button disabled>默认按钮</el-button>
          <el-button type="primary" disabled>
            主要按钮
          </el-button>
          <el-button type="success" disabled>
            成功按钮
          </el-button>
          <el-button type="info" disabled>
            信息按钮
          </el-button>
          <el-button type="warning" disabled>
            警告按钮
          </el-button>
          <el-button type="danger" disabled>
            危险按钮
          </el-button>
        </el-row>
      </div>
    )
  }
}

export default UiButton
