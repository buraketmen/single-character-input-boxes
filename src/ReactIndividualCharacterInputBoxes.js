import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputBox from './InputBox'

const Wrapper = styled.div`
  margin: auto;
  margin-top: 100px;
  width: 50%;
  padding: 10px;
  text-align: center;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial sans-serif;
`

class ReactIndividualCharacterInputBoxes extends Component {
  constructor (props) {
    super(props)
    this.state = { characterArray: Array(props.amount) }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.inputElement = {}
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props !== nextProps) {
      return true
    }
    return false
  }

  renderItems () {
    let items = []

    for (var i = 0; i < this.props.amount; i++) {
      items.push(
        <InputBox
          key={i}
          handleKeyDown={this.handleKeyDown}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          name={i}
          inputRef={el => (this.inputElement[el.name] = el)}
        />
      )
    }

    return items
  }

  render () {
    return (
      <Wrapper>
        <div>{this.renderItems()}</div>
      </Wrapper>
    )
  }

  handleChange ({ target }) {
    if (target.value.match(this.props.inputRegExp)) {
      this.focusNextChar(target)
      this.setModuleOutput(target)
    } else {
      target.value = this.state.characterArray[Number(target.name)]
    }
  }

  handleKeyDown ({ target, key }) {
    if (key === 'Backspace') {
      if (target.value === '' && Number(target.name) !== 0) {
        this.inputElement[Number(target.name) - 1].value = ''
        this.focusPrevChar(target)
      } else {
        target.value = ''
      }
      this.setModuleOutput(target)
    } else if (key === 'ArrowLeft') {
      this.focusPrevChar(target)
    } else if (key === 'ArrowRight') {
      this.focusNextChar(target)
    }
  }

  handleFocus ({ target }) {
    var el = target
    setTimeout(function () {
      el.select()
    }, 5)
  }

  focusPrevChar (target) {
    if (Number(target.name) !== 0) {
      this.inputElement[Number(target.name) - 1].focus()
    }
  }

  focusNextChar (target) {
    if (Number(target.name) !== this.props.amount - 1) {
      this.inputElement[Number(target.name) + 1].focus()
    }
  }

  setModuleOutput (target) {
    let stateCopy = this.state.characterArray
    for (var i = 0; i < this.props.amount; i++) {
      stateCopy[i] = this.inputElement[i].value
    }
    stateCopy[Number(target.name)] = target.value
    this.setState({ characterArray: stateCopy })
    this.props.handleOutputString(this.state.characterArray.join(''))
  }
}

ReactIndividualCharacterInputBoxes.defaultProps = {
  amount: 5,
  inputRegExp: /^[a-zA-Z0-9]$/
}
ReactIndividualCharacterInputBoxes.propTypes = {
  amount: PropTypes.number,
  inputRegExp: PropTypes.instanceOf(RegExp),
  handleOutputString: PropTypes.func.isRequired
}

export default ReactIndividualCharacterInputBoxes
