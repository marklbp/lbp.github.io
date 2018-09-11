import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { hashHistory } from 'react-router';
import { BaseComponent } from 'base';
/*import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';

import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';*/
import '../../../../../node_modules/ueditor/example/public/ueditor/themes/default/css/ueditor.css';
import '../../../../../node_modules/ueditor/example/public/ueditor/ueditor.config.js';
import '../../../../../node_modules/ueditor/example/public/ueditor/ueditor.all.js';
import '../../../../../node_modules/ueditor/example/public/ueditor/lang/zh-cn/zh-cn.js'
import Cookie from '../../../../base/utils/Cookie';

import {
  Input,
  Grid,
  Select,
  Button,
  DatePicker,
  Form,
  Feedback
} from '@icedesign/base';
import {
  FormBinderWrapper as  IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

import { Title, PchTable, PchPagination } from 'components';
import Req from '../../reqs/ContractReq';
import Preview from './Preview';

import './index.scss';
const formItemLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const {Row, Col} = Grid;
const {Option} = Select;
const FormItem = Form.Item;
const Toast = Feedback.toast;

class AddEit extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      moduleStatus:0,
      value: {},
      //editorState: EditorState.createEmpty()
    }
  }
  componentWillMount() {
    //this.initPage()
  }
  componentDidMount(){
    var ue = UE.getEditor('editor');
  }
  handleSubmit(){

  }
  //取消
  cancelSubmit() {
    hashHistory.push('contract')
  }
  render() {
    const { editorState, value, moduleStatus } = this.state;
    const { templateContent, templateName } = this.state.value;

    return(
      <IceContainer className="pch-container contract-edit-pages">
          <Title title="合同新增" />
          <div className="pch-form">
          { moduleStatus == 0?
            <IceFormBinderWrapper  value={value} ref="form">
              <Form size="large">
                <Row wrap justify="center">
                  <Col span="6">
                    <FormItem {...formItemLayout} label="合同名称:">
                      <IceFormBinder
                        name="templateName"
                        required
                        message="合同名称不为空">
                          <Input size="large" placeholder="合同名称"/>
                      </IceFormBinder>
                      <IceFormError name="templateName" />
                    </FormItem>
                  </Col>
                  <Col span={20}>
                      <IceFormBinder
                        name="templateContent"
                        required
                        message="合同内容不为空">
                        <script id="editor" type="text/plain"></script>
                      </IceFormBinder>
                      <IceFormError name="templateContent" />
                      {/*<textarea style={{'width':'100%', 'resize':'vertical'}} disabled value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}/>*/}
                  </Col>
                  <Col span={24}>
                    <div className="btns-wrap">
                      <Button
                        onClick={this.cancelSubmit.bind(this)}
                        type="normal"
                        size="large">
                          取消
                      </Button>
                      <Button
                        onClick={this.handleSubmit.bind(this)}
                        type="primary"
                        size="large">
                          保存
                      </Button>
                      <Button
                        onClick={()=>this.previewStatus(1)}
                        type="secondary"
                        size="large">
                          预览
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </IceFormBinderWrapper>
            :
            <Preview templateContent={templateContent} templateName={templateName} onClick={(moduleStatus)=>this.previewStatus(moduleStatus)}/>
          }
          </div>
      </IceContainer>
    )
  }
}

export default AddEit;
