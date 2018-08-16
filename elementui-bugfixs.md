## ElCheckboxGroup坑
```
<el-checkbox-group v-model="checkboxGroups">   
    <el-checkbox :label="1"></el-checkbox>
    <el-checkbox :label="2"></el-checkbox>
    ...
</el-checkbox-group>
```
```javascript
new Vue({
  data () {
    return {
      checkboxGroups: []
    }
  }
})
// 当checkboxGroups初始状态为空数组（[]）时，其子项ElCheckbox已渲染完成
// 实际需要动态获取checkboxGroups（如等待服务端返回），此时不会因为checkboxGroups的更新而选中更新后的项目
```
