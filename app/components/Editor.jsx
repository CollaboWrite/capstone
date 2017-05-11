import React from 'react'
import ReactQuill from 'react-quill'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.write = this.write.bind(this)
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef.child('text'))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(atomRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = atomRef.on('value', snapshot =>
      this.setState({ value: snapshot.val() })
    )
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }
  write(html) {
    this.setState({
      value: html
    },
  () => this.props.atomRef && this.props.atomRef.child('text').set(this.state.value)
)
  }

  render() {
    const text = this.props.atom ? this.props.atom.text : ''
    return (
      <div className="container">
        <div>
        <ReactQuill id='react-quill'
                  value={this.state.value}
                  onChange={this.write}
                  theme={'snow'}/>
        </div>
      </div>
    )
  }
}
