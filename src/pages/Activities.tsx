import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  Settings,
  AlertCircle,
  UserCheck,
  UserX,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { useReadActivities } from "../hooks/use-users";

const activityIcons = {
  user_signup: UserCheck,
  user_banned: UserX,
  studio_listed: Building2,
  studio_banned: XCircle,
  booking_completed: CheckCircle,
  booking_cancelled: XCircle,
  payment_received: DollarSign,
  payment_failed: AlertCircle,
  system_update: Settings,
  login: Users,
};

const activityColors = {
  user_signup: "text-success",
  user_banned: "text-destructive",
  studio_listed: "text-primary",
  studio_banned: "text-destructive",
  booking_completed: "text-success",
  booking_cancelled: "text-warning",
  payment_received: "text-success",
  payment_failed: "text-destructive",
  system_update: "text-muted-foreground",
  login: "text-primary",
};

const getRelativeTime = (date: Date | string | number) => {
  const now = new Date();
  const targetDate = new Date(date); // Convert to Date object
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function Activities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  const { activities } = useReadActivities();

  const filteredActivities = activities?.filter((activity: any) => {
    const matchesSearch =
      activity?.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.actionDetail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || activity.type === selectedType;

    let matchesTimeframe = true;
    if (selectedTimeframe !== "all") {
      const now = new Date();
      const activityTime = new Date(activity.createdAt || activity.timestamp); // Handle both field names
      const diffInHours =
        (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);

      switch (selectedTimeframe) {
        case "1h":
          matchesTimeframe = diffInHours <= 1;
          break;
        case "24h":
          matchesTimeframe = diffInHours <= 24;
          break;
        case "7d":
          matchesTimeframe = diffInHours <= 168;
          break;
        case "30d":
          matchesTimeframe = diffInHours <= 720;
          break;
      }
    }

    return matchesSearch && matchesType && matchesTimeframe;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Monitor all platform activities and system events
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredActivities?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last 24 Hours</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredActivities?.filter(
                  (a: any) =>
                    new Date().getTime() -
                      new Date(a.createdAt || a.timestamp).getTime() <=
                    24 * 60 * 60 * 1000
                )?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Events</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredActivities?.filter(
                  (a: any) =>
                    a.type?.includes("banned") || a.type?.includes("failed")
                )?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User Activities</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredActivities?.filter((a: any) =>
                  a.type?.includes("user")
                )?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user_signup">User Signups</SelectItem>
              <SelectItem value="user_banned">User Bans</SelectItem>
              <SelectItem value="studio_listed">Studio Listings</SelectItem>
              <SelectItem value="studio_banned">Studio Bans</SelectItem>
              <SelectItem value="booking_completed">Bookings</SelectItem>
              <SelectItem value="payment_received">Payments</SelectItem>
              <SelectItem value="system_update">System</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Activities List */}
      <Card className="bg-gradient-card shadow-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Activities ({filteredActivities?.length || 0})
          </h3>

          <div className="space-y-4">
            {filteredActivities?.map((activity: any) => {
              const IconComponent =
                activityIcons[activity?.type as keyof typeof activityIcons] ||
                AlertCircle;
              const iconColor =
                activityColors[activity?.type as keyof typeof activityColors] ||
                "text-muted-foreground";

              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-background ${iconColor}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {activity.action}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.actionDetail}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          className={`${
                            activity?.actionType === "Account Verification"
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : activity?.actionType ===
                                "user signup using Email Provider"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : activity?.actionType ===
                                "user signup using Email Provider"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : activity?.actionType === "Studio Booking"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : activity?.actionType === "Studio Listing"
                              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                              : activity?.actionType === "Withdrawer Request"
                              ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
                              : activity?.actionType ===
                                "Withdrawer Request Status"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : ""
                          } text-xs`}
                        >
                          {activity?.actionType}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getRelativeTime(
                            activity.createdAt || activity.timestamp
                          )}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {activity.actionInfo}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        {activity.userId && (
                          <span>User ID: {activity.userId}</span>
                        )}
                        {activity.studioId && (
                          <span>Studio ID: {activity.studioId}</span>
                        )}
                        {activity.bookingId && (
                          <span>Booking ID: {activity.bookingId}</span>
                        )}
                        {activity.paymentId && (
                          <span>Payment ID: {activity.paymentId}</span>
                        )}
                      </div>

                      <span>
                        {new Date(
                          activity.createdAt || activity.timestamp
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {(!filteredActivities || filteredActivities?.length === 0) && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Activities Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
