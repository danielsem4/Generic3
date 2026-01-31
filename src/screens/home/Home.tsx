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
import { ArrowRight } from "lucide-react";

export default function Home() {
    const { data, isLoading, error } = useHomeData();
    if (isLoading) return <div>Loading data...</div>;

    if (error) return <div>Error loading data</div>;
    return (
    <div className="min-h-screen p-8 bg-slate-50">
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Patients Card */}
    <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px] group cursor-pointer hover:bg-blue-600 transition-all">
     <p className="text-sm font-medium opacity-80">Patients</p>
     <div className="flex justify-between items-end">
     <h2 className="text-3xl font-bold">{data ? (Array.isArray(data) ? data.length : 0) : 0}</h2>     
     <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
     </div>
     </div>
    {/* Clinics Card */}
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px] group cursor-pointer hover:bg-blue-600 transition-all">     
     <p className="text-sm font-medium opacity-80">Clinics</p> 
     <div className="flex justify-between items-end"> 
     <h2 className="text-3xl font-bold">{data?.clinicId}</h2>
     <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
     </div>
     </div>
    {/* Modules Card */}
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px] group cursor-pointer hover:bg-blue-600 transition-all">
     <p className="text-sm font-medium opacity-80">Modules</p>
     <h2 className="text-3xl font-bold">{data?.modules?.length}</h2>
     <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
     </div>
     {/* Appointments Card */}
     <div className="bg-blue-500 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px] group cursor-pointer hover:bg-blue-600 transition-all">
          <p className="text-sm font-medium opacity-80">Appointments</p>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-bold">{data?.groups?.length}</h2>
            <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
    </div>
    </div>

        <Card className="w-full max-w-7xl shadow-lg border-none">
          <CardHeader className="pb-4">
            <CardDescription className="text-3xl font-bold text-slate-800">
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
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
             </TableRow>
              </TableHeader>
              <TableBody>
              {data ? (
            <TableRow className="hover:bg-slate-50/50 transition-colors">
            {/* Name */}
            <TableCell className="font-medium">
            {data.firstName} {data.lastName}
            </TableCell>
            {/* Email */}
            <TableCell>{data.email}</TableCell>
            <TableCell>
            {/* Role */}
            {data.isDoctor ? 'Senior Doctor' : data.isClinicManager ? 'Administrator' : ''}
            </TableCell>          
            <TableCell>
            {/* Status */}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            data.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
          {data.isActive ? 'Active' : 'Inactive'}
        </span>
            </TableCell>
            {/* Department */}
            <TableCell>{data.clinicName}</TableCell>
            <TableCell>
            {/* Join Date */}
            {data.dateJoined ? new Date(data.dateJoined).toLocaleDateString('en-GB') : ''}
          </TableCell>
          <TableCell className="text-slate-500 text-xs">
            {/* Last Login*/}
          {data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'N/A'}
          </TableCell>
          <TableCell className="text-right font-bold text-slate-400 cursor-pointer">
        ...
      </TableCell>
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
    );
}
