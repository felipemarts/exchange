import { useState } from 'react';
import './Settings.scss';

export function SafeWord() {
  const [safeWord, setSafeWord] = useState('');
  const [currentSafeWord, setCurrentSafeWord] = useState<string | null>(null);
  const [showSafeWord, setShowSafeWord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (safeWord.length < 4) {
      setError('A palavra segura deve ter no mínimo 4 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentSafeWord(safeWord);
      setSafeWord('');
      setSuccess(true);
    } catch (err) {
      setError('Erro ao salvar palavra segura');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentSafeWord(null);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Palavra Segura</h1>
        <p>Proteção contra phishing e sites falsos</p>
      </div>

      <div className="safe-word-explanation">
        <div className="explanation-header">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          <div>
            <h3>O que é a Palavra Segura?</h3>
            <p>
              A palavra segura é uma forma de reduzir o risco de phishing — uma técnica
              criminosa comum onde o fraudador cria um site idêntico ao do AmazonEx para
              capturar os dados do usuário.
            </p>
          </div>
        </div>

        <div className="how-it-works">
          <h4>Como funciona?</h4>
          <div className="steps">
            <div className="step">
              <div className="step-icon">1</div>
              <div className="step-content">
                <strong>Configure sua palavra</strong>
                <p>Escolha uma palavra ou frase que só você conhece</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <div className="step-content">
                <strong>Verifique ao fazer login</strong>
                <p>Sua palavra aparecerá em todas as páginas autenticadas do AmazonEx</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <div className="step-content">
                <strong>Identifique sites falsos</strong>
                <p>Se a palavra não aparecer ou for diferente, você pode estar em um site falso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="success-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          {currentSafeWord ? 'Palavra segura atualizada com sucesso!' : 'Palavra segura removida com sucesso!'}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="safe-word-form">
        {currentSafeWord ? (
          <div className="current-safe-word">
            <label>Sua palavra segura atual</label>
            <div className="safe-word-display">
              <span className={showSafeWord ? '' : 'hidden'}>
                {showSafeWord ? currentSafeWord : '••••••••'}
              </span>
              <button
                className="btn-icon"
                onClick={() => setShowSafeWord(!showSafeWord)}
              >
                {showSafeWord ? (
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

            <div className="form-group">
              <label htmlFor="newSafeWord">Alterar palavra segura</label>
              <input
                type="text"
                id="newSafeWord"
                value={safeWord}
                onChange={(e) => setSafeWord(e.target.value)}
                placeholder="Digite uma nova palavra segura"
                maxLength={50}
              />
              <span className="input-hint">Mínimo de 4 caracteres</span>
            </div>

            <div className="form-actions">
              <button className="btn-danger-outline" onClick={handleRemove} disabled={loading}>
                Remover palavra
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={loading || safeWord.length < 4}>
                {loading ? <span className="loading-spinner"></span> : 'Atualizar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="new-safe-word">
            <div className="form-group">
              <label htmlFor="safeWord">Criar palavra segura</label>
              <input
                type="text"
                id="safeWord"
                value={safeWord}
                onChange={(e) => setSafeWord(e.target.value)}
                placeholder="Digite sua palavra segura"
                maxLength={50}
              />
              <span className="input-hint">Mínimo de 4 caracteres. Use algo fácil de lembrar mas difícil de adivinhar.</span>
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={loading || safeWord.length < 4}>
              {loading ? <span className="loading-spinner"></span> : 'Salvar palavra segura'}
            </button>
          </div>
        )}
      </div>

      <div className="info-box warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <strong>Dicas importantes:</strong>
          <ul>
            <li>Nunca compartilhe sua palavra segura com ninguém</li>
            <li>Sempre verifique se a palavra está correta antes de inserir seus dados</li>
            <li>Se suspeitar de um site falso, não insira suas credenciais e entre em contato conosco</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
