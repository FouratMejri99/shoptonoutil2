// Email utility using Resend
// Resend is a modern email service that's easy to use

import { Resend } from "resend";
import { ENV } from "./_core/env";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = ENV.resendApiKey;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export type LeadEmailData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  message: string;
};

export async function sendLeadNotification(
  data: LeadEmailData
): Promise<boolean> {
  try {
    const resend = getResendClient();

    const serviceTypeLabels: Record<string, string> = {
      "document-localization": "Document Localization",
      "elearning-localization": "eLearning Localization",
      "audio-video-localization": "Audio/Video Localization",
      "creation-solutions": "Creation Solutions",
      other: "Other",
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Lead from Solupedia Website</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; width: 120px;">Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Phone:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${data.phone || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Company:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${data.company || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Service:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${serviceTypeLabels[data.serviceType] || data.serviceType || "Not specified"}</td>
              </tr>
            </table>
            
            <div style="margin-top: 24px;">
              <p style="font-weight: 600; color: #64748b; margin-bottom: 8px;">Message:</p>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                ${data.message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Source:</strong> Contact Form (solupedia.com/contact)
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Lead from Solupedia Website
================================

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}
Service: ${serviceTypeLabels[data.serviceType] || data.serviceType || "Not specified"}

Message:
${data.message}

Source: Contact Form (solupedia.com/contact)
    `;

    const result = await resend.emails.send({
      from: "Solupedia Leads <leads@solupedia.com>",
      to: ["info@solupedia.com"],
      subject: `New Lead: ${data.name} - ${serviceTypeLabels[data.serviceType] || "General Inquiry"}`,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error("[Email] Failed to send lead notification:", result.error);
      return false;
    }

    console.log(
      "[Email] Lead notification sent successfully:",
      result.data?.id
    );
    return true;
  } catch (error: any) {
    console.error("[Email] Error sending lead notification:", error);
    return false;
  }
}

export async function sendAutoReply(data: LeadEmailData): Promise<boolean> {
  try {
    const resend = getResendClient();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Solupedia</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <p style="font-size: 16px; color: #333;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; color: #333;">Thank you for reaching out to Solupedia. We have received your message and our team will review it shortly.</p>
            
            <p style="font-size: 16px; color: #333;">Here's a summary of your inquiry:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">Service Interest:</p>
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #2563eb;">
                ${
                  data.serviceType
                    ? data.serviceType
                        .split("-")
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    : "General Inquiry"
                }
              </p>
              
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">Your Message:</p>
              <p style="margin: 0; color: #333; line-height: 1.6;">${data.message.substring(0, 200)}${data.message.length > 200 ? "..." : ""}</p>
            </div>
            
            <p style="font-size: 16px; color: #333;">Our team typically responds within 24 business hours. If your request is urgent, please call us directly at <strong>+1 (910) 626-8525</strong>.</p>
            
            <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Best regards,</strong><br>
                The Solupedia Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: "Solupedia <info@solupedia.com>",
      to: [data.email],
      subject: "Thank you for contacting Solupedia",
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Email] Failed to send auto-reply:", result.error);
      return false;
    }

    console.log("[Email] Auto-reply sent successfully to:", data.email);
    return true;
  } catch (error: any) {
    console.error("[Email] Error sending auto-reply:", error);
    return false;
  }
}

// Lead Magnet email with guide link
export async function sendLeadMagnetEmail(data: {
  name: string;
  email: string;
  company: string;
}): Promise<boolean> {
  try {
    const resend = getResendClient();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Guide is Ready!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #333; margin-bottom: 24px;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
              Thank you for downloading <strong>"The Ultimate Guide to eLearning Localization"</strong>! Your copy is ready for download.
            </p>
            
            <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid #e2e8f0; margin: 24px 0; text-align: center;">
              <p style="font-size: 16px; color: #64748b; margin-bottom: 16px;">📚 What's inside:</p>
              <ul style="text-align: left; list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #333;">✓ The fundamentals of eLearning localization</li>
                <li style="padding: 8px 0; color: #333;">✓ Cultural adaptation strategies</li>
                <li style="padding: 8px 0; color: #333;">✓ Best practices for multimedia localization</li>
                <li style="padding: 8px 0; color: #333;">✓ Technical considerations for LMS integration</li>
                <li style="padding: 8px 0; color: #333;">✓ Quality assurance processes</li>
              </ul>
            </div>
            
            <a href="https://solupedia.com/lead-magnet/guide" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 24px 0;">
              Download Your Guide
            </a>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
              If the button above doesn't work, copy and paste this link into your browser:<br>
              <a href="https://solupedia.com/lead-magnet/guide" style="color: #2563eb;">https://solupedia.com/lead-magnet/guide</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
            
            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">
              While you're here, feel free to explore our other resources:
            </p>
            
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
              <a href="https://solupedia.com/blog" style="color: #2563eb; text-decoration: none;">📝 Blog</a>
              <a href="https://solupedia.com/case-studies" style="color: #2563eb; text-decoration: none;">📊 Case Studies</a>
              <a href="https://solupedia.com/services" style="color: #2563eb; text-decoration: none;">🛠️ Our Services</a>
            </div>
            
            <div style="margin-top: 32px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Questions?</strong> Reply to this email or contact us at <a href="mailto:info@solupedia.com" style="color: #2563eb;">info@solupedia.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: "Solupedia <info@solupedia.com>",
      to: [data.email],
      subject: "🎉 Your eLearning Localization Guide is Ready! - Solupedia",
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Email] Failed to send lead magnet email:", result.error);
      return false;
    }

    console.log("[Email] Lead magnet email sent to:", data.email);
    return true;
  } catch (error: any) {
    console.error("[Email] Error sending lead magnet email:", error);
    return false;
  }
}

// Newsletter subscription confirmation
export async function sendNewsletterConfirmation(
  email: string
): Promise<boolean> {
  try {
    const resend = getResendClient();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Solupedia's Newsletter! 🎉</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #333; margin-bottom: 24px;">Hi there,</p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
              Thank you for subscribing to Solupedia's newsletter! You're now on our list to receive the latest insights on localization, industry trends, and expert tips.
            </p>
            
            <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid #e2e8f0; margin: 24px 0;">
              <p style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 16px;">What to expect:</p>
              <ul style="text-align: left; list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #333;">📧 Industry insights and best practices</li>
                <li style="padding: 8px 0; color: #333;">📚 Free resources and guides</li>
                <li style="padding: 8px 0; color: #333;">🎯 Tips for successful localization projects</li>
                <li style="padding: 8px 0; color: #333;">📊 Case studies and success stories</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
              We respect your inbox and won't spam you. You can unsubscribe anytime by clicking the link at the bottom of any newsletter.
            </p>
            
            <div style="margin-top: 32px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Questions?</strong> Reply to this email or contact us at <a href="mailto:info@solupedia.com" style="color: #2563eb;">info@solupedia.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: "Solupedia <info@solupedia.com>",
      to: [email],
      subject: "Welcome to Solupedia's Newsletter! 🎉",
      html: htmlContent,
    });

    if (result.error) {
      console.error(
        "[Email] Failed to send newsletter confirmation:",
        result.error
      );
      return false;
    }

    console.log("[Email] Newsletter confirmation sent to:", email);
    return true;
  } catch (error: any) {
    console.error("[Email] Error sending newsletter confirmation:", error);
    return false;
  }
}
