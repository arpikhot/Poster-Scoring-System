import smtplib
import pandas as pd
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Load Judges Data
file_path = "judges.xlsx"  # Ensure this file exists in the same directory
judges_df = pd.read_excel(file_path)  # Ensure it has columns: "Judge", "Email"

# Normalize column names (remove spaces)
judges_df.columns = judges_df.columns.str.strip()

# Email sender details
sender_email = "Add Your Email id"
password = "Put Your password Here"  # Use Gmail App Password here

# SMTP Server Configuration
smtp_server = "smtp.gmail.com"
smtp_port = 587

# Generate a random 3-digit code for each judge and store it
judges_df["VerificationCode"] = [random.randint(100, 999) for _ in range(len(judges_df))]

# Establish SMTP Connection
try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(sender_email, password)

    for _, judge in judges_df.iterrows():
        judge_id = judge["Judge"]  # Get Judge ID
        judge_email = "Sender's Email id"                      #judge["Email"]  # Ensure column name is correct
        verification_code = judge["VerificationCode"]  # Get the generated code

        # Create the email message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = judge_email
        msg["Subject"] = "Your Judge Verification Code"

        email_body = f"""
        Dear Judge,

        Your verification code for accessing the judging system is: **{verification_code}**

        Please use this code to verify your access.

        Best Regards,
        Your Organization
        """
        msg.attach(MIMEText(email_body, "plain"))

        # Send Email
        server.send_message(msg)
        print(f"Email sent to {judge_email} with code {verification_code}")

    server.quit()
    print("All emails sent successfully!")

except Exception as e:
    print(f"Error sending emails: {e}")

# Save the updated Excel file with verification codes
output_file_path = "judge_with_code.xlsx"
judges_df.to_excel(output_file_path, index=False)

print(f"Updated file saved as {output_file_path}")
