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

const mockActivities = [
  {
    id: 1,
    type: "user_signup",
    title: "New User Registration",
    description: "John Doe created a new account",
    details: "Email: john.doe@example.com, Location: New York",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    userId: "user_123",
    metadata: { email: "john.doe@example.com", location: "New York" },
  },
  {
    id: 2,
    type: "studio_listed",
    title: "Studio Listed",
    description: "Creative Studio X was listed by Sarah Wilson",
    details:
      "Studio: Creative Studio X, Owner: Sarah Wilson, Location: Los Angeles",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    studioId: "studio_456",
    metadata: { studioName: "Creative Studio X", owner: "Sarah Wilson" },
  },
  {
    id: 3,
    type: "booking_completed",
    title: "Booking Completed",
    description: "Booking #1247 was successfully completed",
    details: "Studio: Downtown Studio, Duration: 4 hours, Amount: $320",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    bookingId: "booking_1247",
    metadata: { amount: 320, duration: 4, studioName: "Downtown Studio" },
  },
  {
    id: 4,
    type: "payment_received",
    title: "Payment Received",
    description: "Payment of $450 received for Studio Y",
    details: "Payment ID: pay_789, Studio: Studio Y, Fee: $45",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    paymentId: "pay_789",
    metadata: { amount: 450, fee: 45, studioName: "Studio Y" },
  },
  {
    id: 5,
    type: "user_banned",
    title: "User Account Suspended",
    description: "User account mike.johnson@example.com was suspended",
    details: "Reason: Multiple policy violations, Suspended by: Admin",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    userId: "user_789",
    metadata: { reason: "Multiple policy violations", adminId: "admin_001" },
  },
  {
    id: 6,
    type: "payment_failed",
    title: "Payment Failed",
    description: "Payment attempt failed for booking #1248",
    details: "Reason: Insufficient funds, Booking: Music Studio Pro",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    paymentId: "pay_failed_123",
    metadata: { reason: "Insufficient funds", bookingId: "booking_1248" },
  },
  {
    id: 7,
    type: "studio_banned",
    title: "Studio Suspended",
    description: "Studio 'Shady Recordings' was suspended",
    details: "Reason: Quality violations, Suspended by: Admin",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    studioId: "studio_999",
    metadata: { reason: "Quality violations", adminId: "admin_001" },
  },
  {
    id: 8,
    type: "booking_cancelled",
    title: "Booking Cancelled",
    description: "Booking #1246 was cancelled by user",
    details: "Studio: Rhythm Studios, Refund: $240, Reason: Schedule conflict",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    bookingId: "booking_1246",
    metadata: { refund: 240, reason: "Schedule conflict" },
  },
  {
    id: 9,
    type: "system_update",
    title: "System Maintenance",
    description: "Platform maintenance completed successfully",
    details:
      "Duration: 2 hours, Services updated: Payment gateway, Search engine",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    metadata: { duration: 2, services: ["Payment gateway", "Search engine"] },
  },
  {
    id: 10,
    type: "login",
    title: "Admin Login",
    description: "Administrator logged into the system",
    details: "Admin: admin@example.com, IP: 192.168.1.1",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
    adminId: "admin_001",
    metadata: { ip: "192.168.1.1", userAgent: "Chrome 120.0" },
  },
];

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || activity.type === selectedType;

    let matchesTimeframe = true;
    if (selectedTimeframe !== "all") {
      const now = new Date();
      const activityTime = activity.timestamp;
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

  const getActivityTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      user_signup: "bg-success/10 text-success border-success/20",
      user_banned: "bg-destructive/10 text-destructive border-destructive/20",
      studio_listed: "bg-primary/10 text-primary border-primary/20",
      studio_banned: "bg-destructive/10 text-destructive border-destructive/20",
      booking_completed: "bg-success/10 text-success border-success/20",
      booking_cancelled: "bg-warning/10 text-warning border-warning/20",
      payment_received: "bg-success/10 text-success border-success/20",
      payment_failed:
        "bg-destructive/10 text-destructive border-destructive/20",
      system_update: "bg-muted text-muted-foreground border-border",
      login: "bg-primary/10 text-primary border-primary/20",
    };

    return variants[type] || "bg-muted text-muted-foreground border-border";
  };

  const activityTypeCounts = mockActivities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
                {mockActivities.length}
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
                {
                  mockActivities.filter(
                    (a) =>
                      new Date().getTime() - a.timestamp.getTime() <=
                      24 * 60 * 60 * 1000
                  ).length
                }
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
                {
                  mockActivities.filter(
                    (a) =>
                      a.type.includes("banned") || a.type.includes("failed")
                  ).length
                }
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
                {mockActivities.filter((a) => a.type.includes("user")).length}
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
            Recent Activities ({filteredActivities.length})
          </h3>

          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const IconComponent =
                activityIcons[activity.type as keyof typeof activityIcons] ||
                AlertCircle;
              const iconColor =
                activityColors[activity.type as keyof typeof activityColors] ||
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
                          {activity.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          className={`${getActivityTypeBadge(
                            activity.type
                          )} text-xs`}
                        >
                          {activity.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {activity.details}
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

                      <span>{activity.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
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
