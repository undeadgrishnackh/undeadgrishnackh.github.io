import React from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp'

// This example borrowed from https://medium.com/@arjunkava91/improve-blogging-with-feedback-and-analytics-91e81ec5ea61
export default class Subscribe extends React.Component {
  constructor () {
    super()
    this.state = {
      email: ``
    }
  }
  // Update state each time user edits their email address
  _handleEmailChange = e => {
    this.setState({ email: e.target.value })
  }
  // Post to MC server & handle its response
  _postEmailToMailchimp = (email, attributes) => {
    addToMailchimp(email, attributes)
      .then(result => {
        // Mailchimp always returns a 200 response
        // So we check the result for MC errors & failures
        if (result.result !== `success`) {
          this.setState({
            status: `error`,
            msg: result.msg
          })
        } else {
          // Email address succesfully subcribed to Mailchimp
          this.setState({
            status: `success`,
            msg: result.msg
          })
        }
      })
      .catch(err => {
        // Network failures, timeouts, etc
        this.setState({
          status: `error`,
          msg: err
        })
      })
  }
  _handleFormSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    if (!this.state.email) {
      this.setState({
        status: `error`,
        msg:
          'Please enter an email address if you want to subscribe to my newsletter.'
      })
    } else {
      this.setState({
        status: `sending`,
        msg: null
      })
      // setState callback (subscribe email to MC)
      this._postEmailToMailchimp(this.state.email, {
        pathname: document.location.pathname
      })
    }
  }

  render () {
    return (
      <span>
        {this.state.status === `success` ? (
          <div>Thank you!</div>
        ) : (
          <div className="subscribe__image">
            <hr align="center" width="50%"/>
            <div className="subscribe__text" style={{ maxWidth: '95%' }}>
              <img src="/rss-icon.png" alt="rss-icon" style={{ width:48, height:48 }}></img> 
            </div>
            <form id='email-capture' method='post' noValidate>
              <input
                style={{ backgroundColor: 'white', width: '90%' }}
                onChange={this._handleEmailChange}
                required
              />
              <button onClick={this._handleFormSubmit}>
                Subscribe
              </button>
              {this.state.status === `error` && (
                <div dangerouslySetInnerHTML={{ __html: this.state.msg }} />
              )}
            </form>
          </div>
        )}
      </span>
    )
  }
}