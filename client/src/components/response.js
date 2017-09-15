import React from 'react';
import * as Cookies from 'js-cookie';
import * as actions from '../actions';

import { connect } from 'react-redux';

const mapStateToProps = (state, props) => ({
    question: state.question,
    name: state.name,
    picture: state.picture,
    correct: state.correct,
    answer: state.answer,
    answered: state.answered,
    score: state.score,
    negScore: state.negScore,
})


export class Response extends React.Component {

  onSubmit(e) {
    e.preventDefault();
            let formData = {
          answer: this.userAnswer.value
        }
    console.log('answering questions!! yaya!')
    this.props.dispatch(actions.submitAnswer(formData))
  }

  render () {
    return (
       <div className='response'>
          <form id="input-form" onSubmit={this.onSubmit} ref={ref => this.answerForm=ref}>
            <input type="text"
              id="user-answer" 
              ref={ref => this.userAnswer = ref}
              autoComplete="on"></input>
            <button type="submit" className="btn">Submit response</button>
          </form>
        </div>
    )
  }
}

export default connect(mapStateToProps)(Response);