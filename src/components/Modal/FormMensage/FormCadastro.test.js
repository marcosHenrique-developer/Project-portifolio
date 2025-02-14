/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import user from '@testing-library/user-event';
import { render, screen, act, waitFor } from '../../../infra/test/testUtils';
import FormContato from '.';

const nameMock = 'Marcosvaldo';
const emailMock = 'macos@mh.com';
const onSubmitMock = jest.fn((e) => e.preventDefault());

describe('<FormContato />', () => {
  describe('when the user fills the form', () => {
    describe('with valid data', () => {
      test('it attempts to submit', async () => {
        await act(async () =>
          render(
            <FormContato
              CloseButton={() => null}
              props={{}}
              onSubmit={onSubmitMock}
            />,
          ),
        );

        const submitButton = screen.getByRole('button', {
          name: /enviar/i,
        });
        expect(submitButton).toBeDisabled();

        const nameInput = screen.getByLabelText(/nome/i);
        user.type(nameInput, nameMock);
        await waitFor(() => expect(nameInput).toHaveValue(nameMock));

        const emailInput = screen.getByLabelText(/e-mail/i);
        user.type(emailInput, emailMock);
        await waitFor(() => expect(emailInput).toHaveValue(emailMock));

        expect(submitButton).not.toBeDisabled();

        user.click(submitButton);
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
      });

      test('a loading animation is displayed', async () => {
        await act(async () =>
          render(
            <FormContato
              CloseButton={() => null}
              props={{}}
              onSubmit={onSubmitMock}
              formSubmission
            />,
          ),
        );
        const alertMessage = screen.getByRole('alert');
        expect(alertMessage).toMatchSnapshot();
      });

      describe('when the submission completes', () => {
        test('a feedback message is displayed', async () => {
          await act(async () =>
            render(
              <FormContato
                CloseButton={() => null}
                props={{}}
                onSubmit={onSubmitMock}
                formSubmission
              />,
            ),
          );

          const alertMessage = screen.getByRole('alert');
          expect(alertMessage).toMatchSnapshot();

          const actionButton = screen.getByRole('button');
          await act(async () => user.click(actionButton));

          expect(
            screen.getByRole('button', {
              name: /enviar/i,
            }),
          ).toBeDefined();
        });
      });
    });

    describe('with invalid data', () => {
      test('the errors are displayed', async () => {
        await act(async () =>
          render(
            <FormContato
              CloseButton={() => null}
              props={{}}
              onSubmit={onSubmitMock}
            />,
          ),
        );

        const emailInput = screen.getByLabelText(/e-mail/i);
        emailInput.focus();
        emailInput.blur();

        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeDefined();
      });
    });
  });
});
