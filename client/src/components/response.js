import React from 'react';
import * as Cookies from 'js-cookie';


export default class Response extends React.Component {

  onSubmit() {
    const accessToken = Cookies.get('accessToken');
    //linking to post endpoint
    fetch('/api/questions/next', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      console.log('we are going somewhere');
      return res.json();
    })

  }
  render () {
    return (
       <div className='response'>
          <form>
            <input type="text" autoComplete="on" id="response"></input>
            <button onClick={() => this.onSubmit()} className="btn">Submit response</button>
          </form>
        </div>
    )
  }
}