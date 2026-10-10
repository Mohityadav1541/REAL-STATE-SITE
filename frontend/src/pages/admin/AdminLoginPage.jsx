import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, User } from 'lucide-react';
import { authApi } from '../../lib/api';
import { useAuth } from '../../utils/helpers';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    document.title = 'Admin Login – SS Developers';
  }, []);

  const loginMutation = useMutation({
    mutationFn: (creds) => authApi.login(creds),
    onSuccess: (data) => {
      login(data.token);
      navigate('/admin');
    },
    onError: (err) => {
      setError(err.response?.data?.error || err.message || 'Invalid credentials');
    },
  });

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">SS</div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage SS Developers</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="admin@ssdevelopers.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loginMutation.isPending}
            style={{ marginTop: 8 }}
          >
            {loginMutation.isPending ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-wrapper {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #f1f5f9;
          padding: 20px;
        }
        .admin-login-card {
          width: 100%; max-width: 400px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          padding: 40px;
        }
        .admin-login-header {
          text-align: center; margin-bottom: 32px;
        }
        .admin-login-logo {
          width: 56px; height: 56px;
          background: #0f172a;
          color: var(--color-gold-400);
          font-family: var(--font-serif);
          font-size: 24px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
          margin: 0 auto 16px;
        }
        .admin-login-header h2 {
          font-size: 24px; font-weight: 600; color: #0f172a; margin-bottom: 4px;
        }
        .admin-login-header p {
          font-size: 14px; color: #64748b;
        }
        .admin-login-error {
          background: #fef2f2;
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 24px;
          text-align: center;
          border: 1px solid #fca5a5;
        }
        .admin-login-form {
          display: flex; flex-direction: column; gap: 20px;
        }
        .input-with-icon { position: relative; }
        .input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #94a3b8;
        }
        .input-with-icon .form-input { padding-left: 40px; }
      `}</style>
    </div>
  );
}
