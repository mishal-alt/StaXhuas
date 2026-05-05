import React from 'react';
import LoginForm from '../features/auth/LoginForm';
import { Logo   } from "@/components/ui/logo";


const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-brand-charcoal p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-800">
        <div className="text-center mb-8">
          <Logo className="h-20" />
          <p className="text-gray-400 mt-2 text-sm">
            Staxhaus is invite-only.<br />Check your inbox for an invitation.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-xs text-gray-500 font-mono tracking-widest">
          &lt;/the school of experience&gt;
        </div>
      </div>
    </div>
  );
};

export default Login;
