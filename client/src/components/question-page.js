import React from 'react';
import * as Cookies from 'js-cookie';

import Response from './response';

export default class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidMount() {
    const accessToken = Cookies.get('accessToken');
    fetch('/api/questions', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(questions =>
        this.setState({
          questions
        })
      );
  }

  render() {
    const questions = this.state.questions.map((question, index) => (
      <li key={index}>{question}</li>
    ));
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
