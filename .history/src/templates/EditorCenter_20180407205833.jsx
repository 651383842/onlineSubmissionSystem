/**
 * Created by lixiwei on 2018/4/3.
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Button, Upload, message, Modal, Input, Select, Form, Row, Col, Table, Spin, Switch } from 'antd';
import axios from 'axios';
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

class Record extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            visibleSubNew: false,
            visibleSubPro: false,
            fileList: {},
            operationArg: null,
            unfinishedLoading: true,
            finishedLoading: true,
            expandedRowKeys: [],
            dataUnfinished: [{
                key: '1',
                title: '数据科学与大数据技术专业特色课程研究',
                academicsec: '课程研究',
                submitDate: '2017-12-05',
                thesisState: '待分配',
                suggestions: ['','','',''],
                professors: ['1'],
            },{
                key: '2',
                title: '有理分形曲面造型及其在图像超分辨中的应用',
                academicsec: '图像处理',
                submitDate: '2017-07-18',
                thesisState: '待审阅',
                suggestions: ['666','666','666',''],
                professors: '张三三、李四四、王五五',
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
            title: '审稿人',
            dataIndex: 'professors',
            key: 'professors',
            render: (text, record) => {
                const data = [...this.state.dataUnfinished];
                let n;
                data.map((obj,index) => {
                    if (record.key == obj.key) {
                        n  = index;
                    }
                });
                return(
                    <span>
                        {
                            record.thesisState === '待分配' ? 
                                < Select
                                    mode="multiple"
                                    tokenSeparators={[',', '、']}
                                    allowClear={true}
                                    value={this.state.dataUnfinished[n].professors}
                                    style={{ width: '10rem' }}
                                    onChange={(value, options) => this.professorsChange(value, options, record.key)}
                                >
                                    <Option value="1">张三三</Option>
                                    <Option value="2">Lucy</Option>
                                    <Option value="3">Mike</Option>
                                    <Option value="4">John</Option>
                                    <Option value="5">Tom</Option>
                                </Select >
                            : text
                        }
                    </span>
            )},
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button disabled={record.thesisState === '待分配'} onClick={() => this.receiptChange(record)}>审阅意见</Button>
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
                                <Button disabled={record.thesisState === '待分配'} >
                                    <Icon type="upload" />上传
                                </Button>
                        }
					  </Upload>
					<span className="ant-divider" />
					<Button type="primary" onClick={() => this.modalOpen(record.key,record.thesisState,record)}>提交</Button>
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

    professorsChange = (value, options, key) => {
        if(value.length > 3){
            value.splice(0,1);
            // value = value.slice(0,3);
            // error("失败", '选择失败，最多可选择分配三名审稿人！');
        }
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => key === item.key)[0];
        target['professors'] = value;
        this.setState({ dataUnfinished: newData });
    }

    receiptChange = (record) => {
        const oldData = [...this.state.expandedRowKeys];
        const key = record.key;
        let needOpen = true;
        oldData.map((str) => {
            if (key == str) {
                needOpen = false;
            }
        });
        if (needOpen){
            const newData = [...this.state.expandedRowKeys, key];
            this.setState({
                expandedRowKeys: newData,
            })
        }
        
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
        files[key] = file;
        this.setState({
            fileList: files,
        });
        return false;
    }

    submitSummary = () => {
        let { fileList, dataUnfinished, operationArg } = this.state;
        const formData = new FormData();
        let self = this;

        if(fileList[operationArg[0]]){
            formData.append(fileList[operationArg[0]].name, fileList[operationArg[0]]);
            this.setState({
                confirmLoading: true,
            });

            axios.post('//jsonplaceholder.typicode.com/posts/', formData).then(function (response) {
                self.modalClose();
                self.setState({
                    file: null,
                    confirmLoading: false,
                });
                message.success('提交成功！');
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
            console.log(operationArg[2])
            this.modalClose();
            this.setState({
                confirmLoading: false,
            });
            message.success('提交成功！');
            this.setState({
                dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
            })
        }
    }

    submitProfessors = () => {
        let { dataUnfinished, operationArg } = this.state;
        if(this.state.operationArg[2].professors.length != 3){
            this.modalClose();
            this.setState({
                confirmLoading: false,
            });
            error("失败", '提交失败，请确认审阅分配是否完成！');
        }else{
            this.modalClose();
            this.setState({
                confirmLoading: false,
            });
            message.success('提交成功！');
            this.setState({
                dataUnfinished: dataUnfinished.filter(data => data.key !== operationArg[0])
            })
        }
    }

    modalOpen = (...arg) => {
        switch (arg[1]){
            case '待分配':
                this.setState({
                    operationArg: arg,
                    visibleSubPro: true,
                });
                break;
            default:
                this.setState({
                    operationArg: arg,
                    visibleSubNew: true,
                });
                break;
        }
    }

    modalClose = () => {
        this.setState({
            visibleSubNew: false,
            visibleSubPro: false,
        });
    }


    handleCompleteInput = (record) => {
        alert(1);
        const newData = [...this.state.dataUnfinished];
        const target = newData.filter(item => record.key === item.key)[0];
        target['suggestions'][3] = record.suggestions[3];
        this.setState({ dataUnfinished: newData });
    }

    render() {
        return (
            <Tabs animated={false} tabPosition="top" defaultActiveKey='1' style={{ paddingTop:'1rem' }}>
                <TabPane tab="未完成" key="1">
                    <Table 
                        columns={this.columnsUnfinished}
                        expandedRowRender={record => {
                            class ExpandedRow extends Component {
                                checkError = (id) => {
                                    // Only show error after a field is touched.
                                    return this.props.form.isFieldTouched(id) && this.props.form.getFieldError(id)
                                }

                                render() {
                                    const { getFieldDecorator } = this.props.form;
                                    return (
                                        <Form>
                                            <div>
                                                审阅意见一：
                                                <p>
                                                    {record.suggestions[0]}
                                                </p>
                                                审阅意见二：
                                                <p>
                                                    {record.suggestions[1]}
                                                </p>
                                                审阅意见三：
                                                <p>
                                                    {record.suggestions[2]}
                                                </p>
                                            </div>
                                            <FormItem
                                                validateStatus={this.checkError('summary') ? 'error' : ''}
                                                help={this.checkError('summary') || ''}
                                                label={(
                                                    <span>
                                                        审阅总结
                                                    </span>
                                                )}
                                            >
                                                {getFieldDecorator('summary', {
                                                    rules: [{ required: true, message: '审阅总结不能为空!', whitespace: true }],
                                                })(
                                                    <TextArea autosize={{minRows:3}} />
                                                )}
                                            </FormItem>
                                        </Form>
                                    );
                                }
                            }
                            const ExpandedRowForm = Form.create({
                                onValuesChange(_, values) {
                                    record.suggestions[3] = values;
                                },
                            })(ExpandedRow);
                            return (
                                <ExpandedRowForm record={record} onblur={() => this.handleCompleteInput(record)} />
                            )
                        }}
                        expandedRowKeys={this.state.expandedRowKeys}
                        expandIconAsCell={false}
                        expandIconColumnIndex={-1}
                        dataSource={this.state.dataUnfinished}
                        bordered scroll={{ x: '75rem' }}/>
                    <Modal
                        visible={this.state.visibleSubNew}
                        loading={this.state.unfinishedLoading}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitSummary} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>您确定要提交该稿件的审阅总结吗？</p>
                    </Modal>
                    <Modal
                        visible={this.state.visibleSubPro}
                        onCancel={this.modalClose}
                        title="提交确认"
                        footer={[
                            <Button key="submit" type="primary" size="large" onClick={this.submitProfessors} loading={this.state.confirmLoading}>
                                确定
                            </Button>,
                            <Button key="back" size="large" onClick={this.modalClose}>取消</Button>
                        ]}
                    >
                        <p>您确定要提交该稿件的审阅分配吗？</p>
                    </Modal>
                </TabPane>
                <TabPane tab="已完成" key="2">
                    <Table loading={this.state.finishedLoading} columns={this.columnsFinished} dataSource={this.state.dataFinished} bordered />
                </TabPane>
            </Tabs>
        );
    }
}

const EditableCell = ({ editable, value, onChange }) => (
    <div className="editableCellDiv">
        {editable
            ? <Input className="editableCellInput" value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
)
class Payment extends Component{
    constructor () {
        super();
        this.state = {
            confirmLoading: false,
            visible: false,
            fileList: {},
            operationArg: null,
            dataUnfinished: [{
                key: '1',
                title: '社交网络用户认知域特征预测研究综述',
                expense: '50',
                submitDate: '2016-12-17',
                thesisState: '待缴费',
                type:'审稿费',
                receiptTitle: '',
                receiptNum: '',
                address: '',
                receiver: '',
            },{
                key: '2',
                title: '一类特殊基函数构造的参数曲线',
                expense: '120',
                submitDate: '2017-07-18',
                thesisState: '待缴费',
                type:'版面费',
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
        }, {
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        }, {
            title: '费用类型',
            dataIndex: 'type',
            key: 'type',
        },{
            title: '发票抬头',
            dataIndex: 'receiptTitle',
            key: 'receiptTitle',
            render: (text, record) => this.renderColumns(text, record, 'receiptTitle'),
        },{
            title: '税号',
            dataIndex: 'receiptNum',
            key: 'receiptNum',
            render: (text, record) => this.renderColumns(text, record, 'receiptNum'),
        },{
            title: '邮寄地址',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => this.renderColumns(text, record, 'receiptNum'),
        },{
            title: '接收人',
            dataIndex: 'receiver',
            key: 'receiver',
            render: (text, record) => this.renderColumns(text, record, 'receiptNum'),
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return(
                    <span>
						<Switch checkedChildren="发票" unCheckedChildren="发票" onChange={(checked) => this.receiptChange(record.key,checked)} />
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
        }, {
            title: '应缴金额（RMB）',
            dataIndex: 'expense',
            key: 'expense',
        }, {
            title: '投稿时间',
            dataIndex: 'submitDate',
            key: 'submitDate',
        }, {
            title: '发票抬头',
            dataIndex: 'receiptTitle',
            key: 'receiptTitle',
        },{
            title: '发票内容',
            dataIndex: 'receiptContent',
            key: 'receiptContent',
        },{
            title: '税号',
            dataIndex: 'receiptNum',
            key: 'receiptNum',
        },{
            title: '稿件状态',
            dataIndex: 'thesisState',
            key: 'thesisState',
        }];
    }

    receiptChange = (key,checked) =>{
        if(checked){
            const newData = [...this.state.dataUnfinished];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                target.editable = true;
                this.setState({ dataUnfinished: newData });
            }
        }else{
            const newData = [...this.state.dataUnfinished];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                delete target.editable;
                this.setState({ dataUnfinished: newData });
            }
        }
    }

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={(value) => this.handleChange(value, record.key, column)}
            />
        );
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
        files[key] = file;
        this.setState({
            fileList: files,
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

    render() {
        return (
            <Tabs animated={false} tabPosition="top" defaultActiveKey="1" style={{ paddingTop:'1rem' }}>
                <TabPane tab="未完成" key="1">
                    <Table className="authorTable" columns={this.columnsUnfinished} dataSource={this.state.dataUnfinished} bordered scroll={{ x: '52rem' }} />
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
                    <Table columns={this.columnsFinished} dataSource={this.state.dataFinished} bordered />
                </TabPane>
            </Tabs>
        );
    }
}

class EditorCenter extends Component{
    constructor () {
        super();
        this.state = {
            selectedKeys: "1"
        }
    }

    menuSelect = (e) => {
        this.setState({
            selectedKeys: e.key,
        });
    }

    render(){
        return(
            <Layout>
                <Header/>
                <Content>
                    <Layout style={{ border:'bold solid 0.1rem', padding: '1rem', height: '35rem'}}>
                        <Sider style={{ width: '25%'}}>
                            <Menu
                                mode="inline"
                                inlineCollapsed = "false"
                                defaultSelectedKeys={[this.state.selectedKeys]}
                                style={{ height: '100%'}}
                                onSelect={this.menuSelect}
                            >
                                <MenuItemGroup key="i1" title={<span><Icon type="bars" /><span>功能菜单</span></span>}>
                                    <Menu.Item key="1">稿件纪录</Menu.Item>
                                    <Menu.Item key="2">费用中心</Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup key="i2" title={<span><Icon type="user" /><span>个人设置</span></span>}>
                                    <Menu.Item key="4">个人信息</Menu.Item>
                                    <Menu.Item key="5">修改密码</Menu.Item>
                                </MenuItemGroup>
                            </Menu>
                        </Sider>
                        <Content style={{ background: '#fff', padding: '0 2rem', marginLeft: '0.5rem' }}>
                            {this.state.selectedKeys === "1" ? <Record /> : null}
                            {this.state.selectedKeys === "2" ? <Payment /> : null}
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        )
    }
}

export default EditorCenter;