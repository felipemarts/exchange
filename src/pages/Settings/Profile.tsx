import { useState } from 'react';
import './Settings.scss';

export function Profile() {
  const [formData, setFormData] = useState({
    name: 'Felipe Lima',
    email: 'felipe@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-01-15',
    motherName: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCEPChange = async (value: string) => {
    const formatted = formatCEP(value);
    setFormData({ ...formData, cep: formatted });

    // Auto-fill address when CEP is complete
    if (formatted.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formatted.replace('-', '')}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Atualização Cadastral</h1>
        <p>Mantenha seus dados atualizados para maior segurança</p>
      </div>

      {success && (
        <div className="success-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          Dados atualizados com sucesso!
        </div>
      )}

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Dados Pessoais</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled
              />
              <span className="input-hint">Para alterar o nome, entre em contato com o suporte</span>
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                disabled
              />
              <span className="input-hint">Email verificado</span>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="birthDate">Data de nascimento</label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="motherName">Nome da mãe</label>
              <input
                type="text"
                id="motherName"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                placeholder="Nome completo da mãe"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Endereço</h3>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                value={formData.cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">Estado</label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group flex-2">
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Cidade"
              />
            </div>
            <div className="form-group">
              <label htmlFor="neighborhood">Bairro</label>
              <input
                type="text"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Bairro"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street">Rua</label>
              <input
                type="text"
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Nome da rua"
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="number">Número</label>
              <input
                type="text"
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="000"
              />
            </div>
            <div className="form-group flex-2">
              <label htmlFor="complement">Complemento</label>
              <input
                type="text"
                id="complement"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Apartamento, bloco, etc."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
