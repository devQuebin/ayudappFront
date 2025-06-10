import { isValidCreditCardNumber } from 'some-credit-card-validation-library';

export const validateDonationAmount = (amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return 'Please enter a valid donation amount.';
  }
  return null;
};

export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return 'Credit card number is required.';
  }
  if (!isValidCreditCardNumber(cardNumber)) {
    return 'Invalid credit card number.';
  }
  return null;
};

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required.';
  }
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};