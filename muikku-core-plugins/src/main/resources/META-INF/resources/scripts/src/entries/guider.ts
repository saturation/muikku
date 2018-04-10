import App from '~/containers/guider';
import reducer from '~/reducers/guider';
import runApp from '~/run';

import titleActions from '~/actions/base/title';
import * as queryString from 'query-string';

import mainFunctionDefault from '~/util/base-main-function';
import { Action } from 'redux';
import { updateLabelFilters, updateWorkspaceFilters } from '~/actions/main-function/guider';
import { GuiderActiveFiltersType } from '~/reducers/main-function/guider';
import { loadStudents, loadStudent } from '~/actions/main-function/guider';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.guider.guider')));
store.dispatch(<Action>updateLabelFilters());
store.dispatch(<Action>updateWorkspaceFilters());

function loadCurrentLocation(){
  let originalData:any = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});

  if (!originalData.c){
    let filters:GuiderActiveFiltersType = {
      "workspaceFilters": (originalData.w || []).map((num:string)=>parseInt(num)),
      "labelFilters": (originalData.l || []).map((num:string)=>parseInt(num)),
      "query": originalData.q || ""
    }
    store.dispatch(<Action>loadStudents(filters));
    return;
  }

  store.dispatch(<Action>loadStudent(originalData.c))
}

window.addEventListener("hashchange", ()=>{
  loadCurrentLocation();
}, false);

loadCurrentLocation();