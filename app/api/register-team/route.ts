// @ts-nocheck

import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, teacherEmail, teamMembers, ...rest } = body;

    // Validation: Ensure required fields are provided
    if (!teamName || !teacherEmail || !teamMembers || teamMembers.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields. Please provide team name, teacher email, and at least one team member." },
        { status: 400 }
      );
    }

    // Check if team already exists
    const { data: existingTeam, error: existingError } = await supabase
      .from("teams")
      .select("id")
      .eq("teamName", teamName) // Fixed column name from "team_name" to "teamName"
      .single();

    if (existingError && existingError.code !== "PGRST116") { // Ignore "no rows found" error
      throw existingError;
    }

    if (existingTeam) {
      return NextResponse.json({ error: "Team name already exists" }, { status: 400 });
    }

    // Insert team data (without passwords)
    const { data, error } = await supabase.from("teams").insert([
      {
        teamName,
        teacherEmail,
        teamMembers, // Save team member details
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
