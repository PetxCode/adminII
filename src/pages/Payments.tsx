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
import { Search, Filter, MoreHorizontal, Check, X, Eye } from "lucide-react";
import { useReadStudiosPayout, useReadUsers } from "../hooks/use-users";
import { getStudiosRequestStatus } from "../api/usersAPI";
import Pagination from "../lib/pagination";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data } = useReadUsers();
  const { payout, mutate } = useReadStudiosPayout();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Ensure payout is an array before filtering
  const safePayoutData = Array.isArray(payout) ? payout : [];

  const filteredPayments = safePayoutData.filter((payment) => {
    const matchesSearch =
      payment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.studioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.requestID?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-warning/10 text-warning border-warning/20",
      approved: "bg-success/10 text-success border-success/20",
      approve: "bg-success/10 text-success border-success/20",
      paid: "bg-primary/10 text-primary border-primary/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
      reject: "bg-destructive/10 text-destructive border-destructive/20",
    } as const;

    return (
      <Badge
        className={
          colors[status as keyof typeof colors] ||
          "bg-secondary/10 text-secondary border-secondary/20"
        }
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const totalPendingAmount = filteredPayments.filter(
    (p) => p.status === "pending"
  ).length;

  const handleStatusUpdate = async (paymentId: string, status: string) => {
    try {
      console.log(`Updating payout: ${paymentId} to status: ${status}`);

      const result = await getStudiosRequestStatus(paymentId, status);
      console.log("Update result:", result);

      if (result && !result.error) {
        // Use the correct SWR key
        mutate("/view-studio-payout");
      } else {
        console.error("Update failed:", result);
      }
    } catch (error) {
      console.error("Error updating payout:", error);
    }
  };

  const totalPages = Math.ceil(safePayoutData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-115px)] flex flex-col ">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and approve platform payments
          </p>
        </div>

        <Button className="bg-[#8c0707] hover:bg-[#8c0707]/50 transition-all duration-300">
          Export Transactions
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-foreground">
                {totalPendingAmount}
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <MoreHorizontal className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Platform Fees
              </p>
              <p className="text-2xl font-bold text-foreground">
                ₦{(filteredPayments.length * 500).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Check className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-foreground">
                {filteredPayments.length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <Eye className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by payment ID, user, or studio..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approve")}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("reject")}>
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="bg-gradient-card shadow-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Payments ({currentItems?.length})
          </h3>

          {currentItems?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Payment ID</TableHead>
                    <TableHead>User / Studio</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((payment) => (
                    <TableRow
                      key={payment._id}
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {payment.requestID}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {payment.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.studioName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            ₦
                            {(
                              parseInt(payment.request || "0") - 500
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Studio: ₦
                            {parseInt(payment.request || "0").toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₦500</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {payment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:bg-success/10"
                                onClick={() =>
                                  handleStatusUpdate(payment._id, "approve")
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() =>
                                  handleStatusUpdate(payment._id, "reject")
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}

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
                              {payment.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    className="text-success"
                                    onClick={() =>
                                      handleStatusUpdate(payment._id, "approve")
                                    }
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      handleStatusUpdate(payment._id, "reject")
                                    }
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Payment
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
      <div className="flex-1" />
      <div className="mt-20">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
