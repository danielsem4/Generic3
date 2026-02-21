"use client"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,} from "@/components/ui/card"
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import React, { useEffect} from "react";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Users, Database, Calendar, FileText, Eye, Settings } from "lucide-react";
import { useHomeData } from "./use_home";
import { useUserStore } from "@/store/useUserStore";
import type { IUser } from "@/common/Users";

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const { users, modules, appointments, clinicId, userId, fetchUsers, fetchModules, fetchAppointments } = useUserStore();


    useEffect(() => {
        console.log("Current Store State:", { clinicId, userId });

        if (clinicId && userId) {
            console.log("Triggering fetch requests...");
            fetchUsers();
            fetchModules();
            fetchAppointments();
        } else {
            console.warn("Fetch blocked: IDs are missing. Did you login correctly?");
        }
    }, [clinicId, userId]);

    const { data, isLoading, error } = useHomeData();


    if (isLoading) return <div>Loading data...</div>;
    if (error) return <div>Error loading data</div>;

    const menuItems = [
      {title: "Dashboard",icon: Users ,url: "/dashboard",},
      {title: "Patients",icon: Users,url: "/patients",},
      {title: "Clinics",icon: Database,url: "/clinics",},
      {title: "Appointments",icon: Calendar,url: "/appointments",},
      {title: "Modules",icon: FileText,url: "/modules",},
      {title: "Settings",icon: Settings,url: "/settings",},
];
    
    return (
      <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}    >
       <AppSidebar variant="inset" menuItems={menuItems} open={sidebarOpen} />
<SidebarInset
  className={`flex-1 transition-all duration-300 ${
    sidebarOpen ? "ml-72" : "ml-0"
  }`}
>    <SiteHeader onToggleSidebar={() => setSidebarOpen(prev => !prev)} />  
    <div className="flex-1 min-h-screen p-8 bg-background overflow-auto transition-all duration-300">
    <div className="w-full flex flex-col gap-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    {/* Patients Card */}
     <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
     <Users size={24} />
     <p className="text-sm font-medium opacity-80">Patients</p>
     <div className="flex justify-between items-end">
     <h2 className="text-3xl font-bold">{users.length}</h2>    
     </div>
     </div>

    {/* Clinics Card */}
     <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
     <Database size={24} />
     <p className="text-sm font-medium opacity-80">Clinics</p>
     <div className="flex justify-between items-end">
     <h2 className="text-3xl font-bold">{clinicId ?? 0}</h2>
     </div>
     </div>

    {/* Modules Card */}
     <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
     <FileText size={24} />
     <p className="text-sm font-medium opacity-80">Modules</p>
     <h2 className="text-3xl font-bold">{modules.length}</h2>
     </div>

     {/* Appointments Card */}
      <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
      <Calendar size={24} />
      <p className="text-sm font-medium opacity-80">Appointments</p>
      <div className="flex justify-between items-end">
      <h2 className="text-4xl font-bold">{appointments.length}</h2>
      </div>
    </div>
    </div>
    </div>
            <Card className="w-full shadow-lg border-none overflow-hidden bg-card text-card-foreground">
            <CardHeader className="pb-4 border-b border-border">
            <CardDescription className="text-2xl font-bold text-foreground">
            Latest users
          </CardDescription>
          </CardHeader>
        <CardContent className="p-0">

         <Table>
             <TableCaption>Updated just now.</TableCaption>
              <TableHeader>
              <TableRow className="bg-muted/50">
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone Number</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold text-right">View</TableHead>
              </TableRow>
              </TableHeader>

              <TableBody>
                {users && users.length > 0 ? (
                  users.slice(0, 10).map((user: IUser, index: number) => (             
            <TableRow key={user.id || index}>             
            {/* First Name */}
            <TableCell className="font-medium">{user.first_name}</TableCell>
            {/* Last Name */}
            <TableCell className="font-medium">{user.last_name}</TableCell>
            {/* Email */}
            <TableCell>{user.email}</TableCell>
            {/* Phone Number */}
            <TableCell>{user.phone_number ?? "—"}</TableCell>
            {/* Role */}
            <TableCell>{user.role}</TableCell>  
            {/* View button */}
            <TableCell>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center rounded-md border border-border p-2
                 text-muted-foreground hover:text-foreground hover:bg-muted transition"
               aria-label="View patient">
              <Eye size={16} />
              </button>
               </TableCell>
      </TableRow>
    ))
      ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        {users.length === 0 ? "No user profile data available." : "Loading user data..."}
      </TableCell>
       </TableRow>
        )}
        </TableBody>
        </Table>
        </CardContent>
       <CardFooter className="border-t border-border bg-muted/20 pt-4">
    <p className="text-xs text-muted-foreground">
       Showing {Array.isArray(data) ? data.length : 0} of {Array.isArray(data) ? data.length : 0} total entries.          
    </p>
  </CardFooter>
</Card>

</div>
</SidebarInset>
</SidebarProvider>    
);
}