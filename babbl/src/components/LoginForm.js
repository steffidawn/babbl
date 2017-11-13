import React, {Component} from 'react';
import {VERIFY_USER} from '../Events';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname:"",
      error: ""
    };
  }

  //set user
  setUser = ({user, isUser}) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError("Nickname taken")
    } else {
      this.props.setUser(user)
    }
  }

  //handle submit of nickname:
  handleSubmit = (e) => {
    e.preventDefault()
    const {socket} = this.props
    const {nickname} = this.state
    socket.emit(VERIFY_USER, nickname, this.setUser)
  }

  //handle change of input value to user input
  handleChange = (e) => {
    this.setState({nickname:e.target.value})
  }

  //error handling for login
  setError = (error) => {
    this.setState({error})
  }

  render() {
    const {nickname, error} = this.state
    return (
      <div className='login'>
        <form onSubmit={this.handleSubmit} className="loginForm">
          <label htmlFor="nickname">
            <h2>Give yourself a nickname!</h2>
          </label>
          <input
            ref={(input) => {this.textInput = input}}
            type="text"
            id="nickname"
            value={nickname}
            onChange={this.handleChange}
            placeholder={"My babbl name"} />
          <div className="error">
            {error ? error:null}
          </div>
        </form>
      </div>
    );
  }
}
