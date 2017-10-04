import {setLocale, SetLocaleTriggerType} from '~/actions/base/locales';
import Dropdown from '~/components/general/dropdown';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {LocaleListType} from '~/reducers/base/locales';

interface LanguagePickerProps {
  classNameExtension: string,
  locales: LocaleListType,
  setLocale: SetLocaleTriggerType
}

interface LanguagePickerState {
  
}

class LanguagePicker extends React.Component<LanguagePickerProps, LanguagePickerState> {
  render(){
    return <Dropdown classNameExtension={this.props.classNameExtension} classNameSuffix="language-picker" items={this.props.locales.avaliable.map((locale)=>{
      return (<Link className={`${this.props.classNameExtension} link link-full ${this.props.classNameExtension}-link-language-picker`} onClick={this.props.setLocale.bind(this, locale.locale)}>
        <span>{locale.name}</span>
      </Link>);
    })}>
      <Link className={`${this.props.classNameExtension} button-pill ${this.props.classNameExtension}-button-pill-language`}>
        <span>{this.props.locales.current}</span>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state: any){
  return {
    locales: state.locales
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return bindActionCreators({setLocale}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);