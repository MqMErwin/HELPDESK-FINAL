import React, { useCallback, useMemo, useRef, useState } from 'react';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131/api';
const API_USERS_ENDPOINT = (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL) + '/users';
const ALLOWED_EMAIL_DOMAIN = (process.env.REACT_APP_ALLOWED_EMAIL_DOMAIN || '').toLowerCase();

const NAME_PATTERN = /^[\p{L}\s]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CELULAR_PATTERN = /^\+?\d{7,15}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;

const PASSWORD_STRENGTH_LABELS = {
  weak: 'Debil',
  medium: 'Media',
  strong: 'Fuerte'
};

const STEPS = Object.freeze([
  { id: 1, label: 'Datos' },
  { id: 2, label: 'Seguridad' }
]);

function evaluatePasswordStrength(password) {
  if (!password) {
    return { variant: 'empty', label: 'Ingresa una contrasena' };
  }

  let score = 0;
  if (password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 5) {
    return { variant: 'strong', label: PASSWORD_STRENGTH_LABELS.strong };
  }
  if (score >= 3) {
    return { variant: 'medium', label: PASSWORD_STRENGTH_LABELS.medium };
  }
  return { variant: 'weak', label: PASSWORD_STRENGTH_LABELS.weak };
}

export default function Register({ onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoInstitucional: '',
    correoAlternativo: '',
    celular: '',
    contrasena: '',
    confirmarContrasena: '',
    aceptaTerminos: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nombresRef = useRef(null);
  const apellidoPaternoRef = useRef(null);
  const apellidoMaternoRef = useRef(null);
  const correoInstitucionalRef = useRef(null);
  const correoAlternativoRef = useRef(null);
  const celularRef = useRef(null);
  const contrasenaRef = useRef(null);
  const confirmarContrasenaRef = useRef(null);
  const aceptaTerminosRef = useRef(null);

  const inputRefs = useMemo(() => ({
    nombres: nombresRef,
    apellidoPaterno: apellidoPaternoRef,
    apellidoMaterno: apellidoMaternoRef,
    correoInstitucional: correoInstitucionalRef,
    correoAlternativo: correoAlternativoRef,
    celular: celularRef,
    contrasena: contrasenaRef,
    confirmarContrasena: confirmarContrasenaRef,
    aceptaTerminos: aceptaTerminosRef
  }), []);

  const validateStep1 = useCallback((data) => {
    const validation = {};
    const nombres = data.nombres.trim();
    const apellidoPaterno = data.apellidoPaterno.trim();
    const apellidoMaterno = data.apellidoMaterno.trim();
    const correoInstitucional = data.correoInstitucional.trim().toLowerCase();
    const correoAlternativo = data.correoAlternativo.trim();
    const celular = data.celular.trim();

    if (nombres.length < 2 || nombres.length > 80 || !NAME_PATTERN.test(nombres)) {
      validation.nombres = 'Ingresa nombres validos (2-80 caracteres, solo letras).';
    }

    if (apellidoPaterno.length < 2 || apellidoPaterno.length > 80 || !NAME_PATTERN.test(apellidoPaterno)) {
      validation.apellidoPaterno = 'Ingresa apellido paterno valido (2-80 caracteres, solo letras).';
    }

    if (apellidoMaterno.length < 2 || apellidoMaterno.length > 80 || !NAME_PATTERN.test(apellidoMaterno)) {
      validation.apellidoMaterno = 'Ingresa apellido materno valido (2-80 caracteres, solo letras).';
    }

    if (!correoInstitucional || !EMAIL_PATTERN.test(correoInstitucional)) {
      validation.correoInstitucional = 'Ingresa un correo institucional valido.';
    } else if (ALLOWED_EMAIL_DOMAIN && !correoInstitucional.endsWith('@' + ALLOWED_EMAIL_DOMAIN)) {
      validation.correoInstitucional = 'Debe terminar en @' + ALLOWED_EMAIL_DOMAIN + '.';
    }

    if (correoAlternativo && !EMAIL_PATTERN.test(correoAlternativo)) {
      validation.correoAlternativo = 'Correo alternativo no valido.';
    }

    if (celular && !CELULAR_PATTERN.test(celular)) {
      validation.celular = 'Numero de celular no valido.';
    }

    return validation;
  }, []);

  const validateStep2 = useCallback((data) => {
    const validation = {};
    const password = data.contrasena;
    const confirm = data.confirmarContrasena;

    if (!password || !PASSWORD_PATTERN.test(password)) {
      validation.contrasena = 'Minimo 10 caracteres, mayuscula, minuscula, numero y simbolo.';
    }

    if (!confirm) {
      validation.confirmarContrasena = 'Confirma tu contrasena.';
    } else if (password !== confirm) {
      validation.confirmarContrasena = 'Las contrasenas no coinciden.';
    }

    if (!data.aceptaTerminos) {
      validation.aceptaTerminos = 'Debes aceptar los terminos y condiciones.';
    }

    return validation;
  }, []);

  const passwordStrength = useMemo(() => evaluatePasswordStrength(formData.contrasena), [formData.contrasena]);

  const markTouched = useCallback((fields) => {
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  }, []);

  const focusFirstError = useCallback((validation) => {
    const firstField = Object.keys(validation)[0];
    if (firstField && inputRefs[firstField] && inputRefs[firstField].current) {
      inputRefs[firstField].current.focus();
    }
  }, [inputRefs]);

  const handleFieldChange = (field) => (event) => {
    const value = field === 'aceptaTerminos' ? event.target.checked : event.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const stepValidation = currentStep === 1
        ? validateStep1(updated)
        : { ...validateStep1(updated), ...validateStep2(updated) };
      setErrors(stepValidation);
      return updated;
    });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = (event) => {
    event.preventDefault();
    const validation = validateStep1(formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      markTouched(['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correoInstitucional', 'correoAlternativo', 'celular']);
      focusFirstError(validation);
      return;
    }
    setErrors({});
    setCurrentStep(2);
    setTimeout(() => {
      const target = inputRefs.contrasena?.current;
      if (target) {
        target.focus();
      }
    }, 0);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    const step1Validation = validateStep1(formData);
    const step2Validation = validateStep2(formData);

    if (Object.keys(step1Validation).length > 0) {
      setErrors(step1Validation);
      markTouched(['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correoInstitucional', 'correoAlternativo', 'celular']);
      setCurrentStep(1);
      focusFirstError(step1Validation);
      return;
    }

    if (Object.keys(step2Validation).length > 0) {
      setErrors(step2Validation);
      markTouched(['contrasena', 'confirmarContrasena', 'aceptaTerminos']);
      focusFirstError(step2Validation);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const nombres = formData.nombres.trim();
    const apellidoPaterno = formData.apellidoPaterno.trim();
    const apellidoMaterno = formData.apellidoMaterno.trim();
    const apellidos = [apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ').trim();
    const nombreCompleto = [nombres, apellidos].filter(Boolean).join(' ').trim();
    const payload = {
      nombres,
      apellidos,
      correoInstitucional: formData.correoInstitucional.trim(),
      correoAlternativo: formData.correoAlternativo.trim() || null,
      celular: formData.celular.trim() || null,
      contrasena: formData.contrasena,
      rol: 'Solicitante',
      nombre: nombreCompleto,
      correo: formData.correoInstitucional.trim()
    };

    try {
      const response = await fetch(API_USERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al registrar');
      }

      setMensaje('Registro exitoso. Ahora puedes iniciar sesion.');
      setFormData({
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoInstitucional: '',
        correoAlternativo: '',
        celular: '',
        contrasena: '',
        confirmarContrasena: '',
        aceptaTerminos: false
      });
      setTouched({});
      setCurrentStep(1);
    } catch (err) {
      setError(err.message || 'Error de conexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = useMemo(() => Object.keys(validateStep1(formData)).length === 0, [formData, validateStep1]);
  const isFormValid = useMemo(() => {
    const combined = { ...validateStep1(formData), ...validateStep2(formData) };
    return Object.keys(combined).length === 0;
  }, [formData, validateStep1, validateStep2]);

  const renderFieldError = (field) => {
    if (!errors[field]) {
      return null;
    }

    const step1Fields = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correoInstitucional', 'correoAlternativo', 'celular'];
    const step2Fields = ['contrasena', 'confirmarContrasena', 'aceptaTerminos'];

    if (!touched[field] && currentStep === 1 && step1Fields.includes(field)) {
      return null;
    }
    if (!touched[field] && currentStep === 2 && step2Fields.includes(field)) {
      return null;
    }

    return <span className="field-error" role="alert">{errors[field]}</span>;
  };

  const renderStepProgress = () => (
    <div className="step-progress" role="list" aria-label="Progreso de registro">
      {STEPS.map((step) => {
        let className = 'step';
        if (step.id === currentStep) {
          className += ' active';
        }
        if (step.id < currentStep) {
          className += ' completed';
        }
        return (
          <div
            key={step.id}
            className={className}
            role="listitem"
            aria-current={step.id === currentStep ? 'step' : undefined}
          >
            <span className="circle">{step.id}</span>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => {
    const correoInstitucionalHelp = ALLOWED_EMAIL_DOMAIN
      ? 'Debe pertenecer a @' + ALLOWED_EMAIL_DOMAIN + '.'
      : 'Usa tu correo institucional valido.';

    return (
      <>
        <div className="form-group">
          <label htmlFor="nombres">Nombres</label>
          <input
            id="nombres"
            ref={inputRefs.nombres}
            type="text"
            value={formData.nombres}
            onChange={handleFieldChange('nombres')}
            onBlur={handleBlur('nombres')}
            aria-invalid={Boolean(errors.nombres)}
            aria-describedby="nombres-help"
            minLength={2}
            maxLength={80}
            required
          />
          <small id="nombres-help" className="input-help">Solo letras, de 2 a 80 caracteres.</small>
          {renderFieldError('nombres')}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="apellidoPaterno">Apellido paterno</label>
            <input
              id="apellidoPaterno"
              ref={inputRefs.apellidoPaterno}
              type="text"
              value={formData.apellidoPaterno}
              onChange={handleFieldChange('apellidoPaterno')}
              onBlur={handleBlur('apellidoPaterno')}
              aria-invalid={Boolean(errors.apellidoPaterno)}
              aria-describedby="apellidoPaterno-help"
              minLength={2}
              maxLength={80}
              required
            />
            <small id="apellidoPaterno-help" className="input-help">Solo letras, de 2 a 80 caracteres.</small>
            {renderFieldError('apellidoPaterno')}
          </div>

          <div className="form-group">
            <label htmlFor="apellidoMaterno">Apellido materno</label>
            <input
              id="apellidoMaterno"
              ref={inputRefs.apellidoMaterno}
              type="text"
              value={formData.apellidoMaterno}
              onChange={handleFieldChange('apellidoMaterno')}
              onBlur={handleBlur('apellidoMaterno')}
              aria-invalid={Boolean(errors.apellidoMaterno)}
              aria-describedby="apellidoMaterno-help"
              minLength={2}
              maxLength={80}
              required
            />
            <small id="apellidoMaterno-help" className="input-help">Solo letras, de 2 a 80 caracteres.</small>
            {renderFieldError('apellidoMaterno')}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="correoInstitucional">Correo institucional</label>
            <input
              id="correoInstitucional"
              ref={inputRefs.correoInstitucional}
              type="email"
              value={formData.correoInstitucional}
              onChange={handleFieldChange('correoInstitucional')}
              onBlur={handleBlur('correoInstitucional')}
              aria-invalid={Boolean(errors.correoInstitucional)}
              aria-describedby="correoInstitucional-help"
              required
            />
            <small id="correoInstitucional-help" className="input-help">{correoInstitucionalHelp}</small>
            {renderFieldError('correoInstitucional')}
          </div>

          <div className="form-group">
            <label htmlFor="correoAlternativo">Correo alternativo (opcional)</label>
            <input
              id="correoAlternativo"
              ref={inputRefs.correoAlternativo}
              type="email"
              value={formData.correoAlternativo}
              onChange={handleFieldChange('correoAlternativo')}
              onBlur={handleBlur('correoAlternativo')}
              aria-invalid={Boolean(errors.correoAlternativo)}
              aria-describedby="correoAlternativo-help"
            />
            <small id="correoAlternativo-help" className="input-help">Opcional, usa un correo distinto al institucional.</small>
            {renderFieldError('correoAlternativo')}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="celular">Celular (opcional)</label>
          <input
            id="celular"
            ref={inputRefs.celular}
            type="tel"
            value={formData.celular}
            onChange={handleFieldChange('celular')}
            onBlur={handleBlur('celular')}
            aria-invalid={Boolean(errors.celular)}
            aria-describedby="celular-help"
            placeholder="Ej: +59170000000"
          />
          <small id="celular-help" className="input-help">Opcional, formato internacional 7-15 digitos.</small>
          {renderFieldError('celular')}
        </div>
      </>
    );
  };

  const renderStep2 = () => (
    <>
      <div className="form-group">
        <label htmlFor="contrasena">Contrasena</label>
        <input
          id="contrasena"
          ref={inputRefs.contrasena}
          type="password"
          value={formData.contrasena}
          onChange={handleFieldChange('contrasena')}
          onBlur={handleBlur('contrasena')}
          aria-invalid={Boolean(errors.contrasena)}
          aria-describedby="contrasena-help"
          required
        />
        <small id="contrasena-help" className="input-help">Minimo 10 caracteres con mayusculas, minusculas, numeros y simbolos.</small>
        <span className={'password-strength ' + (passwordStrength.variant || '')}>{passwordStrength.label}</span>
        {renderFieldError('contrasena')}
      </div>

      <div className="form-group">
        <label htmlFor="confirmarContrasena">Confirmar contrasena</label>
        <input
          id="confirmarContrasena"
          ref={inputRefs.confirmarContrasena}
          type="password"
          value={formData.confirmarContrasena}
          onChange={handleFieldChange('confirmarContrasena')}
          onBlur={handleBlur('confirmarContrasena')}
          aria-invalid={Boolean(errors.confirmarContrasena)}
          aria-describedby="confirmarContrasena-help"
          required
        />
        <small id="confirmarContrasena-help" className="input-help">Debe coincidir con la contrasena ingresada.</small>
        {renderFieldError('confirmarContrasena')}
      </div>

      <div className="form-group checkbox-row">
        <input
          id="aceptaTerminos"
          ref={inputRefs.aceptaTerminos}
          type="checkbox"
          checked={formData.aceptaTerminos}
          onChange={handleFieldChange('aceptaTerminos')}
          onBlur={handleBlur('aceptaTerminos')}
          aria-invalid={Boolean(errors.aceptaTerminos)}
          required
        />
        <label htmlFor="aceptaTerminos">Acepto los terminos y condiciones</label>
      </div>
      {renderFieldError('aceptaTerminos')}
    </>
  );

  return (
    <div className="login-container wizard-layout">
      <form className="login-form wizard-form" onSubmit={handleRegister} noValidate>
        <div className="wizard-header">
          <h2 className="wizard-title">Registrarse</h2>
          <p className="wizard-subtitle">Completa la informacion para gestionar tus tickets.</p>
        </div>

        {renderStepProgress()}

        {error && <p className="login-error" role="alert">{error}</p>}
        {mensaje && <p className="login-success">{mensaje}</p>}

        <p className="step-indicator" aria-live="polite">Paso {currentStep} de {STEPS.length}</p>

        <div className="form-section">
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </div>

        <div className="button-row">
          {currentStep === 1 ? (
            <>
              <button type="button" className="btn-secondary" onClick={onBack}>Volver</button>
              <button type="button" className="btn-primary" onClick={handleNext} disabled={!isStep1Valid}>Siguiente</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-secondary" onClick={() => setCurrentStep(1)}>Volver</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting || !isFormValid}>Registrar</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}


