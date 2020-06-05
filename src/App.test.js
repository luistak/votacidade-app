import React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import {
  mockUnauthenticatedUser,
  mockAuthenticatedUser,
} from 'tests/mockFirebaseAuth';
import firebase from 'firebase/app';

import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign up form when user is unauthenticated', async () => {
    mockUnauthenticatedUser();

    const { getByTestId, getByText } = render(<App />);

    fireEvent.change(getByTestId('email-input'), {
      target: { value: 'any@email.com' },
    });
    fireEvent.change(getByTestId('password-input'), {
      target: { value: 'anyPassword' },
    });
    fireEvent.click(getByTestId('submit-button'));

    await waitForElementToBeRemoved(() => getByText('Carregando...'));

    expect(firebase.auth().createUserWithEmailAndPassword).toBeCalledWith(
      'any@email.com',
      'anyPassword',
    );
  });

  it('renders sign app when user is authenticated', () => {
    mockAuthenticatedUser();

    const { getByText } = render(<App />);
    expect(getByText('Vota Cidade')).toBeVisible();
  });
});
