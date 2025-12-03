import { useState } from 'react';
import './Settings.scss';

type KYCStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export function KYC() {
  const [status, setStatus] = useState<KYCStatus>('pending');
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<'rg' | 'cnh' | 'passport'>('rg');
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus('in_review');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'approved') {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h1>Validar CPF/CNPJ (KYC)</h1>
          <p>Verificação de identidade</p>
        </div>

        <div className="kyc-status-card success">
          <div className="status-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h2>Verificação concluída</h2>
          <p>Sua identidade foi verificada com sucesso. Você agora tem acesso a todos os recursos da plataforma.</p>
          <div className="verification-info">
            <div className="info-item">
              <span className="label">Nome</span>
              <span className="value">Felipe Lima</span>
            </div>
            <div className="info-item">
              <span className="label">CPF</span>
              <span className="value">•••.•••.•••-00</span>
            </div>
            <div className="info-item">
              <span className="label">Nível de verificação</span>
              <span className="value">Completo</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'in_review') {
    return (
      <div className="settings-section">
        <div className="section-header">
          <h1>Validar CPF/CNPJ (KYC)</h1>
          <p>Verificação de identidade</p>
        </div>

        <div className="kyc-status-card review">
          <div className="status-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <h2>Documentos em análise</h2>
          <p>Seus documentos foram enviados e estão sendo analisados. Este processo pode levar até 48 horas úteis.</p>
          <div className="progress-steps">
            <div className="progress-step completed">
              <div className="step-dot"></div>
              <span>Documentos enviados</span>
            </div>
            <div className="progress-step active">
              <div className="step-dot"></div>
              <span>Em análise</span>
            </div>
            <div className="progress-step">
              <div className="step-dot"></div>
              <span>Verificação concluída</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Validar CPF/CNPJ (KYC)</h1>
        <p>Complete a verificação para desbloquear todos os recursos</p>
      </div>

      <div className="kyc-benefits">
        <h3>Benefícios da verificação</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Limites de saque maiores</span>
          </div>
          <div className="benefit-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Maior segurança</span>
          </div>
          <div className="benefit-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span>Depósitos via PIX</span>
          </div>
          <div className="benefit-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span>Suporte prioritário</span>
          </div>
        </div>
      </div>

      <div className="kyc-form">
        <div className="kyc-steps">
          <div className={`kyc-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Documento</span>
          </div>
          <div className={`kyc-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Frente</span>
          </div>
          <div className={`kyc-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Verso</span>
          </div>
          <div className={`kyc-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Selfie</span>
          </div>
        </div>

        {step === 1 && (
          <div className="kyc-step-content">
            <h3>Selecione o tipo de documento</h3>
            <p>Escolha o documento que você vai usar para a verificação</p>

            <div className="document-options">
              <button
                className={`document-option ${documentType === 'rg' ? 'active' : ''}`}
                onClick={() => setDocumentType('rg')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="7" y1="9" x2="17" y2="9" />
                  <line x1="7" y1="13" x2="12" y2="13" />
                </svg>
                <span>RG</span>
              </button>
              <button
                className={`document-option ${documentType === 'cnh' ? 'active' : ''}`}
                onClick={() => setDocumentType('cnh')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <line x1="13" y1="8" x2="17" y2="8" />
                  <line x1="13" y1="12" x2="17" y2="12" />
                  <line x1="7" y1="16" x2="17" y2="16" />
                </svg>
                <span>CNH</span>
              </button>
              <button
                className={`document-option ${documentType === 'passport' ? 'active' : ''}`}
                onClick={() => setDocumentType('passport')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <circle cx="12" cy="10" r="3" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
                <span>Passaporte</span>
              </button>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="kyc-step-content">
            <h3>Frente do documento</h3>
            <p>Tire uma foto clara da frente do seu {documentType === 'rg' ? 'RG' : documentType === 'cnh' ? 'CNH' : 'Passaporte'}</p>

            <div className="upload-area">
              <input
                type="file"
                id="documentFront"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setDocumentFront)}
              />
              <label htmlFor="documentFront" className={documentFront ? 'has-file' : ''}>
                {documentFront ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    <span>{documentFront.name}</span>
                  </>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                    <span>Clique para enviar ou arraste a imagem</span>
                    <span className="hint">PNG, JPG até 5MB</span>
                  </>
                )}
              </label>
            </div>

            <div className="tips-box">
              <h4>Dicas para uma boa foto:</h4>
              <ul>
                <li>Certifique-se de que o documento esteja totalmente visível</li>
                <li>Evite reflexos e sombras</li>
                <li>A imagem deve estar nítida e legível</li>
              </ul>
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button className="btn-primary" onClick={() => setStep(3)} disabled={!documentFront}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="kyc-step-content">
            <h3>Verso do documento</h3>
            <p>Tire uma foto clara do verso do seu {documentType === 'rg' ? 'RG' : documentType === 'cnh' ? 'CNH' : 'Passaporte'}</p>

            <div className="upload-area">
              <input
                type="file"
                id="documentBack"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setDocumentBack)}
              />
              <label htmlFor="documentBack" className={documentBack ? 'has-file' : ''}>
                {documentBack ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    <span>{documentBack.name}</span>
                  </>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                    <span>Clique para enviar ou arraste a imagem</span>
                    <span className="hint">PNG, JPG até 5MB</span>
                  </>
                )}
              </label>
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                Voltar
              </button>
              <button className="btn-primary" onClick={() => setStep(4)} disabled={!documentBack}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="kyc-step-content">
            <h3>Selfie com documento</h3>
            <p>Tire uma foto segurando seu documento ao lado do rosto</p>

            <div className="upload-area">
              <input
                type="file"
                id="selfie"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setSelfie)}
              />
              <label htmlFor="selfie" className={selfie ? 'has-file' : ''}>
                {selfie ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    <span>{selfie.name}</span>
                  </>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Clique para enviar ou arraste a imagem</span>
                    <span className="hint">PNG, JPG até 5MB</span>
                  </>
                )}
              </label>
            </div>

            <div className="tips-box">
              <h4>Instruções:</h4>
              <ul>
                <li>Segure o documento próximo ao rosto</li>
                <li>Seu rosto e o documento devem estar visíveis</li>
                <li>A foto deve ter boa iluminação</li>
              </ul>
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(3)}>
                Voltar
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={!selfie || loading}>
                {loading ? <span className="loading-spinner"></span> : 'Enviar documentos'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
