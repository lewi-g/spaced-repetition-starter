import * as actions from './actions';

const initialState = {
  question: '',
  name: '',
  score: 0,
  negScore: 0,
  error: null, 
  correct: false,
  answer: '',
  answered: false
}

export default (state=initialState, action) => {
  if (action.type === actions.FETCH_USER_SUCCESS) {
    return{...state,
    name: action.name,
    error: null, 
    }
  }
  if (action.type === actions.FETCH_USER_FAILURE) {
    return {...state,
      error: action.error
    }
  }
  if (action.type === actions.FETCH_QUESTION_SUCCESS) {
    return {...state,
      question: action.question,
      answered: false 
    }
  }
  if (action.type === actions.FETCH_QUESTION_FAILURE) {
    return {...state,
      error: action.error
    }
  }
  if (action.type === actions.SUBMIT_ANSWER_SUCCESS) {
    if (action.answer.correct) {
      return {...state,
        correct: action.anser.correct,
        score: state.score++, 
        answer: action.answer.actualAnswer,
        answered: true
      }
    }
      else {
      return {...state,
          correct: action.asnwer.correct,
          negScore: state.negScore+1,
          answer: action.answer.actualAnswer, 
          answered: true
        }
      }
  }   
  if (action.type === actions.SUBMIT_ANSWER_FAILURE) {
    return{...state, 
      error: action.error
    }
  }
  return state;
}

