'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('✅ Vérifie ton email — un lien de connexion t\'a été envoyé !')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAF9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>🇨🇭 Trouvia</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Connecte-toi avec ton email</p>

        <input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px',
            marginBottom: '16px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          style={{
            width: '100%',
            padding: '12px',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !email ? 0.6 : 1
          }}
        >
          {loading ? 'Envoi...' : 'Envoyer le lien de connexion'}
        </button>

        {message && (
          <p style={{ marginTop: '16px', color: message.startsWith('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}