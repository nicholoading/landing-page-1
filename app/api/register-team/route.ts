// @ts-nocheck

import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, teacherEmail, teamMembers, ...rest } = body;

    // Check if team already exists
    const { data: existingTeam } = await supabase
      .from("teams")
      .select("id")
      .eq("team_name", teamName)
      .single();

    if (existingTeam) {
      return NextResponse.json({ error: "Team name already exists" }, { status: 400 });
    }

    // Insert team data (without passwords)
    const { data, error } = await supabase.from("teams").insert([
      {
        teamName: teamName,
        teacherEmail: teacherEmail,
        teamMembers: teamMembers, // Save team member details
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
