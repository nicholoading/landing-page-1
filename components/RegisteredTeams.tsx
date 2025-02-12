import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const teams = [
  { name: "Bug Busters", members: 4, status: "Registered" },
  { name: "Code Ninjas", members: 3, status: "Pending" },
  { name: "Syntax Errors", members: 5, status: "Registered" },
  { name: "Binary Beasts", members: 4, status: "Registered" },
  { name: "Quantum Coders", members: 3, status: "Pending" },
]

export default function RegisteredTeams() {
  return (
    <section className="py-16 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Registered Teams</h2>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Team Name</TableHead>
              <TableHead className="text-white">Members</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.members}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      team.status === "Registered" ? "bg-green-500" : "bg-yellow-500"
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
    </section>
  )
}

