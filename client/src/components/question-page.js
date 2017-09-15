import React from 'react';
import * as Cookies from 'js-cookie';
import * as actions from '../actions';

import { connect } from 'react-redux';
import Header from './header';
import Response from './response';


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

export class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   questions: []
    // };
  }

  componentDidMount() {
        this.props.dispatch(actions.fetchUser());
        this.props.dispatch(actions.fetchQuestion());
  }

  render() {
    const questions = <li>{this.props.question.prompt}</li>
    return (
      <div>
        <section className='test'>
          <div className='prompt'>
            <p> Questions go here</p>
            <ul className='question-list'>{questions}</ul>
          </div>
          <Response />
        </section>
      </div>
    ) ;
  }
}


export default connect(mapStateToProps)(QuestionPage);
