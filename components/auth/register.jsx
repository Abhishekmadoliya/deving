"use client"
import React from 'react'

const Register = () => {





    function registerwithgoogle(){

        const params = new URLSearchParams({
            client_id: '916465301269-e31r0d9819ij51h8119mht7lilqofn6d.apps.googleusercontent.com',
            redirect_uri: `http://localhost:8000/api/auth/google/callback`,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent',
            state: 'cdlxkcn;l',
            
        })




        


    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

        
    }
  return (
    <div>
      <button onClick={registerwithgoogle}>Register with google</button>
    </div>
  )
}

export default Register
