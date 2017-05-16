import React from 'react'
import firebase from 'APP/server/db'

import MobileTearSheet from './MobileTearSheet'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

var Infinite = require('react-infinite')

const auth = firebase.auth()
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      currentMessage: ''
    }
  }
  componentDidMount() {
    const messagesRef = firebase.database().ref('/projects/' + this.props.projectId + '/messages/')
    this.listenTo(messagesRef)
  }
  listenTo = (ref) => {
    if (this.unsubscribe) this.unsubscribe()
    // retreiving all messages for this project
    const listener = ref.on('child_added', snapshot => {
      this.setState({ messages: [...this.state.messages, snapshot.val()] })
    })
    this.unsubscribe = () => {
      ref.off('value', listener)
    }
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  handleMessage = (evt) => {
    this.setState({ currentMessage: evt.target.value })
  }
  submitMessage = (evt) => {
    evt.preventDefault()
    const newMessage = {}
    firebase.database().ref('/users/' + this.props.uid).child('name').once('value', snapshot => {
      const userName = snapshot.val()
      newMessage[userName] = this.state.currentMessage
      firebase.database().ref('/projects/' + this.props.projectId + '/messages/').push(newMessage)
      this.setState({currentMessage: ''})
    })
  }
  render() {
    const messages = this.state.messages
    return (
      <div>
        <MuiThemeProvider>
          <List>
            <Subheader className='panel-heading'><h3 className='panel-head'>Chats</h3></Subheader>
            <Infinite containerHeight={200} elementHeight={50}
              displayBottomUpwards>
              {messages && messages.map((message, idx) => {
                const senderName = Object.keys(message)
                return (<div key={idx}>
                  <ListItem
                  leftAvatar={<span className={'fa fa-user fa-3'}></span>}
                  primaryText={senderName}
                  secondaryText={<p>{message[senderName]}</p>} />
                  <Divider inset={true} />
                </div>)
              })
              }
            </Infinite>
          </List>
        </MuiThemeProvider>
        <form onSubmit={this.submitMessage}>
          <input onChange={this.handleMessage} value={this.state.currentMessage}></input>
          <button>Send</button>
        </form>
      </div>
    )
  }
}
