import React from 'react';

export default function LoginPage() {
   return (
		<div>
			<div className='ads'>
				<h2>How much of your 5th grade sciences do you remember?</h2>
			</div>
			<div className='ads'>
				<h2>Let's try Chemistry for today!</h2>
			</div>
			<div className='ads'>
				<h2>Click here for other modules to try!</h2>
			</div>
			<a href={'/api/auth/google'}>Login with Google</a>
		</div>
	);
}
