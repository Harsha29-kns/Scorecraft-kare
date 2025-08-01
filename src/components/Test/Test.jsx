import React from 'react';

const Test = () => {
  // WARNING: For debugging only. Do not leave this in production.
  const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', fontSize: '16px' }}>
      <h1>Environment Variable Test Page</h1>
      <p>
        This page checks if your environment variables are correctly loaded in Vercel.
      </p>
      <hr style={{ margin: '20px 0' }} />
      <h2>Firebase API Key Check:</h2>
      {firebaseApiKey ? (
        <p style={{ color: 'green', wordWrap: 'break-word' }}>
          <strong>SUCCESS:</strong> VITE_FIREBASE_API_KEY is loaded.
          <br />
          Value: {firebaseApiKey}
        </p>
      ) : (
        <p style={{ color: 'red' }}>
          <strong>FAILURE:</strong> VITE_FIREBASE_API_KEY is missing or undefined.
        </p>
      )}
      <hr style={{ margin: '20px 0' }} />
      <p style={{ marginTop: '20px', color: '#555' }}>
        If this shows FAILURE, please double-check the variable names (including the `VITE_` prefix) and values in your Vercel project settings and redeploy.
      </p>
    </div>
  );
};

export default Test;