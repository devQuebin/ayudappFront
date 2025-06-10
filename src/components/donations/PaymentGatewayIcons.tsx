import React from 'react';
import { Box, Image, Flex } from '@chakra-ui/react';

const PaymentGatewayIcons = () => {
  const icons = [
    { src: '/img/payment-gateways/visa.svg', alt: 'Visa' },
    { src: '/img/payment-gateways/mastercard.svg', alt: 'Mastercard' },
    { src: '/img/payment-gateways/paypal.svg', alt: 'PayPal' },
    { src: '/img/payment-gateways/stripe.svg', alt: 'Stripe' },
  ];

  return (
    <Flex justifyContent="center" alignItems="center" mt={4}>
      {icons.map((icon, index) => (
        <Box key={index} mx={2}>
          <Image src={icon.src} alt={icon.alt} boxSize="40px" />
        </Box>
      ))}
    </Flex>
  );
};

export default PaymentGatewayIcons;