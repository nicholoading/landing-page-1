// @ts-nocheck
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, teacherEmail, teacherIC, teamMembers, teacherGender, teacherRace, ...rest } = body;

    // Check for missing required fields
    const requiredFields = {
      teamName, teacherEmail, teacherIC, teacherGender, teacherRace,
      teacherName: body.teacherName, teacherPhone: body.teacherPhone, size: body.size,
      representingSchool: body.representingSchool, educationLevel: body.educationLevel,
      category: body.category, city: body.city, state: body.state,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0 || !teamMembers || teamMembers.length !== 3) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}${teamMembers.length !== 3 ? ", teamMembers (must have exactly 3 members)" : ""}` },
        { status: 400 }
      );
    }

    // Validate IC formats
    if (!/^\d{12}$/.test(teacherIC)) {
      return NextResponse.json(
        { error: "Teacher IC must be exactly 12 digits (e.g., 123456789012)." },
        { status: 400 }
      );
    }
    const invalidICs = teamMembers.filter(member => !/^\d{12}$/.test(member.ic));
    if (invalidICs.length > 0) {
      return NextResponse.json(
        { error: `Invalid IC formats for team members: ${invalidICs.map(m => `${m.name} (${m.ic})`).join(", ")}. Must be exactly 12 digits.` },
        { status: 400 }
      );
    }

    // Extract all emails and ICs
    const allEmails = [teacherEmail, ...teamMembers.map(m => m.parentEmail)];
    const allICs = [teacherIC, ...teamMembers.map(m => m.ic)];

    // Check for duplicates within the submission
    const emailSet = new Set(allEmails);
    const icSet = new Set(allICs);
    if (emailSet.size !== allEmails.length) {
      const duplicates = allEmails.filter((item, index) => allEmails.indexOf(item) !== index);
      return NextResponse.json(
        { error: `Duplicate emails found within submission: ${duplicates.join(", ")}. All emails must be unique.` },
        { status: 400 }
      );
    }
    if (icSet.size !== allICs.length) {
      const duplicates = allICs.filter((item, index) => allICs.indexOf(item) !== index);
      return NextResponse.json(
        { error: `Duplicate ICs found within submission: ${duplicates.join(", ")}. All ICs must be unique.` },
        { status: 400 }
      );
    }

    // Fetch existing data from Supabase
    const { data: existingTeams, error: fetchError } = await supabase
      .from("teams")
      .select("teamName, teacherEmail, teacherIC, teamMembers");

    if (fetchError) throw new Error("Error fetching existing teams.");

    // Check for duplicate teamName
    if (existingTeams.some(team => team.teamName === teamName)) {
      return NextResponse.json(
        { error: `Team name "${teamName}" is already taken. Please choose a unique team name.` },
        { status: 400 }
      );
    }

    // Extract existing emails and ICs
    const existingEmails = new Set([
      ...existingTeams.map(team => team.teacherEmail),
      ...existingTeams.flatMap(team => team.teamMembers.map(m => m.parentEmail))
    ]);
    const existingICs = new Set([
      ...existingTeams.map(team => team.teacherIC),
      ...existingTeams.flatMap(team => team.teamMembers.map(m => m.ic))
    ]);

    // Check for duplicates across database
    const duplicateEmails = allEmails.filter(email => existingEmails.has(email));
    const duplicateICs = allICs.filter(ic => existingICs.has(ic));

    if (duplicateEmails.length > 0) {
      return NextResponse.json(
        { error: `The following emails are already registered in another team: ${duplicateEmails.join(", ")}. Emails must be unique across all teams.` },
        { status: 400 }
      );
    }
    if (duplicateICs.length > 0) {
      return NextResponse.json(
        { error: `The following ICs are already registered in another team: ${duplicateICs.join(", ")}. ICs must be unique across all teams.` },
        { status: 400 }
      );
    }

    // Insert new team
    const { data, error } = await supabase.from("teams").insert([
      {
        teamName,
        teacherEmail,
        teacherIC,
        teacherGender,
        teacherRace,
        teamMembers,
        registrationStatus: "Pending",
        ...rest,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, team: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: `Submission failed: ${error.message}` }, { status: 500 });
  }
}