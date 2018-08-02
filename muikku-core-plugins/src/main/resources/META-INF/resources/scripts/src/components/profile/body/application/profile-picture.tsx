import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { ProfileType } from '~/reducers/main-function/profile';
import { UserIndexType } from '~/reducers/main-function/user-index';
import UploadImageDialog from '../../dialogs/upload-image';
import { getUserImageUrl } from '~/util/modifiers';
import Button from '~/components/general/button';

interface ProfilePictureProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType
}

interface ProfilePictureState {
  isImageDialogOpen: boolean,
  b64?: string,
  file?: File
}

class ProfilePicture extends React.Component<ProfilePictureProps, ProfilePictureState> {
  constructor(props: ProfilePictureProps){
    super(props);
    
    this.state = {
      isImageDialogOpen: false
    }
    
    this.readFile = this.readFile.bind(this);
  }
  readFile(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    let reader = new FileReader();
    
    reader.addEventListener("load", ()=>{
      this.setState({
        b64: reader.result,
        file,
        isImageDialogOpen: true
      })
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  render(){
    return (<div className="container container--full">
        {!this.props.status.hasImage ? <div className="container container--profile-picture">
          <form className="container container--profile-picture-empty">
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>
        </div> : <div className="container container--profile-picture">
          <form className="container container--profile-picture-filled" style={{backgroundImage:`url("${getUserImageUrl(this.props.status.userId, 256, this.props.status.imgVersion)}")`}}>
            <Button buttonModifiers="profile-image-edit">
              <span className="icon icon-edit"/>
              {this.props.i18n.text.get("plugin.profile.editImage")}
            </Button>
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>
        </div>}
        <UploadImageDialog isOpen={this.state.isImageDialogOpen} b64={this.state.b64} file={this.state.file} onClose={()=>this.setState({isImageDialogOpen: false})}/>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePicture);