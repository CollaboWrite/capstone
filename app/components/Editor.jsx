import React from 'react'
import Quill from 'quill'
import ReactQuill from 'react-quill'
const Delta = Quill.import('delta')

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '', // text in editor
      pane: ''
    }
    this.write = this.write.bind(this)
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef)
    this.setState({ pane: this.props.pane })
  }
  componentWillReceiveProps(incoming) {
    // When the atomRef in the AtomEditor, we start listening to the new one
    this.listenTo(incoming.atomRef)
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
    const listener = atomRef.on('value', snapshot => {
      const newValue = snapshot.val() || ''
      this.setState({ value: newValue })
    })
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }

  write(html) {
    // this function sends the pane & the text (this.state.value) to atomEditor
    // this.props.setPaneText (#2)
    this.props.atomRef.child('text').set(html)
    if (this.props.compareDiff && this.props.snapshotText) this.props.compareDiff(this.props.snapshotText, this.props.currentText)
  }
  render() {
    const atom = this.state.value
    return (
      <div className='col-xs-12 project-center'>
        <div className="split-pane" value={this.state.pane} onClick={() => {
          this.props.selectPane(this.state.pane)
        }
        }>
          <h4>{atom.title}</h4>
          <div className="editor-panel clearfix">
            <ReactQuill id='react-quill'
              value={atom.text}
              onChange={this.write}
              theme={'snow'} />
          </div>
        </div>
      </div>
    )
  }
}
