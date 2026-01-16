import os
import resend
from typing import Optional
from pydantic import EmailStr
import asyncio

class EmailService:
    def __init__(self):
        # Initialize Resend with API Key
        self.api_key = os.getenv("MAIL_PASSWORD", "")
        resend.api_key = self.api_key
        self.sender_email = os.getenv("MAIL_FROM", "onboarding@resend.dev")
        
    def _send_sync(self, email: str, reset_link: str) -> bool:
        try:
            html_content = f"""
            <html>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background-color: #f8fafc; padding: 40px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #0891b2 100%); padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Planit</h1>
                        </div>
                        <div style="padding: 40px 32px;">
                            <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
                            <p style="margin: 0 0 24px 0; line-height: 1.6; color: #475569;">We received a request to reset the password for your Planit account. Click the button below to proceed.</p>
                            
                            <div style="text-align: center; margin-bottom: 32px;">
                                <a href="{reset_link}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; font-weight: 600; text-decoration: none; border-radius: 12px; transition: background-color 0.2s;">
                                    Reset Password
                                </a>
                            </div>
                            
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:</p>
                            <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 13px; color: #475569; margin-bottom: 24px;">
                                {reset_link}
                            </div>
                            
                            <p style="margin: 0 0 16px 0; line-height: 1.6; color: #475569;">If you didn't request a password reset, you can safely ignore this email. This link will expire in 30 minutes.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                            <p style="margin: 0; font-size: 12px; text-align: center; color: #94a3b8;">
                                &copy; 2026 Planit Todo Inc. Built for the Modern Workspace.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            params = {
                "from": self.sender_email,
                "to": [email],
                "subject": "Reset Your Password - Planit",
                "html": html_content,
            }

            email_response = resend.Emails.send(params)
            print(f"DEBUG: Resend API Response: {email_response}")
            
            # Resend SDK returns a response object with an ID if successful
            if hasattr(email_response, "id") or (isinstance(email_response, dict) and "id" in email_response):
                print(f"DEBUG: Email sent successfully! ID: {getattr(email_response, 'id', email_response.get('id'))}")
                return True
            else:
                print(f"ERROR: Email response did not contain an ID: {email_response}")
                return False
            
        except Exception as e:
            print(f"ERROR: Resend failed to send email: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

    async def send_reset_password_email(self, email: EmailStr, reset_link: str):
        """
        Send a password reset email using Resend SDK
        """
        return await asyncio.to_thread(self._send_sync, str(email), reset_link)
