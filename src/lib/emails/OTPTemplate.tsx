import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components"

interface OTPTemplateProps {
  email: string
  otp: string
}

export const OTPTemplate = ({ email, otp }: OTPTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Bus Mate verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Verify Your Email</Heading>
            <Text style={text}>
              Thank you for signing up with Bus Mate! Use the code below to verify your email address.
            </Text>
            
            {/* OTP Code Box */}
            <Section style={otpSection}>
              <Text style={otpText}>{otp}</Text>
            </Section>
            
            <Text style={text}>
              This code expires in 15 minutes.
            </Text>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              If you didn't request this code, you can safely ignore this email.
            </Text>
            <Text style={footer}>
              © 2025 Bus Mate. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f3f3f5",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const section = {
  padding: "0 24px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "16px 0",
  color: "#1f2937",
}

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
}

const otpSection = {
  textAlign: "center" as const,
  margin: "32px 0",
  backgroundColor: "#f9fafb",
  padding: "24px",
  borderRadius: "8px",
  border: "2px dashed #4ade80",
}

const otpText = {
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "8px",
  color: "#000000",
  fontFamily: "monospace",
  margin: "0",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "26px 0",
}

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "8px 0",
}
