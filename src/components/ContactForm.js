import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FaSend from 'react-icons/lib/fa/paper-plane'

import { regExpEmail } from '../utils/regExp'

class ContactForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      message: '',
      errors: {},
      submitted: false,
      responseText: '',
      touched: {
        name: false,
        email: false,
        message: false,
      },
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => this.validate())
  }

  onBlur = e => {
    this.setState({
      touched: {
        ...this.state.touched,
        [e.target.name]: true
      },
    })
  }

  onSubmit = () => {
    if (this.validate()) {
      this.sendFormData(this.state)

      this.setState({
        name: '',
        email: '',
        message: '',
        errors: {},
        touched: {
          name: false,
          email: false,
          message: false,
        },
      })
    }
  }

  validate() {
    const { name, email, message } = this.state
    const errors = {}

    if (name === '') {
      errors.name = 'Please enter your name'
    }

    if (!regExpEmail.test(String(email).toLowerCase())) {
      errors.email = 'A valid email address is required'
    }

    if (message === '') {
      errors.message = 'Please enter your message'
    }

    this.setState({ errors })

    if (Object.keys(errors).length === 0) {
      this.setState({ errors: {} })
      return true
    }
  }

  sendFormData(data) {
    fetch('http://localhost:8080/email/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data, null, ''),
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          this.setState({
            submitted: true,
            responseText: res.data,
          })
        } else {
          this.setState({
            submitted: false,
            responseText: res.data,
          })
        }
      })
      .catch(error => console.error(error))
  }

  render() {
    const { name, email, message, errors, submitted, responseText } = this.state
    const hasErrors = Object.keys(errors).length > 0

    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];

      return hasError ? shouldShow : false;
    };

    if (submitted) {
      return (
        <div className="form-status form-status--success">
          <span>{responseText}</span>
        </div>
      )
    } else {
      return (
        <div>
          {responseText.length > 0 && (
            <div className="form-status form-status--error">
              <span>{responseText}</span>
            </div>
          )}
          <form className="form form--contact">
            <TextField
              className="form-field"
              name="name"
              value={name}
              hintText="Your Name"
              floatingLabelText="Your Name"
              style={styles.inputStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              errorText={shouldMarkError('name') ? errors.name : ''}
              onChange={this.onChange}
              onBlur={this.onBlur}
            />
            <TextField
              className="form-field"
              name="email"
              value={email}
              hintText="Your Email"
              floatingLabelText="Your Email"
              style={styles.inputStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              errorText={shouldMarkError('email') ? errors.email : ''}
              onChange={this.onChange}
              onBlur={this.onBlur}
            />
            <TextField
              multiLine
              className="form-field"
              name="message"
              value={message}
              hintText="Your Message"
              floatingLabelText="Your Message"
              style={styles.inputStyle}
              floatingLabelStyle={styles.floatingLabelStyle}
              underlineStyle={styles.underlineStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              errorText={shouldMarkError('message') ? errors.message : ''}
              onChange={this.onChange}
              onBlur={this.onBlur}
            />
            <FloatingActionButton
              className="btn form-btn"
              onClick={this.onSubmit}
              backgroundColor="#141417"
              disabled={hasErrors}
            >
              <FaSend className="form-btn-icn" />
            </FloatingActionButton>
          </form>
        </div>
      )
    }
  }
}

const styles = {
  inputStyle: {
    color: '#cfd7df',
    display: 'block',
    width: '100%',
  },
  floatingLabelStyle: {
    color: '#cfd7df',
  },
  underlineStyle: {
    backgroundColor: '#cfd7df',
  },
}

export { ContactForm }
