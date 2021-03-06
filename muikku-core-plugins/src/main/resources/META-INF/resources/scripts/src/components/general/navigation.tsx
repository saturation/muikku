import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";

interface NavigationProps {
  
}

interface NavigationState {
  
}

export default class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="item-list item-list--aside-navigation">
      {this.props.children}
    </div>
  }
}

interface NavigationTopicProps {
  name?: string,
  className?: string
}

interface NavigationTopicState {
  
}

export class NavigationTopic extends React.Component<NavigationTopicProps, NavigationTopicState> {
  render(){
    return <div className={this.props.className}>{this.props.name ? <span className="item-list__title">{this.props.name}</span> : null}{this.props.children}</div>
  }
}

interface NavigationElementProps {
  isActive: boolean,
  hash?: string,
  onClick?: ()=>any,
  children: string,
  icon?: string,
  iconColor?: string,
  isEditable?: boolean,
  editableWrapper?: any,
  editableWrapperArgs?: any,
  editableAction?: ()=>any
}

interface NavigationElementState {
  
}

export class NavigationElement extends React.Component<NavigationElementProps, NavigationElementState> {
  render(){
    let editableComponent = null;
    if (this.props.isEditable && this.props.editableWrapper){
      let EditableWrapper = this.props.editableWrapper;
      let args = this.props.editableWrapperArgs || {};
      editableComponent = <EditableWrapper {...this.props.editableWrapperArgs}>
        <ButtonPill disablePropagation as="span" buttonModifiers="navigation-edit-label" icon="edit"/>
      </EditableWrapper>
    } else if (this.props.isEditable){
      editableComponent = <ButtonPill disablePropagation as="span" buttonModifiers="navigation-edit-label"
        icon="edit" onClick={this.props.editableAction}/>
    }
    
    return <Link className={`item-list__item ${this.props.isActive ? "active" : ""}`}
      href={this.props.hash ? "#" + this.props.hash : null} onClick={this.props.onClick}>
      {this.props.icon ? <span className={`item-list__icon icon-${this.props.icon}`} style={{color: this.props.iconColor}}></span> : null}
      <span className="item-list__text-body">
        {this.props.children}
      </span>
      {editableComponent}
    </Link>
  }
}