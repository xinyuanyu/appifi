import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux'
import Login from './containers/Login'
import reducer from './reducers/index'
import Navigation from './containers/Navigation'
import CSSTransition from 'react-addons-css-transition-group'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import AppBar from 'material-ui/AppBar'

var store = createStore(reducer) 

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import palette from './utils/palette'

class App extends React.Component {

  getChildContext() {

    const muiTheme = getMuiTheme({
      palette: palette(window.store.getState().themeColor)
    });

    return {muiTheme};
  }

  /* this must be declared for Components exporting context */  
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  render() {

    let loggedin = store.getState().login.state === 'LOGGEDIN'
      return (<div><Navigation /></div>)
//    return <div><AppBar style={{ position: 'fixed', display:'flex', flexDirection:'row' }} title='title3' /></div>
  }
}

const render = () => {
  ReactDom.render(<App/>, document.getElementById('app'))
}

store.subscribe(render)
window.store = store
render()



