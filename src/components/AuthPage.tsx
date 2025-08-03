import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onViewChange: (view: string) => void;
}

/**
 * AuthPage Component - Handles user authentication (sign up and sign in)
 * 
 * Features:
 * - Dual role registration (job posters vs professionals)
 * - Form validation and error handling
 * - Automatic redirect for authenticated users
 * - Email/password authentication via Supabase
 */
const AuthPage: React.FC<AuthPageProps> = ({ onViewChange }) => {
  const { signUp, signIn, loading, isAuthenticated } = useAuth();
  
  // Form state management
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'job_poster' as 'job_poster' | 'professional'
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Redirect authenticated users to home
  useEffect(() => {
    if (isAuthenticated) {
      onViewChange('home');
    }
  }, [isAuthenticated, onViewChange]);

  /**
   * Validates sign up form data
   * Checks for required fields, email format, password strength, and confirmation match
   */
  const validateSignUp = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!signUpData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!signUpData.password) {
      newErrors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validates sign in form data
   */
  const validateSignIn = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!signInData.email) {
      newErrors.email = 'Email is required';
    }
    if (!signInData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles sign up form submission
   * Validates form, calls auth service, and handles response
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUp()) return;

    const { error } = await signUp(signUpData.email, signUpData.password, {
      full_name: signUpData.full_name,
      phone: signUpData.phone,
      role: signUpData.role
    });

    // Clear form on successful signup
    if (!error) {
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: '',
        role: 'job_poster'
      });
    }
  };

  /**
   * Handles sign in form submission
   */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignIn()) return;

    const { error } = await signIn(signInData.email, signInData.password);

    // Clear form on successful signin
    if (!error) {
      setSignInData({ email: '', password: '' });
    }
  };

  /**
   * Generic input change handler for form fields
   */
  const handleInputChange = (
    formType: 'signUp' | 'signIn',
    field: string,
    value: string
  ) => {
    if (formType === 'signUp') {
      setSignUpData(prev => ({ ...prev, [field]: value }));
    } else {
      setSignInData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          onClick={() => onViewChange('home')}
          className="mb-6 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to JobConnect
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => handleInputChange('signIn', 'email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => handleInputChange('signIn', 'password', e.target.value)}
                      className={errors.password ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={signUpData.role}
                      onValueChange={(value: 'job_poster' | 'professional') => 
                        handleInputChange('signUp', 'role', value)
                      }
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value="job_poster" id="job_poster" />
                        <Label htmlFor="job_poster" className="flex-1 cursor-pointer">
                          <div className="font-medium">Job Poster</div>
                          <div className="text-sm text-muted-foreground">
                            Post jobs and hire professionals
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="flex-1 cursor-pointer">
                          <div className="font-medium">Professional</div>
                          <div className="text-sm text-muted-foreground">
                            Find jobs and submit bids
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.full_name}
                      onChange={(e) => handleInputChange('signUp', 'full_name', e.target.value)}
                      className={errors.full_name ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-destructive">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => handleInputChange('signUp', 'email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={signUpData.phone}
                      onChange={(e) => handleInputChange('signUp', 'phone', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={signUpData.password}
                      onChange={(e) => handleInputChange('signUp', 'password', e.target.value)}
                      className={errors.password ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password *</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => handleInputChange('signUp', 'confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Having trouble? Check your email for verification links or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;