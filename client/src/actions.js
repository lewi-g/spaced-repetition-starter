import * as Cookies from 'js-cookie';
import {browserHistory} from 'react-router';

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  name: user.name,
  picture: user.profilePicUrl
});

export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  error
});

export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
export const fetchQuestionSuccess = question => ({
    type: FETCH_QUESTION_SUCCESS,
    question
});

export const FETCH_QUESTION_FAILURE = 'FETCH_QUESTION_FAILURE';
export const fetchQuestionFailure = (error) => ({
    type: FETCH_QUESTION_FAILURE,
    error
});

export const SUBMIT_ANSWER_SUCCESS = 'SUBMIT_ANSWER_SUCCESS';
export const submitAnswerSuccess = (answer) => ({
    type: SUBMIT_ANSWER_SUCCESS,
    answer
})

export const SUBMIT_ANSWER_FAILURE = 'SUBMIT_ANSWER_FAILURE';
export const submitAnswerFailure = (error) => ({
    type: SUBMIT_ANSWER_FAILURE,
    error
})

export const fetchUser = () => dispatch => {
    const accessToken = Cookies.get('accessToken');
    return fetch(`/api/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(res => {
        if (!res.ok) {
            Cookies.remove('accessToken');
            browserHistory.replace('/login'); // what does this do?
            throw new Error(res.statusText);
        }
        return res.json();
    })
    .then(user => {
        dispatch(fetchUserSuccess(user));
    })
    .catch(err => {
        dispatch(fetchUserFailure(error));
    })
}

export const fetchQuestion = () => dispatch => {
  const accessToken = Cookies.get('accessToken');
  return fetch('/api/question', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(res => {
    if (!res.ok) {
      Cookies.remove('accessToken');
      browserHistory.replace('./login');
      throw new Error(res.statusText);
    }
    return res.json();
  })
  .then(question => {
    dispatch(fetchQuestionSuccess(question));
  })
  .catch(err => {
    dispatch(fetchQuestionFailure(error));
  })
}


export const submitAnswer = answer => dispatch => {
  const accessToken = Cookies.get('accessToken');
   let init = {
     method: 'PUT',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: `Bearer ${accessToken}`,
     },
     body: JSON.stringify(answer)
   };
   return fetch(`api/answer`, init)
  .then((res) => {
     if (res.status < 200 || res.status >= 300) {
       let error = new Error(res.statusText);
       error.res = res;
       throw error;
     }
       return res.json();
   })
 .then((answer) => {
    dispatch(submitAnswerSuccess(answer));
   })
 .catch((err) => {
    dispatch(submitAnswerFailure(err));
   })
 };