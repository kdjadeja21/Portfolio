import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
  submittedAt?: string;
  clientIp?: string | null;
};

export default function ContactFormEmail({
  message,
  senderEmail,
  submittedAt,
  clientIp,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from your portfolio site</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="bg-white borderBlack my-10 px-10 py-4 rounded-md">
              <Heading className="leading-tight">
                You received the following message from the contact form
              </Heading>
              <Text>{message}</Text>
              <Hr />
              <Text>The sender&apos;s email is: {senderEmail}</Text>
              {submittedAt || clientIp ? (
                <Text className="text-xs text-gray-500">
                  {submittedAt ? `Submitted ${submittedAt}` : null}
                  {submittedAt && clientIp ? " · " : null}
                  {clientIp ? `IP ${clientIp}` : null}
                </Text>
              ) : null}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
