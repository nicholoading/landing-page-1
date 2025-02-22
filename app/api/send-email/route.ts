// @ts-nocheck

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      teamName,
      teacherEmail,
      teacherName,
      teacherPhone,
      teacherIC,
      size,
      representingSchool,
      schoolName,
      schoolAddress,
      postalCode,
      educationLevel,
      category,
      city,
      state,
      teamMembers,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content with a table structure
    const emailContent = `
      <h2>BugCrusher Hackathon Registration Confirmation</h2>
      <p>Dear ${teacherName},</p>
      <p>Thank you for registering your team <strong>${teamName}</strong> for the BugCrusher Hackathon! Your application is currently <strong>PENDING REVIEW</strong>. You will receive a confirmation email once the admin has approved your registration.</p>
      <p>You can check your registration status at: <a href="https://bugcrusher.com/status">BugCrusher Status Page</a></p>
      
      <h3>Team Details</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><td>Team Name</td><td>${teamName}</td></tr>
        <tr><td>Representing School</td><td>${representingSchool === "yes" ? "Yes" : "No"}</td></tr>
        ${representingSchool === "yes" ? `
        <tr><td>School Name</td><td>${schoolName}</td></tr>
        <tr><td>School Address</td><td>${schoolAddress}</td></tr>
        <tr><td>Postal Code</td><td>${postalCode}</td></tr>` : ""}
        <tr><td>Education Level</td><td>${educationLevel}</td></tr>
        <tr><td>Category</td><td>${category}</td></tr>
        <tr><td>City</td><td>${city}</td></tr>
        <tr><td>State</td><td>${state}</td></tr>
      </table>

      <h3>Teacher Details</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><td>Name</td><td>${teacherName}</td></tr>
        <tr><td>Email</td><td>${teacherEmail}</td></tr>
        <tr><td>Phone</td><td>${teacherPhone}</td></tr>
        <tr><td>IC</td><td>${teacherIC}</td></tr>
        <tr><td>T-Shirt Size</td><td>${size}</td></tr>
      </table>

      <h3>Team Members</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th>Name</th>
          <th>IC</th>
          <th>Gender</th>
          <th>Race</th>
          <th>Grade</th>
          <th>Parent Name</th>
          <th>Parent Phone</th>
          <th>Parent Email</th>
          <th>Size</th>
          <th>Coding Experience</th>
        </tr>
        ${teamMembers
          .map(
            (member) => `
        <tr>
          <td>${member.name}</td>
          <td>${member.ic}</td>
          <td>${member.gender}</td>
          <td>${member.race}</td>
          <td>${member.grade}</td>
          <td>${member.parentName}</td>
          <td>${member.parentPhone}</td>
          <td>${member.parentEmail}</td>
          <td>${member.size}</td>
          <td>${member.codingExperience}</td>
        </tr>`
          )
          .join("")}
      </table>

      <p>We will notify you via email once your registration has been approved.</p>
      <p>For any questions, feel free to contact us at <a href="mailto:support@bugcrusher.com">support@bugcrusher.com</a>.</p>
      <p>Best regards,</p>
      <p><strong>BugCrusher Hackathon Team</strong></p>
    `;

    const recipients = [teacherEmail, ...teamMembers.map((m) => m.parentEmail)];

    // Send email to teacher & team members
    await Promise.all(
      recipients.map((email) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "BugCrusher Hackathon Registration Confirmation",
          html: emailContent,
        })
      )
    );

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
