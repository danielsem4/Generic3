"use client"
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

import React from "react";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Users, Database, Calendar, FileText, Eye } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";




export default function Home() {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const { users, fetchUsers } = useUserStore();

        console.log(users); 



    useEffect(() => {
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchUsers("defaultClinicId", "defaultUserId"); 
    } catch {
      setError("Error loading users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  loadUsers();
}, [fetchUsers]);

    const menuItems = undefined;

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
>        <SiteHeader onToggleSidebar={() => setSidebarOpen(prev => !prev)} />  
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
     <h2 className="text-3xl font-bold">
      {new Set(users.map((u) => u.clinicId)).size}
      </h2>
     </div>
     </div>

    {/* Modules Card */}
     <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
     <FileText size={24} />
     <p className="text-sm font-medium opacity-80">Modules</p>
     <h2 className="text-3xl font-bold">
     {users.reduce((acc, user) => acc + (user.modules?.length || 0), 0)}
     </h2>
     </div>

     {/* Appointments Card */}
      <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
      <Calendar size={24} />
      <p className="text-sm font-medium opacity-80">Appointments</p>
      <div className="flex justify-between items-end">
      <h2 className="text-4xl font-bold">
      {users.reduce((acc, user) => acc + (user.groups?.length || 0), 0)}
      </h2>
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

         {loading && <p>Loading...</p>}
         {error && <p className="text-red-500">{error}</p>}
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
                {Array.isArray(users) && users.length > 0 ? (
                users.slice(0, 5).map((user) => (
              <TableRow key={user.id}>
             <TableCell className="font-medium">{user.firstName}</TableCell>
             <TableCell className="font-medium">{user.lastName}</TableCell>
             <TableCell className="font-medium">{user.email}</TableCell>
             <TableCell className="font-medium">{user.phoneNumber ?? "—"}</TableCell>
             <TableCell className="font-medium">{user.isDoctor ? 'Doctor' : user.isClinicManager ? 'Administrator' : 'User'}</TableCell>
             <TableCell>
                <div className="flex justify-end">
                  <button
                    onClick={() => {}}
                    className="inline-flex items-center justify-center rounded-md border border-border p-2
                       text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    aria-label="View patient">
                    <Eye size={16} />
                  </button>
                </div>
              </TableCell>
             </TableRow>
              ))
              ) : (
             <TableRow>
             <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
              No user profile data available.
             </TableCell>
             </TableRow>
      )}
    </TableBody>
        </Table>
        </CardContent>
       <CardFooter className="border-t border-border bg-muted/20 pt-4">
    <p className="text-xs text-muted-foreground">
       Showing {Array.isArray(users) ? users.length : 0} of {Array.isArray(users) ? users.length : 0} total entries.          
    </p>
  </CardFooter>
</Card>

</div>
</SidebarInset>
</SidebarProvider>   
    );
  }






