import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, Ban, Eye, Edit } from "lucide-react";
import {
  useReadStudiosBookings,
  useReadStudiosRevenue,
  useReadUsers,
} from "../hooks/use-users";
import _ from "lodash";

export default function Users() {
  const { data } = useReadUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Ensure data is an array before filtering
  const safeData = Array.isArray(data) ? data : [];

  const filteredUsers = safeData.filter((user) => {
    const matchesSearch = user?.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      suspended: "destructive",
      banned: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor platform users
          </p>
        </div>

        <Button className="bg-[#8c090c] hover:bg-primary-hover">
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                Suspended
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("banned")}>
                Banned
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card shadow-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Users ({safeData.length})
          </h3>

          {safeData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">Total Made</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow
                      key={user._id}
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {user?.avatar ? (
                              <img
                                src={user?.avatar}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {user?.firstName?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user?.status || "unknown")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {user?.studio?.length || 0}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex justify-end items-center gap-2">
                          <User user={user} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="w-4 h-4 mr-2" />
                              {user?.status === "active"
                                ? "Suspend User"
                                : "Reactivate User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

const User = ({ user }: { user: any }) => {
  const { bookings } = useReadStudiosBookings();

  // Ensure bookings is an array before filtering
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const userBookings = safeBookings.filter((el) => el?.accountID === user?._id);
  const totalEarnings =
    userBookings.length > 0
      ? userBookings.map((el) => el?.cost || 0).reduce((a, b) => a + b, 0)
      : 0;

  return <div className="font-[600]">₦{totalEarnings.toLocaleString()}</div>;
};

const ReadStudioRevenue = ({ id }: { id: string }) => {
  const { studioRevenue } = useReadStudiosRevenue(id);
  const { bookings } = useReadStudiosBookings();

  // Ensure arrays are safe before filtering
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeHistory = Array.isArray(studioRevenue?.history)
    ? studioRevenue.history
    : [];

  console.log(
    safeBookings.filter(
      (el) => el?.accountID === studioRevenue?.accountHolderID
    )
  );

  const totalRevenue =
    safeHistory.length > 0
      ? safeHistory.map((el) => el?.cost || 0).reduce((a, b) => a + b, 0)
      : 0;

  return <div className="font-[600]">₦{totalRevenue.toLocaleString()}</div>;
};
