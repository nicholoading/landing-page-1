import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const teams = [
  { name: "Team Alpha", category: "Senior-Scratch", teacher: "Dr. Sarah Chen", status: "Registered" },
  { name: "Binary Bandits", category: "Senior-HTML", teacher: "Prof. James Wilson", status: "Pending" },
  { name: "Code Crushers", category: "Senior-Scratch", teacher: "Dr. Michael Rodriguez", status: "Registered" },
]

export default function Teams() {
  return (
    <section id="teams" className="py-24">
      <div className="container mx-auto px-4 md:w-4/5 lg:w-3/4">
        <h2 className="text-3xl font-bold mb-2">Registered Teams</h2>
        <p className="text-gray-600 mb-6">
          Registered teams can log into their dashboard. Pending teams, please wait for approval.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.name}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.category}</TableCell>
                  <TableCell>{team.teacher}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        team.status === "Registered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {team.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}

