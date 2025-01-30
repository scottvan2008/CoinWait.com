import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface StatsProps {
  stats: {
    label: string
    value: string | number
  }[]
}

export function StatsTable({ stats }: StatsProps) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableBody>
          {stats.map((stat, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{stat.label}</TableCell>
              <TableCell className="text-right">{stat.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

