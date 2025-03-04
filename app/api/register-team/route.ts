// @ts-nocheck
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, teacherEmail, teacherIC, teamMembers, ...rest } = body;

    if (!teamName || !teacherEmail || !teacherIC || !teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Extract parentEmails and ICs from the new team members
    const newParentEmails = teamMembers.map((member) => member.parentEmail);
    const newICs = teamMembers.map((member) => member.ic);

    // Check for duplicate parentEmails or ICs within the same team
    const uniqueParentEmails = new Set(newParentEmails);
    const uniqueICs = new Set(newICs);

    if (uniqueParentEmails.size !== newParentEmails.length || uniqueICs.size !== newICs.length) {
      return NextResponse.json({ error: "Duplicate parent email or IC found within the same team." }, { status: 400 });
    }

    // Ensure no parentEmail or IC matches the teacher's email or IC
    if (newParentEmails.includes(teacherEmail) || newICs.includes(teacherIC)) {
      return NextResponse.json({ error: "A parent email or IC cannot be the same as the teacher's." }, { status: 400 });
    }

    // Check for duplicate parentEmails and ICs across all teams
    const { data: existingTeams, error: fetchError } = await supabase
      .from("teams")
      .select("teacherEmail, teacherIC, teamMembers")
      .not("teamMembers", "is", null);

    if (fetchError) {
      throw new Error("Error checking existing parent emails and ICs.");
    }

    // Extract all existing parentEmails and ICs
    const existingParentEmails = new Set(
      existingTeams.flatMap((team) => team.teamMembers.map((member) => member.parentEmail))
    );

    const existingICs = new Set(
      existingTeams.flatMap((team) => team.teamMembers.map((member) => member.ic))
    );

    // Also check against existing teacher emails and ICs
    existingTeams.forEach((team) => {
      existingParentEmails.add(team.teacherEmail);
      existingICs.add(team.teacherIC);
    });

    // Check if any new parentEmails or ICs exist in other teams
    const duplicateEmails = newParentEmails.filter((email) => existingParentEmails.has(email));
    const duplicateICs = newICs.filter((ic) => existingICs.has(ic));

    if (duplicateEmails.length > 0 || duplicateICs.length > 0) {
      return NextResponse.json(
        {
          error: `Duplicate entries found across teams: ${duplicateEmails.length > 0 ? `Parent Emails: ${duplicateEmails.join(", ")}` : ""} ${duplicateICs.length > 0 ? `ICs: ${duplicateICs.join(", ")}` : ""}`.trim(),
        },
        { status: 400 }
      );
    }

    // If no duplicates, insert the new team
    const { data, error } = await supabase.from("teams").insert([
      {
        teamName,
        teacherEmail,
        teacherIC,
        teamMembers,
        registrationStatus: "Pending",
        ...rest,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, team: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
