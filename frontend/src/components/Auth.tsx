import fetch from 'isomorphic-fetch';
import React, { useState, useEffect } from 'react'

import { useAuth } from '@clerk/clerk-react'
import { IUSerInfo } from '../interfaces/user-info.interface';

function Auth() {
  const [data, setData] = useState<IUSerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const response = await fetch('http://localhost:4200/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            mode: 'cors',
          },
        })

        const result = await response.json();

        if (!response.ok) {
          return setError(result);
        }

        setData(result);
      } catch (err: any) {
        setError({ message: err?.message || 'Error while receiving data from server'})
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [getToken])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error?.message}</div>
  }

  return (
    <div>
      <h1>User info:</h1>
      <p>ID: { data?.id }</p>
      <p>Email: { data?.email }</p>
    </div>
  )
}

export default Auth