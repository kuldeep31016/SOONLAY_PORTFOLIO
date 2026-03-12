import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, subject, message, projectTitle, techStack } = await req.json();

    // Check if it's a general contact or a project inquiry
    const isProjectInquiry = !!projectTitle;

    if (!isProjectInquiry && (!fullName || !email || !subject || !message)) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (isProjectInquiry && !projectTitle) {
      return NextResponse.json(
        { error: "Project title is missing" },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail (or another service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "syedayaan9376@gmail.com, iamkuldeepraj55@gmail.com",
      subject: isProjectInquiry 
        ? `New Project Inquiry: ${projectTitle}`
        : `New Contact Form Submission: ${subject}`,
      text: isProjectInquiry
        ? `
        New Project Inquiry:
        
        Name: ${fullName || "Not provided"}
        Email: ${email || "Not provided"}
        Project Title: ${projectTitle}
        Tech Stack: ${techStack || "Not provided"}
        
        Description:
        ${message || "No description provided"}
        `
        : `
        New Contact Form Submission:
        
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: isProjectInquiry
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Project Inquiry</h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${fullName || "Not provided"}</p>
            <p><strong>Email:</strong> ${email || "Not provided"}</p>
            <p><strong>Project Title:</strong> ${projectTitle}</p>
            <p><strong>Tech Stack:</strong> ${techStack || "Not provided"}</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin-top: 0; font-weight: bold;">Description:</p>
            <p style="white-space: pre-wrap;">${message || "No description provided"}</p>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
            This email was sent from the Soonlay Portfolio project inquiry form.
          </p>
        </div>
        `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <p style="margin-top: 0; font-weight: bold;">Message:</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
            This email was sent from the Soonlay Portfolio contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
