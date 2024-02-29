import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,

  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ConfirmAccountProps {
 
  confirmEmailLink?: string;
  
}

export const ConfirmAccount = ({
 
  confirmEmailLink
}: ConfirmAccountProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm Your Account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section >
          <Img
          style={images}
            src="https://w7.pngwing.com/pngs/124/81/png-transparent-quill-paper-pens-fountain-pen-feather-feather-ink-animals-leaf-thumbnail.png"
            width="40"
            height="33"
            alt="EazyWrite"
          />
          <Text style={title}>EazyWrite</Text>
          </Section>
        
          <Section>
          
            <Text style={text}>
            Thank you for signing up for EazyWrite. To confirm your account, please follow the button below.
            </Text>
            <Button style={button} href={confirmEmailLink}>
              Confirm Account
            </Button>
          
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ConfirmAccount;

const main = {
  backgroundColor: '#fff',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '10px',
  shadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  padding: '45px',
};

const images = {
  display: 'inline'
}

const title = {
  display: 'inline',
  position: 'relative' as const, 
  bottom: '10px',
  fontSize: '20px',
  
}

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#242424',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
