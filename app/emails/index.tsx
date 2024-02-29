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

interface ResetPasswordEmailProps {
 
  resetPasswordLink?: string;
  name?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const ResetPasswordEmail = ({
  name,
  resetPasswordLink
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview> reset your password</Preview>
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
            <Text style={text}>Hello, {name}</Text>
            <Text style={text}>
              Someone recently requested a password change for your 
              account. If this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

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
