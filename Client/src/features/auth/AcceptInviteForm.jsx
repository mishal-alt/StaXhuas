import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";
import { Input   } from "@/components/ui/input";
import { Button   } from "@/components/ui/button";
import * as authApi from '../../api/auth.api';

const acceptSchema = Joi.object({
  name: Joi.string().required().messages({ 'string.empty': 'Name is required' }),
  password: Joi.string().min(8).required().messages({ 
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  })
});

const AcceptInviteForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: joiResolver(acceptSchema)
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing invitation token');
      return;
    }

    try {
      await authApi.acceptInvite(token, {
        name: data.name,
        password: data.password
      });
      toast.success('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to accept invitation');
    }
  };

  if (!token) {
    return <div className="text-center text-brand-orange p-4">Invalid Invitation Link. Token missing.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
        Complete Setup
      </Button>
    </form>
  );
};

export default AcceptInviteForm;
