import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Form,
  Alert,
  Spinner,
} from 'reactstrap';
import styled from 'styled-components';
import firebase from 'firebase/app';

import errorMessages from 'constants/errorMessages';
import colors from 'styles/colors';
import { Box, StyledSpan } from './User.styled';

const Title = styled.h2`
  font-size: 20px;
  color: ${colors.purple};
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
`;

function ForgotPassword({ hideForgotPassword }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await firebase.auth().sendPasswordResetEmail(event.target.email.value);
      setError('');
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setError(errorMessages[error.code]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Title>Ajuda para recuperar a senha</Title>
      <Subtitle>
        Digite seu e-mail para recuperar sua senha. Você receberá um e-mail com
        instruções.
      </Subtitle>
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        {success && (
          <Alert color="success">
            Uma solicitação foi enviada ao seu e-mail para alterar sua senha.
          </Alert>
        )}
        <FormGroup>
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            id="email"
            data-testid="email-input"
            placeholder="Digite seu e-mail"
            disabled={loading}
          />
        </FormGroup>

        <Button color="primary" block type="submit" disabled={loading}>
          {loading ? <Spinner color="light" size="sm" /> : 'Enviar'}
        </Button>
      </Form>

      <StyledSpan>
        <button onClick={hideForgotPassword}>Já é cadastrado?</button>
      </StyledSpan>
    </Box>
  );
}

export default ForgotPassword;
