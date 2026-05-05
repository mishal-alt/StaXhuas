import React from 'react';
import AcceptInviteForm from '../features/auth/AcceptInviteForm';

const AcceptInvite = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-charcoal tracking-tight">Set up your account</h1>
          <p className="text-brand-gray mt-2 text-sm">
            Welcome to Staxhaus. Create a password to access your dashboard.
          </p>
        </div>
        
        <AcceptInviteForm />
      </div>
    </div>
  );
};

export default AcceptInvite;
