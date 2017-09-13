import React from 'react';

export default class Correction extends React.Component {
  render () {
    if (clientResponse === null) {
      return;
    }
    if (clientResponse === promptResponse) {
      return (
        <div>
          <p>You got it!</p>
        </div>
      )
    }
    return (
      <div>
        <p>Ooops! The correct answer is {response[0]} or correction key in db</p>
      <div>
    )
  }
}