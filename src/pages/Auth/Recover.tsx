import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.scss';

export function Recover() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { minLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const passwordValidation = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Código inválido');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      setError('Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/login" className="auth-logo">
              <span className="logo-icon">A</span>
              <span className="logo-text">AmazonEx</span>
            </Link>
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <h1>Senha redefinida!</h1>
            <p>Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.</p>
          </div>
          <Link to="/login" className="auth-submit" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
            Ir para o login
          </Link>
        </div>
        <div className="auth-banner">
          <div className="banner-content">
            <h2>Segurança em primeiro lugar</h2>
            <p>
              Recomendamos que você ative a autenticação em duas etapas para
              aumentar a segurança da sua conta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/login" className="auth-logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">AmazonEx</span>
          </Link>
          <h1>
            {step === 1 && 'Recuperar senha'}
            {step === 2 && 'Verificar código'}
            {step === 3 && 'Nova senha'}
          </h1>
          <p>
            {step === 1 && 'Digite seu email para receber um código de recuperação.'}
            {step === 2 && `Enviamos um código de verificação para ${email}`}
            {step === 3 && 'Digite sua nova senha.'}
          </p>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendCode}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Enviar código'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyCode}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="code">Código de verificação</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="verification-input"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Verificar'}
            </button>

            <div className="resend-code">
              <span>Não recebeu o código?</span>
              <button type="button" onClick={resendCode} disabled={loading}>
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="newPassword">Nova senha</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="password-requirements">
                <span className={passwordValidation.minLength ? 'valid' : ''}>
                  ✓ Mínimo 8 caracteres
                </span>
                <span className={passwordValidation.hasUpper ? 'valid' : ''}>
                  ✓ Uma letra maiúscula
                </span>
                <span className={passwordValidation.hasLower ? 'valid' : ''}>
                  ✓ Uma letra minúscula
                </span>
                <span className={passwordValidation.hasNumber ? 'valid' : ''}>
                  ✓ Um número
                </span>
                <span className={passwordValidation.hasSpecial ? 'valid' : ''}>
                  ✓ Um caractere especial
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar nova senha</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Redefinir senha'}
            </button>
          </form>
        )}

        {step > 1 && (
          <button
            type="button"
            className="back-button"
            onClick={() => setStep(step - 1)}
          >
            ← Voltar
          </button>
        )}

        <p className="auth-footer">
          Lembrou sua senha?{' '}
          <Link to="/login">Entrar</Link>
        </p>
      </div>

      <div className="auth-banner">
        <div className="banner-content">
          <h2>Recupere o acesso à sua conta</h2>
          <p>
            Siga as instruções para redefinir sua senha de forma segura.
          </p>
          <div className="banner-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-info">
                <span className="step-title">Informe seu email</span>
                <span className="step-desc">Digite o email cadastrado</span>
              </div>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-info">
                <span className="step-title">Verifique o código</span>
                <span className="step-desc">Confirme sua identidade</span>
              </div>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-info">
                <span className="step-title">Nova senha</span>
                <span className="step-desc">Crie uma senha forte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
