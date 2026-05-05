import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Input   } from "@/components/ui/input";
import { Button   } from "@/components/ui/button";
import { useAuth } from '../../context/AuthContext';

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: joiResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@staxhaus.com"
        error={errors.email?.message}
        labelClassName="text-white/70 uppercase text-[10px] font-black tracking-widest"
        className="text-white border-gray-700 bg-white/5 focus-visible:border-brand-orange"
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        labelClassName="text-white/70 uppercase text-[10px] font-black tracking-widest"
        className="text-white border-gray-700 bg-white/5 focus-visible:border-brand-orange"
        {...register('password')}
      />
      <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
