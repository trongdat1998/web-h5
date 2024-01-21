
/**
 * form component
 * 提供功能：
 * 1、排版
 * 2、验证
 * 3、错误提示
 * 4、双向绑定
 */

/**
 * 
 * <Form>
 *  <Form.Item>
 *    {
 *      getFile(id,{
 *         valuePropName : 'value', // 值得属性名，默认value, 
 *         initialValue : '', // 初始值
 *         trigger : 'onChange', // 收集子节点的值
 *         getValueFromEvent : ()=>{},  // onChange 的参数转化为控件的值
 *         validateTrigger : 'onChange',  // 校验子节点值的时机
 *         rules : {}, // 校验规则
 *         exclusive : 
 *      })(<Input />)
 *    }
 *  </Form.Item>
 * </Form>
 * 
 * 
 */

import React from 'react';
import classNames from 'classnames';
import Col from './col';
import Row from './row';

class Form extends React.Component{
  constructor(){
    super();
    this.state = {
      fields : {},
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.setField = this.setField.bind(this);
    this.getFieldDecorator = this.getFieldDecorator.bind(this);
  }
  setField(name,options){
    this.setState({
      [name] : {
        ...this.state[name],
        ...options
      }
    })
  }
  getFieldDecorator(name,options){
    const allprops = {
      ...options
    }
    return (fieldElem)=>{
      return React.cloneElement(fieldElem,allprops);
    }
  }
  onSubmit(e){
    e.preventDefault();
    this.props.onSubmit && this.props.onSubmit(e);
  }
  render(){
    const {onSubmit,className, ...props} = this.props;
    return (
      <form {...props} className={classNames('g-form',className)} onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    )
  }
}

/** 
 *
 * <div class="g-form">
 *  <div class="g-form-item">
 *    <div class="g-form-item-label"><label htmlFor=`${id}`></label></div>
 *    <div class="g-form-item-wrapper"></div>
 *  </div>
 * </div>
 * 
 * */

class FormItem extends React.Component{
  renderWrapper(children){
    const props = this.props;
    const wrapperColClassName = classNames(
      `g-form-item-wrapper`,
      props.wrapperCol ? props.wrapperCol.className : '',
    )
    return (
      <Col {...props.wrapperCol} className={wrapperColClassName} key="wrapper">
        {children}
      </Col>
    )
  }
  renderLabel(){
    const props = this.props;
    const labelColClassName = classNames(
      `g-form-item-label`,
      props.labelCol ? props.labelCol.className : ''
    )
    return props.label ? (
      <Col {...props.labelCol} className={labelColClassName} key="label">
        <label htmlFor={props.id}>{props.label}</label>
      </Col>
    ) : null;
  }
  renderChildren(children){
    return [
      this.renderLabel(),
      this.renderWrapper(children),
    ]
  }
  renderFormItem(children){
    const props = this.props;
    const itemClassName = classNames(
      `g-form-item`,
      props.className,
    );
    return (
      <Row className={itemClassName} style={props.style}>
        {children}
      </Row>
    )
  }
  render(){
    const children = this.renderChildren(this.props.children);
    return this.renderFormItem(children);
  }
}

Form.Item = FormItem;

export default Form;
