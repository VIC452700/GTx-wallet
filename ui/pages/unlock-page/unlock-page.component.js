import { EventEmitter } from 'events'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import getCaretCoordinates from 'textarea-caret'
import TextField from '../../components/ui/text-field'
import Mascot from '../../components/ui/mascot'
import { DEFAULT_ROUTE } from '../../helpers/constants/routes'

export default class UnlockPage extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    isUnlocked: PropTypes.bool,
    onImport: PropTypes.func,
    onRestore: PropTypes.func,
    onSubmit: PropTypes.func,
    forceUpdateMetamaskState: PropTypes.func,
  }

  state = {
    password: '',
    error: null,
  }

  submitting = false

  animationEventEmitter = new EventEmitter()

  UNSAFE_componentWillMount () {
    const { isUnlocked, history } = this.props

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE)
    }
  }

  handleKeyUp = async (event) => {
    const { error: prevError } = this.state
    const capsLockOn = this.context.t('capsLockIsOn')
    if (prevError && prevError !== capsLockOn) {
      return
    }
    const isCapsLockOn = prevError === capsLockOn && (event.key === 'CapsLock' || (event.which || event.keyCode) === 20) ? false : event.getModifierState('CapsLock')
    const error = isCapsLockOn ? capsLockOn : null
    if (error !== prevError) {
      this.setState({ error })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { password } = this.state
    const { onSubmit, forceUpdateMetamaskState } = this.props

    if (password === '' || this.submitting) {
      return
    }

    this.setState({ error: null })
    this.submitting = true

    try {
      await onSubmit(password)
      await forceUpdateMetamaskState()
    } catch ({ message }) {
      if (message === 'Incorrect password') {
        await forceUpdateMetamaskState()
      }

      this.setState({ error: message })
      this.submitting = false
    }
  }

  handleInputChange ({ target }) {
    this.setState({ password: target.value, error: null })

    // tell mascot to look at page action
    if (target.getBoundingClientRect) {
      const element = target
      const boundingRect = element.getBoundingClientRect()
      const coordinates = getCaretCoordinates(element, element.selectionEnd)
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      })
    }
  }

  renderSubmitButton () {
    const style = {
      backgroundColor: '#248ad4',
      color: 'white',
      marginTop: '20px',
      height: '60px',
      fontWeight: '400',
      boxShadow: 'none',
      borderRadius: '4px',
    }

    return (
      <Button
        type="submit"
        style={style}
        disabled={!this.state.password}
        fullWidth
        variant="contained"
        size="large"
        onClick={this.handleSubmit}
        disableRipple
      >
        { this.context.t('unlock') }
      </Button>
    )
  }

  render () {
    const { password, error } = this.state
    const { t } = this.context
    const { onImport, onRestore } = this.props

    return (
      <div className="unlock-page__container">
        <div className="unlock-page">
          <div className="unlock-page__mascot-container">
            <Mascot
              animationEventEmitter={this.animationEventEmitter}
              width="120"
              height="120"
            />
          </div>
          <h1 className="unlock-page__title">
            { t('welcomeBack') }
          </h1>
          <div>{ t('unlockMessage') }</div>
          <form
            className="unlock-page__form"
            onSubmit={this.handleSubmit}
          >
            <TextField
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => this.handleInputChange(event)}
              onKeyUp={(event) => this.handleKeyUp(event)}
              error={error}
              autoFocus
              autoComplete="current-password"
              theme="material"
              fullWidth
            />
          </form>
          { this.renderSubmitButton() }
          <div className="unlock-page__links">
            <div
              className="unlock-page__link"
              onClick={() => onRestore()}
            >
              { t('restoreFromSeed') }
            </div>
            <div
              className="unlock-page__link unlock-page__link--import"
              onClick={() => onImport()}
            >
              { t('importUsingSeed') }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
