import React from 'react';


export default class Response extends React.Component {
  render () {
    return (
       <div className='response'>
          <form>
            <input type="text" autocomplete='on' id="response"></input>
            <button type='submit'>submit response </button>
          </form>
        </div>
    )
  }
}