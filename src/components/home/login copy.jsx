import './index.css' // eslint-disable-next-line
  import { useState, useEffect } from 'react'
  import { Auth } from '@supabase/auth-ui-react'
  import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../../supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Container } from '@mui/material'


  export default function Login2() {

    const handlelogingout = async () => {supabase.auth.signOut()}
    const {session} = useAuth();
    if (!session) {
      return (
        <div className="backG d-flex flex-column align-items-center justify-content-center">
          <Container className='contlogin border rounded border-dark'>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
          </Container>
        </div>
      )
    }
    else {
      return (<div style={{cursor: "pointer"}} title='Deslogar' onClick={handlelogingout}>Logged in!</div>)
    }
  }