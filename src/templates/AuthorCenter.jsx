/*
* @Author: lixiwei
* @Date:   2018-03-18 17:09:17
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-27 11:21:24
*/
import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Button, Upload, message, Modal, Input, Select, Form, Row, Col, Table, Switch } from 'antd';
import axios from 'axios';
import '../css/AuthorCenter.css';
import Header from './Header';

const { Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

function info(title,content) {
    Modal.info({
        title: title,
        content: (
			<div>
				<p>{content}</p>
			</div>
        ),
        okText: '确定',
        onOk() {},
    });
}

function error(title,content) {
    Modal.error({
        okText: '确定',
        title: title,
        content:content
    });
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Thesis extends　Component{
    constructor () {
        super();
        this.state = {
            file1: {},
            file2: {},
            uploading: false,
            operationArg: null,
            visible: false,
			finished: false,
        }
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
        if(sessionStorage.getItem("thesis")){
			this.props.form.setFieldsValue(JSON.parse(sessionStorage.getItem("thesis")));
		}
    }

    componentDidUpdate() {
        console.log(this.props.form.getFieldsValue());
    }

    componentWillUnmount(){
    	if(!this.state.finished){
            sessionStorage.setItem("thesis",JSON.stringify(this.props.form.getFieldsValue()));
		}
	}

    handleUpload = () => {
        let { file1 } = this.state;
        let { file2 } = this.state;
        const formData = new FormData();
        let self = this;

        formData.append(file1.name, file1);
        formData.append(file2.name, file2);

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        axios.post('//jsonplaceholder.typicode.com/posts/', formData).then(function (response) {
            self.setState({
                file1: {},
                file2: {},
                uploading: false,
            });
            self.setState({
                finished: true,
            });
            self.props.form.resetFields();
            sessionStorage.removeItem("thesis");
            message.success('上传稿件成功！');
            setTimeout(()=>{window.location.reload()},3000);
            //   跳转稿件纪录
        }).catch(function () {
            self.setState({
                uploading: false,
            });
            error("失败",'上传失败，请稍候重试！');
        });
    }

    handleStepChange = (step) => {
        this.props.stepChange(step);
    }

    checkError = (id) => {
        // Only show error after a field is touched.
    	return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
	}

    removeAuthor = () => {
        const { form } = this.props;
        const authors = form.getFieldValue('authors');
        authors.pop();
        form.setFieldsValue({
            // authors: authors.filter(key => key !== k),
			authors: authors
        });
    }

    addAuthor = () => {
        const { form } = this.props;
        const authors = form.getFieldValue('authors');
        const nextKeys = authors.concat(authors.length);
        form.setFieldsValue({
            authors: nextKeys,
        });
    }

    clearSubmit = () => {
        this.props.form.resetFields();
        sessionStorage.removeItem("thesis");
        this.modalClose();
	}

    modalOpen = (...arg) => {
    	this.setState({
            operationArg: arg,
            visible: true,
        });
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldValue  } = this.props.form;
        const { uploading } = this.state;
        const props1 = {
            action: '//jsonplaceholder.typicode.com/posts/',
            showUploadList:false,
            onRemove: () => {
                this.setState({
                    file1: {},
                });
            },
            beforeUpload: (file) => {
                if (file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    message.error('论文文件格式错误，请上传doc、docx或pdf');
                    this.setState({
                        file1: {},
                    });
                }else {
                    this.setState({
                        file1: file,
                    });
                }
                return false;
            },
            file1: this.state.file1,
        };
        const props2 = {
            action: '//jsonplaceholder.typicode.com/posts/',
            showUploadList:false,
            onRemove: () => {
                this.setState({
                    file2: {},
                });
            },
            beforeUpload: (file) => {
            	const fileType = file.name.split(".").pop();
                if (fileType !== '7z' && fileType !== 'rar' && file.type !== 'application/x-zip-compressed') {
                    message.error('附件文件格式错误，请上传zip、7z或rar');
                    this.setState({
                        file2: {},
                    });
                }else {
                    this.setState({
                        file2: file,
                    });
                }
                return false;
            },
            file2: this.state.file2,
        };
        getFieldDecorator('authors', { initialValue: [] });
        const authorsValue = getFieldValue('authors');
        const authors = authorsValue.map((k, index) => {
            return (
            	<div>
					<Row gutter={16}>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError(`author-${k}`) ? 'error' : ''}
								help={this.checkError(`author-${k}`) || ''}
								required={false}
								key={`author-${k}`}
							>
                                {getFieldDecorator(`author-${k}`, {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: "作者不能为空!",
                                    }],
                                })(
									<Input placeholder="author"/>
                                )}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError(`unit-${k}`) ? 'error' : ''}
								help={this.checkError(`unit-${k}`) || ''}
								key={`unit-${k}`}
							>
                                {getFieldDecorator(`unit-${k}`, {
                                    rules: [{ message: '单位不能为空格!', whitespace: true }]
                                })(
									<Input placeholder="unit"/>
                                )}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError(`email-${k}`) ? 'error' : ''}
								help={this.checkError(`email-${k}`) || ''}
								key={`email-${k}`}
							>
                                {getFieldDecorator(`email-${k}`, {
                                    rules: [{ message: '请输入正确的邮箱格式!', type:'email' }],
                                })(
									<Input placeholder="email"/>
                                )}
							</FormItem>
						</Col>
					</Row>
				</div>
            )});

        return (
			<div id="uploadDiv">
				<Form>
					<Row gutter={16}>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError('title') ? 'error' : ''}
								help={this.checkError('title') || ''}
								label={(
									<span>
									  论文题目
									</span>
                                )}
							>
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '论文标题不能为空!', whitespace: true }],
                                })(
									<Input placeholder="Title" />
                                )}
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem
								validateStatus={this.checkError('academicsec') ? 'error' : ''}
								help={this.checkError('academicsec') || ''}
								label={(
									<span>
									  学术领域
									</span>
                                )}
							>
                                {getFieldDecorator('academicsec', {
                                    rules: [{ required: true, message: '学术领域不能为空!', initialValue:'lucy' }],
                                })(
									<Select>
										<Option value="jack">Jack</Option>
										<Option value="lucy">Lucy</Option>
										<Option value="disabled" disabled>Disabled</Option>
										<Option value="Yiminghe">yiminghe</Option>
									</Select>
                                )}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord1') ? 'error' : ''}
								help={this.checkError('chKeyWord1') || ''}
								label={(
									<span>
								  中文关键词
								</span>
                                )}
							>
                                {getFieldDecorator('chKeyWord1', {
                                    rules: [{ required:true, pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input placeholder="chKeyWord" />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord2')  ? 'error' : ''}
								help={this.checkError('chKeyWord2')  || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord2', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord3') ? 'error' : ''}
								help={this.checkError('chKeyWord3') || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord3', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('chKeyWord4') ? 'error' : ''}
								help={this.checkError('chKeyWord4') || ''}
							>
								<br/>
                                {getFieldDecorator('chKeyWord4', {
                                    rules: [{ pattern:'^[\u4e00-\u9fa5]*$', message: '请输入中文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord1') ? 'error' : ''}
								help={this.checkError('enKeyWord1') || ''}
								label={(
									<span>
									英文关键词
									</span>
                                )}
							>
                                {getFieldDecorator('enKeyWord1', {
                                    rules: [{ required:true, pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input placeholder="enKeyWord" />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord2') ? 'error' : ''}
								help={this.checkError('enKeyWord2') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord2', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord3') ? 'error' : ''}
								help={this.checkError('enKeyWord3') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord3', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
						<Col span={3}>
							<FormItem
								validateStatus={this.checkError('enKeyWord4') ? 'error' : ''}
								help={this.checkError('enKeyWord4') || ''}
							>
								<br/>
                                {getFieldDecorator('enKeyWord4', {
                                    rules: [{ pattern:'^[^\u4e00-\u9fa5]+$', message: '请输入英文关键词!', whitespace: true }]
                                })(
									<Input />
                                )}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError('author') ? 'error' : ''}
								help={this.checkError('author') || ''}
								label={(
									<span>
									  作者
									</span>
                                )}
							>
                                {getFieldDecorator('author', {
                                    rules: [{ required: true, message: '第一作者不能为空!', whitespace: true }]
                                })(
									<Input placeholder="first author"/>
                                )}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								validateStatus={this.checkError('unit') ? 'error' : ''}
								help={this.checkError('unit') || ''}
								label={(
									<span>
									  单位
									</span>
                                )}
							>
                                {getFieldDecorator('unit', {
                                    rules: [{ required: true, message: '第一作者单位不能为空!', whitespace: true }]
                                })(
									<Input placeholder="unit"/>
                                )}
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem
								validateStatus={this.checkError('email') ? 'error' : ''}
								help={this.checkError('email') || ''}
								label={(
									<span>
									  邮箱
									</span>
                                )}
							>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: '请输入正确的邮箱格式!', type:'email' }],
                                })(
									<Input placeholder="email"/>
                                )}
							</FormItem>
						</Col>
					</Row>
					{authors}
					<Button type="dashed" onClick={this.addAuthor} style={{ width: '8rem', marginRight:'2rem' }}>
						<Icon type="plus" /> 添加作者
					</Button>
					<Button type="dashed" onClick={this.removeAuthor} style={{ width: '8rem' }}>
						<Icon type="minus" /> 删除作者
					</Button>
					<Row>
						<FormItem
							validateStatus={this.checkError('chAbstract') ? 'error' : ''}
							help={this.checkError('chAbstract') || ''}
							label={(
								<span>
								  中文摘要
								</span>
							)}
						>
							{getFieldDecorator('chAbstract', {
								rules: [{ required: true, message: '请输入中文摘要!', whitespace: true }]
							})(
								<TextArea autosize={{minRows: 3}} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem
							validateStatus={this.checkError('enAbstract') ? 'error' : ''}
							help={this.checkError('enAbstract') || ''}
							label={(
								<span>
								  英文摘要
								</span>
                            )}
						>
                            {getFieldDecorator('enAbstract', {
                                rules: [{ required: true, message: '请输入英文摘要!', whitespace: true }]
                            })(
								<TextArea autosize={{minRows: 3}} />
                            )}
						</FormItem>
					</Row>
					<Button type="primary" onClick={this.modalOpen} style={{ marginBottom: '1rem' }}>
						重置论文信息
					</Button>
					<Modal
						visible={this.state.visible}
						onCancel={this.modalClose}
						title="重置确认"
						footer={[
							<Button key="submit" type="primary" size="large" onClick={this.clearSubmit}>
								确定
							</Button>,
							<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
					>
						<p>您确定要重置已填信息吗？</p>
					</Modal>
				</Form>
				<p>
					请将论文及相关附件压缩包分别上传：
					<br/>
					1）论文
					<br/>
					2）附件，例如：
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;论文的研究背景，包括本研究属于哪个领域的哪个具体问题，目前已经解决到什么程度，本文将从哪些方面进行解决；
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;实验测试数据，方便重复验证；
					<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;创新说明，以助于审稿专家快速地对文章质量进行公正客观的评价，提高文章接受率。
				</p>
				<div id="uploadSelectDiv">
					<Dragger {...props1}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="uploadText">
							{this.state.file1.name? this.state.file1.name : '点击或者拖拽文件进行论文选择（doc、docx、pdf）'}
						</p>
					</Dragger>
					<div style={{ margin:'0 1rem' }}/>
					<Dragger {...props2}>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="uploadText">
                            {this.state.file2.name ?  this.state.file2.name : '点击或者拖拽文件进行附件选择（zip、7z、rar）'}
						</p>
					</Dragger>
				</div>
				<div id="uploadBtnDiv">
					<Button
						type="primary"
						style={{ marginRight:'2rem' }}
						disabled={uploading}
						onClick={() => this.handleStepChange(2)}
					>
						上一步
					</Button>
					<Button
						className="uploadStart"
						type="primary"
						onClick={this.handleUpload}
						disabled={this.state.file1 === {} || hasErrors(this.props.form.getFieldsError())}
						loading={uploading}
					>
                        {uploading ? '上传中' : '确定投稿' }
					</Button>
				</div>
			</div>
        );
    }
}
const ThesisForm = Form.create()(Thesis);

class Record extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            unfinishedLoading: true,
            finishedLoading: true,
            visible: false,
            fileList: {},
            operationArg: null,
            dataUnfinished: [{
                key: '1',
                title: '数据科学与大数据技术专业特色课程研究',
                academicsec: '课程研究',
                submitDate: '2017-12-05',
                thesisState: '待修改',
                suggestion: '123',
            },{
                key: '2',
                title: '有理分形曲面造型及其在图像超分辨中的应用',
                academicsec: '图像处理',
                submitDate: '2017-07-18',
                thesisState: '待修改',
                suggestion: '456',
            }],
            dataFinished: [{
                key: '1',
                title: '特殊图的图修正问题研究综述',
                academicsec: '应用数学',
                submitDate: '2017-01-09',
                thesisState: '审阅中',
            },{
                key: '2',
                title: '社交网络用户认知域特征预测研究综述',
                academicsec: '网络安全',
                submitDate: '2016-12-17',
                thesisState: '待缴费',
            },{
                key: '3',
                title: '一类特殊基函数构造的参数曲线',
                academicsec: '计算机辅助几何',
                submitDate: '2017-07-18',
                thesisState: '待缴费',
            },{
                key: '4',
                title: '基于深度神经网络的图像语句转换方法发展综述',
                academicsec: '图像语义分析',
                submitDate: '2017-06-18',
                thesisState: '待发布',
            },{
                key: '5',
                title: '基于区间梯度的联合双边滤波图像纹理去除方法',
                academicsec: '图像处理',
                submitDate: '2017-07-18',
                thesisState: '已发布',
            }],
        };
        this.columnsUnfinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        }, {
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
				<span>
					<Button onClick={() => info('审阅意见',record.suggestion)}>审阅意见</Button>
					<span className="ant-divider" />
					<Button onClick={() => this.download(record.key)}>下载</Button>
					<span className="ant-divider" />
					<Upload
						showUploadList={false}
						beforeUpload = {(file) => this.beforeUpload(record.key,file)}
					>
						{
                            this.state.fileList[record.key] !== undefined ?
								<Button>
									<Icon type="upload" /> {this.state.fileList[record.key].name}
								</Button>
								:
								<Button>
									<Icon type="upload" />上传
								</Button>
                        }
					  </Upload>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen(record.key)}>提交</Button>
				</span>
            ),
        }];
        this.columnsFinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '学术领域',
            dataIndex: 'academicsec',
            key: 'academicsec',
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        }, {
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }];
    }

    download = (key) => {
        axios.post('', key).then(function (response) {
            window.location.href = response.data;
        }).catch(function () {
            error("失败", '下载失败，请稍候重试！');
        });
    }

    beforeUpload = (key,file) => {
        const files = this.state.fileList;
        if (file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            message.error('稿件文件格式错误，请上传doc、docx或pdf');
        }else {
            files[key] = file;
            this.setState({
                fileList: files,
            });
		}
        return false;
    }

    submitNew = () => {
        let { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        let self = this;

        if(fileList[this.state.operationArg[0]]){
            formData.append(fileList[this.state.operationArg[0]].name, fileList[this.state.operationArg[0]]);
            this.setState({
                confirmLoading: true,
            });

            axios.post('//jsonplaceholder.typicode.com/posts/', formData).then(function (response) {
                self.modalClose();
                self.setState({
                    file: null,
                    confirmLoading: false,
                });
                message.success('上传稿件成功！');
				self.setState({
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
				})
            }).catch(function () {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败", '提交失败，请稍候重试！');
            });
        }else{
            this.modalClose();
            error("失败", '未选择上传文件，请确认重试！');
		}
    }

    modalOpen = (...arg) => {
        this.setState({
			operationArg: arg,
            visible: true,
        });
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    componentDidMount(){
        this.setState({
            unfinishedLoading: false,
            finishedLoading: false,
        })
	}

  	render() {
	    return (
			<Tabs animated={false} tabPosition="top" defaultActiveKey='1' style={{ paddingTop:'1rem' }}>
			    <TabPane tab="未完成" key="1">
					<Table loading={this.state.unfinishedLoading} columns={this.columnsUnfinished} dataSource={this.state.dataUnfinished} bordered scroll={{ x: '71rem' }}/>
					<Modal
						visible={this.state.visible}
						onCancel={this.modalClose}
						title="提交确认"
						footer={[
							<Button key="submit" type="primary" size="large" onClick={this.submitNew} loading={this.state.confirmLoading}>
								确定
							</Button>,
							<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
					>
						<p>您确定要提交修改后的稿件吗？</p>
					</Modal>
				</TabPane>
			    <TabPane tab="已完成" key="2">
					<Table loading={this.state.finishedLoading} columns={this.columnsFinished} dataSource={this.state.dataFinished} bordered />
				</TabPane>
		  	</Tabs>
	    );
  	}
}

class Submit extends Component{
    constructor () {
        super();
        this.state = {
			stepDivClassName:{
        		step1:'submitDivShow',
                step2:'submitDivNone',
                step3:'submitDivNone',
			},
			step: 1
        }
    }

    componentWillMount () {
        if(sessionStorage.getItem("submitStep") && sessionStorage.getItem("submitStep") == 3){
        	this.handleStepChange(3);
            sessionStorage.removeItem("submitStep")
		}
    }

    componentWillUnmount(){
    	if(this.state.step == 3){
            sessionStorage.setItem("submitStep",3);
		}
    }

    handleStepChange = (step) =>{
        switch (step){
			case 1:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivShow',
                        step2:'submitDivNone',
                        step3:'submitDivNone',
                    },
                    step:step
                });
				break;
			case 2:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivNone',
                        step2:'submitDivShow',
                        step3:'submitDivNone',
                    },
                    step:step
                });
                break;
            case 3:
                this.setState({
                    stepDivClassName:{
                        step1:'submitDivNone',
                        step2:'submitDivNone',
                        step3:'submitDivShow',
                    },
                    step:step
                });
                break;
			default:
				break;
        }
	}

    render() {
        const userName = "李西炜";
        //const userName =localStorage.getItem("");
    	const authorizationDate = new Date().toString();

        return (
        	<div>
				<div id="step1" className={this.state.stepDivClassName.step1}>
					<div className="submitDiv">
						<article id="submissionRule">
							<h1 style={{ textAlign:'center' }}>投稿要求</h1>
							<p>为使来稿更符合国家科技期刊出版标准，做到严谨规范，我编辑部现对来稿要求如下：
								<br/>
								1.文字精炼、言简意赅，一般在8000字左右;并附200字左右的中、英文摘要及题目、作者和工作单位英译名；首页页脚注明作者学历、职称及研究方向，如有基金资助请给出项目名称及编号；文末请列出主要参考文献。具体格式参照网站（www.jsjkx.com）首页“资料中心-投稿模板”。
								<br/>
								2．使用规范的数学符号进行公式编写，正确使用大小写、正斜体、上下标。所附图形一律用Visio图形处理软件进行制作，尽量不使用使用彩色（我刊采用黑白印刷），尽量不使用图片形式，不用扫描方式植入，请务必确保图形清晰。图形具体规范请参见网站首页“资料中心-图像规范要求”。表格请做成三线表，表内字体用小6号仿宋或Times New Roman。
								<br/>
								3．参考文献格式标准化
								<br/>
								参考文献中个人著者采用姓前明后的形式，姓的每个字母均需大写，3人以上者，录入前3人姓名后加“等”，英文姓名则加“et al”；中文参考文献须同时给出中英文版。具体著录格式如下：
								<br/>
								[1]著者.题目[J].刊名，出版年，卷号（期号）：起止页码.
								<br/>
								[2]著者.书名[M].译者，译.出版地：出版者，出版年：起止页码.
								<br/>
								[3]著者.析出文献题目[C]//会议论文集名，出版地：出版社，出版年：起止页码.
								<br/>
								[4]著者.题名[D].所在城市：学位授予单位，出版年.
								<br/>
								[5]著者.题名：报告号[R].出版地（城市名）：出版者，出版年.
								<br/>
								[6]著者.标准名称：标准编号[S].出生地，出版者，出版年.
								<br/>
								[7]著者.题名[N].报纸名，出版日期（版次）（出版日期按 YY-MM-DD 格式）.
								<br/>
								[8]著者.题名[文献类型标志/电子文献载体标志].（更新日期）[应用日期].获取和访问路径（如http://www.arocmag.com）.
								<br/>
								[9]专利所有者.专利题名：专利国别，专利号[P].公告日期[应用日期].获取和访问地址.
								<br/>
								4.本刊只接受网站在线投稿，具体投稿流程请参见网站首页“资料中心-稿件处理流程”。
								<br/>
								5.如果第一作者为CCF会员的录用稿件，版面费8.5折优惠，因此若为CCF会员，请务必在投稿时注明。
								<br/>
								6.学生来稿请征得导师同意；严禁侵权、一稿多投、泄密、剽窃他人作品等行为，若有发现，期刊将做严肃处理；投稿后，作者及单位不得更改。
								<br/>
								7.来稿请遵照我刊编辑规范，特别是图形、公式、正斜体的规范。
								<br/>
								8.本刊已被《中国学术期刊网路出版总库》、《中文科技期刊数据库》、《万方数据一数字化期刊群》及CNKI系列数据库收录，本刊所付稿酬中含作者文
								章著作使用费。如作者不同意论文被以上数据库收录，请来搞时说明，本刊将做适当处理。</p>
						</article>
						<Button type="primary" onClick={() => this.handleStepChange(2)}>下一步</Button>
					</div>
				</div>
				<div id="step2" className={this.state.stepDivClassName.step2}>
					<div className="submitDiv">
						<article id="authorization">
							<h2 style={{ textAlign:'center' }}>著作权专有许可使用授权书</h2>
							<p>编辑部：<br/>
								&nbsp;&nbsp;&nbsp;&nbsp;我（们）同意将本论文的专有许可使用权授予编辑部。编辑部对本论文具有以下专有使用权：出版权、汇编权（文章的部分或全部）、电子版的复制权、翻译权、网络传播权、发行权及许可文献检索系统或数据库收录权。未经《编辑部书面许可，对于本论文的任何部分，他人不得以任何形式汇编、转载、出版。<br/>
								&nbsp;&nbsp;&nbsp;&nbsp;我（们）保证本论文为原创作品、无一稿两投，并且不涉及保密及其他与知识产权有关的侵权问题。若发生以上侵权、泄密等问题，一切责任由我（们）负责。本授权书于编辑部接受本论文之日起生效。有效期到该论文出版后的第10年12月31日为止。</p>
							<p>授权人：{ userName }</p>
							<p>授权时间：{ authorizationDate }</p>
						</article>
						<div>
							<Button type="primary" style={{ marginRight:'2rem' }} onClick={() => this.handleStepChange(3)}>同意</Button>
							<Button type="primary" onClick={() => this.handleStepChange(1)}>不同意</Button>
						</div>
					</div>
				</div>
				<div id="step2" className={this.state.stepDivClassName.step3}>
					<h1 style={{ textAlign:'center' }}>上传稿件</h1>
					<ThesisForm stepChange={this.handleStepChange}/>
				</div>
			</div>
        );
    }
}

class Payment extends Component{
    constructor () {
        super();
        this.state = {
            fileChange: false,
            confirmLoading: false,
            visible: false,
            fileList: {},
            operationArg: null,
            unfinishedLoading: true,
            finishedLoading: true,
            expandedRowKeys: [],
            dataUnfinished: [{
                key: '1',
                title: '社交网络用户认知域特征预测研究综述',
                expense: '50',
                submitDate: '2016-12-17',
                thesisState: '待缴费',
                type: '审稿费',
                needReceipt: false,
                receiptTitle: '1',
                receiptNum: '2',
                address: '3',
                receiver: '4',
            },{
				key: '2',
				title: '一类特殊基函数构造的参数曲线',
				expense: '120',
				submitDate: '2017-07-18',
				thesisState: '待缴费',
                type: '版面费',
                needReceipt: false,
                receiptTitle: '',
                receiptNum: '',
                address: '',
                receiver: '',
        	}],
            dataFinished: [{
                key: '1',
                title: '基于深度神经网络的图像语句转换方法发展综述',
                expense: '150',
                submitDate: '2017-06-18',
                thesisState: '已缴费',
            },{
                key: '2',
                title: '基于区间梯度的联合双边滤波图像纹理去除方法',
                expense: '200',
                submitDate: '2017-07-18',
                thesisState: '已缴费',
            }],
        };
        this.columnsUnfinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
        },{
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        },{
            title: '费用类型',
            dataIndex: 'type',
            key: 'type',
            className: 'expandedRow'
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return(
					<span>
						<Switch checkedChildren="需要发票" unCheckedChildren="无需发票" onChange={(checked) => this.receiptChange(record,checked)} />
						<span className="ant-divider"/>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={(file) => this.beforeUpload(record.key, file)}
						>
							{
								this.state.fileList[record.key] !== undefined ?
									<Button>
										<Icon type="upload"/> {this.state.fileList[record.key].name}
									</Button>
									:
									<Button>
										<Icon type="upload"/>上传
									</Button>
							}
						</Upload>
						<span className="ant-divider"/>
						<Button type="primary" onClick={() => this.modalOpen(record.key, 'submitPayment')}>提交</Button>
					</span>
				)
            },
        }];
        this.columnsFinished = [{
            title: '论文标题',
            dataIndex: 'title',
            key: 'title',
        },{
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
        },{
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        },{
            title: '发票抬头',
            dataIndex: 'receiptTitle',
            key: 'receiptTitle',
        },{
            title: '税号',
            dataIndex: 'receiptNum',
            key: 'receiptNum',
        },{
            title: '邮寄地址',
            dataIndex: 'address',
            key: 'address',
        },{
            title: '接收人',
            dataIndex: 'receiver',
            key: 'receiver',
        },{
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }];
    }

    receiptChange = (record, checked) => {
        let oldData = [...this.state.dataUnfinished];
        const key = record.key;
        let newData = oldData.map((obj) => {
            if (key == obj.key) {
                obj['needReceipt'] = !obj.needReceipt;
            }
            return obj;
        });
		if(checked){
            newData = [...this.state.expandedRowKeys,key];
            this.setState({
                expandedRowKeys: newData,
			})
		}else{
            newData = [...this.state.expandedRowKeys].filter(item => item !== key);
            this.setState({
                expandedRowKeys: newData,
            })
		}
	}

    handleChange(value, key, column) {
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataUnfinished: newData });
        }
    }

    beforeUpload = (key,file) => {
        const files = this.state.fileList;
        const fileChange = this.state.fileChange;
        files[key] = file;
        this.setState({
            fileList: files,
            fileChange: !fileChange,
        });
        return false;
    }

    submitPayment = () => {
        let { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        let self = this;

        if(fileList[this.state.operationArg[0]]){
            formData.append(fileList[this.state.operationArg[0]].name, fileList[this.state.operationArg[0]]);
            this.setState({
                confirmLoading: true,
            });

            axios.post('//jsonplaceholder.typicode.com/posts/', formData).then(function (response) {
                self.modalClose();
                self.setState({
                    file: null,
                    confirmLoading: false,
                });
                message.success('上传稿件成功！');
                self.setState({
                    dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
                })
            }).catch(function () {
                self.modalClose();
                self.setState({
                    confirmLoading: false,
                });
                error("失败", '提交失败，请稍候重试！');
            });
        }else{
            this.modalClose();
            error("失败", '未选择上传文件，请确认重试！');
        }
    }

    modalOpen = (...arg) => {
    	switch (arg[1]){
			case "submitPayment":
                this.setState({
                    operationArg: arg,
                    visible: true,
                });
                break;
		}
    }

    modalClose = () => {
        this.setState({
            visible: false,
        });
    }

    handleFormChange = (changedFields,key) => {
    	const oldData = [...this.state.dataUnfinished];
    	let name;
    	let value;
    	let index;
        for (index in changedFields){
            name = changedFields[index].name;
            value = changedFields[index].value;
        }
        const newData = oldData.map((obj) => {
        	if(key === obj.key){
				obj[name] = value;
			}
			return obj;
		});
		this.setState({
			dataUnfinished: newData
		})
    }

    componentDidMount() {
        this.setState({
            unfinishedLoading: false,
			finishedLoading: false,
		})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextState) == JSON.stringify(this.state)){
            return false;
        }
        return true;
    }

    render() {
        return (
			<Tabs animated={false} tabPosition="top" defaultActiveKey="1" style={{ paddingTop:'1rem' }}>
				<TabPane tab="未完成" key="1">
					<Table
						loading={this.state.unfinishedLoading}
						expandedRowRender = {record => {
                            class ExpandedRow extends Component{
                                checkError = (id) => {
                                    // Only show error after a field is touched.
                                    return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
                                }

                                render(){
                                    const { getFieldDecorator } = this.props.form;
                                    return (
                                        <Form>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiptTitle') ? 'error' : ''}
                                                        help={this.checkError('receiptTitle') || ''}
                                                        label={(
                                                            <span>
                                                                发票抬头
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiptTitle', {
                                                            rules: [{ required: true, message: '发票抬头不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiptNum') ? 'error' : ''}
                                                        help={this.checkError('receiptNum') || ''}
                                                        label={(
                                                            <span>
                                                                税号
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiptNum', {
                                                            rules: [{ required: true, message: '税号不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('address') ? 'error' : ''}
                                                        help={this.checkError('address') || ''}
                                                        label={(
                                                            <span>
                                                                邮寄地址
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('address', {
                                                            rules: [{ required: true, message: '邮寄地址不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={10}>
                                                    <FormItem
                                                        validateStatus={this.checkError('receiver') ? 'error' : ''}
                                                        help={this.checkError('receiver') || ''}
                                                        label={(
                                                            <span>
                                                                接收人
                                                            </span>
                                                        )}
                                                    >
                                                        {getFieldDecorator('receiver', {
                                                            rules: [{ required: true, message: '接收人不能为空!', whitespace: true }],
                                                        })(
                                                            <Input />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Form>
                                    );
                                }
                            }
                            const ExpandedRowForm = Form.create({
                                onFieldsChange(props, changedFields) {
                                	const key = props.record.key;
                                    props.onChange(changedFields,key);
                                },
                                mapPropsToFields(props) {
                                    console.log(props.record);
                                    return {
                                        receiptTitle: Form.createFormField({
                                            name: 'receiptTitle',
                                            value: props.record.receiptTitle,
                                        }),
                                        receiptNum: Form.createFormField({
                                            name: 'receiptNum',
                                            value: props.record.receiptNum,
                                        }),
                                        address: Form.createFormField({
                                            name: 'address',
                                            value: props.record.address,
                                        }),
                                        receiver: Form.createFormField({
                                            name: 'receiver',
                                            value: props.record.receiver,
                                        }),
                                    };
                                },
                            })(ExpandedRow);
							return(
                                <ExpandedRowForm record={record} onChange={this.handleFormChange} />
							)
						}}
						expandedRowKeys = {this.state.expandedRowKeys}
						expandIconAsCell = {false}
						expandIconColumnIndex = {-1}
						columns={this.columnsUnfinished}
						dataSource={this.state.dataUnfinished}
						bordered scroll={{ x: '52rem' }} />
					<Modal
						visible={this.state.visible}
						onCancel={this.modalClose}
						title="提交确认"
						footer={[
							<Button key="submit" type="primary" size="large" onClick={this.submitPayment} loading={this.state.confirmLoading}>
								确定
							</Button>,
							<Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
					>
						<p>您确定要提交缴费信息吗？</p>
					</Modal>
				</TabPane>
				<TabPane tab="已完成" key="2">
					<Table loading={this.state.finishedLoading} columns={this.columnsFinished} dataSource={this.state.dataFinished} bordered />
				</TabPane>
			</Tabs>
        );
    }
}

class AuthorCenter extends Component{
    constructor () {
        super();
        this.state = {
            selectedKeys: "1",
        }
    }

    menuSelect = (e) => {
        this.setState({
            selectedKeys: e.key,
        });
	}

	render() {
		return (
			<Layout>
		    	<Header />
		        <Layout style={{ border:'bold solid 0.1rem', padding: '1rem', height: '38rem'}}>
			        <Sider style={{ width: '25%'}}>
						<Menu
							mode="inline"
							inlineCollapsed = "false"
							selectedKeys={[this.state.selectedKeys]}
							style={{ height: '100%'}}
							onSelect={this.menuSelect}
						>
							<MenuItemGroup key="i1" title={<span><Icon type="bars" /><span>功能菜单</span></span>}>
								<Menu.Item key="1">稿件纪录</Menu.Item>
								<Menu.Item key="2">在线投稿</Menu.Item>
								<Menu.Item key="3">费用中心</Menu.Item>
							</MenuItemGroup>
							<MenuItemGroup key="i2" title={<span><Icon type="user" /><span>个人设置</span></span>}>
								<Menu.Item key="4">个人信息</Menu.Item>
								<Menu.Item key="5">修改密码</Menu.Item>
							</MenuItemGroup>
						</Menu>
			        </Sider>
			        <Content style={{ background: '#fff', padding: '0 2rem', marginLeft: '0.5rem' }}>
                        {this.state.selectedKeys === "1" ? <Record /> : null}
						{this.state.selectedKeys === "2" ? <Submit /> : null}
                        {this.state.selectedKeys === "3" ? <Payment /> : null}
			        </Content>
		      	</Layout>
		    </Layout>
		);
	}
}

export default AuthorCenter;