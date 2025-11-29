import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.scss';

type DocumentType = 'cpf' | 'cnpj';

export function SignUp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    documentType: 'cpf' as DocumentType,
    document: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formData.documentType === 'cpf'
      ? formatCPF(value)
      : formatCNPJ(value);
    setFormData({ ...formData, document: formatted });
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { minLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.document) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }

    setLoading(true);
    try {
      // Simulate sending verification code
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCodeSent(true);
      setStep(2);
    } catch (err) {
      setError('Erro ao enviar código de verificação');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.length !== 6) {
      setError('Código inválido');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirect to dashboard on success
      window.location.href = '/app/dashboard';
    } catch (err) {
      setError('Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodeSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        <div className="auth-header">
          <Link to="/login" className="auth-logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">AmazonEx</span>
          </Link>
          <h1>{step === 1 ? 'Criar sua conta' : 'Verificar email'}</h1>
          <p>
            {step === 1
              ? 'Preencha os dados abaixo para começar a negociar.'
              : `Enviamos um código de verificação para ${formData.email}`}
          </p>
        </div>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleStep1Submit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de documento</label>
              <div className="document-type-toggle">
                <button
                  type="button"
                  className={formData.documentType === 'cpf' ? 'active' : ''}
                  onClick={() => setFormData({ ...formData, documentType: 'cpf', document: '' })}
                >
                  CPF
                </button>
                <button
                  type="button"
                  className={formData.documentType === 'cnpj' ? 'active' : ''}
                  onClick={() => setFormData({ ...formData, documentType: 'cnpj', document: '' })}
                >
                  CNPJ
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="document">
                {formData.documentType === 'cpf' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                id="document"
                value={formData.document}
                onChange={(e) => handleDocumentChange(e.target.value)}
                placeholder={formData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                maxLength={formData.documentType === 'cpf' ? 14 : 18}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                />
                <span>
                  Li e aceito os{' '}
                  <a href="/terms" target="_blank">Termos de Uso</a> e{' '}
                  <a href="/privacy" target="_blank">Política de Privacidade</a>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : 'Criar conta'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyCode}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="verificationCode">Código de verificação</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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

            <button
              type="button"
              className="back-button"
              onClick={() => setStep(1)}
            >
              ← Voltar
            </button>
          </form>
        )}

        <p className="auth-footer">
          Já tem uma conta?{' '}
          <Link to="/login">Entrar</Link>
        </p>
      </div>

      <div className="auth-banner">
        <div className="banner-content">
          <h2>Comece a investir em minutos</h2>
          <p>
            Junte-se a milhares de brasileiros que já confiam na AmazonEx para
            investir em criptomoedas.
          </p>
          <div className="banner-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-info">
                <span className="step-title">Crie sua conta</span>
                <span className="step-desc">Preencha seus dados básicos</span>
              </div>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-info">
                <span className="step-title">Verifique seu email</span>
                <span className="step-desc">Confirme sua identidade</span>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-info">
                <span className="step-title">Comece a negociar</span>
                <span className="step-desc">Deposite e negocie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
