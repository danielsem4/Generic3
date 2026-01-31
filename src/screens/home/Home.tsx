import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHomeData } from "./use_home";

export default function Home() {
    const { data, isLoading, error } = useHomeData();
    if (isLoading) return <div>Loading data...</div>;

    if (error) return <div>Error loading data</div>;
    return (
     <div className="min-h-screen flex items-center justify-start p-4 bg-background">
     <div className="w-full max-w-6xl flex flex-col gap-6">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm">
     <p className="text-sm font-medium opacity-80">Patients</p>
     <h2 className="text-3xl font-bold"> {Array.isArray(data) ? data.length : (data ? Object.keys(data).length : 0)}</h2>  
     </div>
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm">
     <p className="text-sm font-medium opacity-80">Clinics</p>
     <h2 className="text-3xl font-bold">{data?.clinicId || 12}</h2>
     </div>
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm">
     <p className="text-sm font-medium opacity-80">Modules</p>
     <h2 className="text-3xl font-bold">{data?.modules?.length || 5}</h2>
     </div>
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm">
     <p className="text-sm font-medium opacity-80">Appointments</p>
     <h2 className="text-3xl font-bold">{data?.groups?.length || 0}</h2> 
     </div>
     </div>
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardDescription>
            Latest users
          </CardDescription>
          </CardHeader>
        <CardContent>
         <Table>
             <TableCaption>Updated just now.</TableCaption>
               <TableHeader>
                <TableRow className="bg-muted/50">
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clinic Name</TableHead>
             </TableRow>
              </TableHeader>
              <TableBody>
              {data ? (
              <TableRow>
          <TableCell className="font-medium">
            {data.firstName} {data.lastName}
          </TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell>{data.username}</TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          data.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
          {data.isActive ? 'Active' : 'Inactive'}
        </span>
            </TableCell>
            <TableCell>{data.clinicName}</TableCell>
      </TableRow>
      ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        Loading user data...
      </TableCell>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
        No user profile data available.
      </TableCell>
       </TableRow>
        )}
        </TableBody>
        </Table>
        </CardContent>
  <CardFooter className="border-t bg-muted/10 pt-4">
    <p className="text-xs text-muted-foreground">
       Showing {Array.isArray(data) ? data.length : 0} of {Array.isArray(data) ? data.length : 0} total entries.          
    </p>
  </CardFooter>
</Card>

</div>
</div>
    );
}
