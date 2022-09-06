const UiDropdown = {
  name: 'UiDropdown',

  data() {
    return {
      dropdownOptions: [
        {
          title: '黄金糕',
          value: '01'
        },
        {
          title: '狮子头',
          value: '02'
        },
        {
          title: '螺蛳粉',
          value: '03'
        },
        {
          title: '双皮奶',
          value: '04'
        },
        {
          title: '蚵仔煎',
          value: '05'
        }
      ]
    }
  },

  render(h) {
    return (
      <div>
        <el-row>
          <h3>尺寸</h3>
          <el-dropdown class="mr__s" split-button type="primary">
            Default
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s" size="large" split-button type="primary">
            Large Button
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s" size="medium" split-button type="primary">
            Medium Button
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s" size="small" split-button type="primary">
            Small Button
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s" size="mini" split-button type="primary">
            Mini Button
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown size="micro" split-button type="primary">
            Micro Button
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-row>
          <h3>带轮廓样式</h3>
          <el-dropdown class="mr__s outline" split-button>
            Default
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s outline" split-button type="primary">
            Primary
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-row>
          <h3>默认样式</h3>
          <el-dropdown class="mr__s" split-button>
            Default
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="mr__s" split-button type="primary">
            Primary
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-row>
          <h3>菜单样式</h3>
          <el-dropdown class="mr__s">
            <span class="el-dropdown-link">
              Default menu
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown>
            <span class="el-dropdown-link primary">
              Primary Menu
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              {this.dropdownOptions.map(option => (
                <el-dropdown-item>{option.title}</el-dropdown-item>
              ))}
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
      </div>
    )
  }
}

export default UiDropdown
