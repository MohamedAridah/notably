"use server";

import React from "react";
import { Resend } from "resend";
import errorMessage from "@/helpers/errorMessage";

const resend = new Resend(process.env.RESEND_API_KEY);

interface sendEmailProps {
  to: string;
  subject: string;
  template: React.JSX.Element;
}

export default async function sendEmail({
  to,
  subject,
  template,
}: sendEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Notably <onboarding@resend.dev>",
      to,
      subject,
      react: template,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Email sent successfully", data };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}
