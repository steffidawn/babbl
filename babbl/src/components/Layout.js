import React, {Component} from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED, LOGOUT} from '../Events';
import LoginForm from './LoginForm';

//may need to change port number at end of url to 3000
const socketUrl = 'http://192.168.0.104:3231'

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket()
  }

//initialize socket connection
  initSocket = () => {
    const socket = io(socketUrl)
    socket.on('connect', () => {
      console.log('Connected');
    })
    this.setState({socket})
  }

//setting state to user
  setUser = (user) => {
    const {socket} = this.state
    socket.emit(USER_CONNECTED, user);
    this.setState({user})
  }

//loutout user
//may need to pass in user into this function
  logout = () => {
    const {socket} = this.state
    socket.emit(LOGOUT);
    this.setState({user: null})
  }

  render() {
    const {title} = this.props
    const {socket} = this.state
    return(
      <div className="container">
        {title}
        <LoginForm socket={socket} setUser={this.setUser}/>
      </div>
    );
  }
}
