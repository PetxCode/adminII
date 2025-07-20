import { StatsCard } from "../components/dashboard/StatsCard";
import { Card } from "../components/ui/card";
// import { Button } from "./components/ui/button";
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useReadStudios, useReadStudiosBookings, useReadUsers } from "../hooks/use-users";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import _ from "lodash";
import React from "react";



export default function Dashboard() {
  const { data } = useReadUsers();
  const { studios } = useReadStudios();
  const { bookings } = useReadStudiosBookings();

  const mockStats = [
    {
      title: "Total Users",
      value: data ? parseInt(data.length).toLocaleString() : "0",
      icon: <Users className="w-6 h-6 " color={"#8c0707"} />,
      trend: { value: 8.2, isPositive: true },
      description: "Total users recorded this month",
    },
    {
      title: "Studios Listed",
      value: data
        ? parseInt(
            data
              .map((el) => {
                return el?.studio;
              })
              ?.flat()?.length
          ).toLocaleString()
        : "0",
      icon: <Building2 className="w-6 h-6 " color={"#8c0707"}  />,
      trend: { value: 15.3, isPositive: true },
      description: "Studios available for booking",
    },
    {
      title: "Total Revenue",
      value: data
        ? parseInt(
            bookings?.map((el) => el?.cost).reduce((acc, curr) => acc + curr, 0)
          ).toLocaleString()
        : "0",
      icon: <DollarSign className="w-6 h-6 " color={"#8c0707"}  />,
      trend: { value: 23.1, isPositive: true },
      description: "Revenue recorded this month",
    },
    {
      title: "Bookings",
      value: data ? parseInt(bookings?.length).toLocaleString() : "0",
      icon: <Calendar className="w-6 h-6 " color={"#8c0707"}  />,
      trend: { value: 5.4, isPositive: false },
      description: "Completed bookings",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_signup",
      message: "New user John Doe signed up",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "studio_listed",
      message: "Creative Studio X listed a new space",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "booking_completed",
      message: "Booking #1247 completed successfully",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "payment_received",
      message: "Payment of $450 received for Studio Y",
      time: "2 hours ago",
    },
  ];


  const processedData = React.useMemo(() => {
 
    const groupedByMonth = _.groupBy(bookings, (item) => {
      const date = new Date(item.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    // Calculate monthly totals
    const monthlyData = _.map(groupedByMonth, (bookings, monthKey) => {
      const totalRevenue = _.sumBy(bookings, "cost");
      const bookingCount = bookings.length;
      const [year, month] = monthKey.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1
      ).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthName,
        revenue: totalRevenue,
        bookings: bookingCount,
        avgBookingValue: Math.round(totalRevenue / bookingCount),
      };
    });

    // Sort by date
    return _.sortBy(monthlyData, (item) => new Date(item.month + " 1"));
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };


  const totalRevenue = _.sumBy(processedData, "revenue");
  const avgMonthlyRevenue = Math.round(totalRevenue / processedData.length);

  
  const CustomTooltip = ({ active=true, payload=[], label=[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload!;
      return (
        <div className="bg-whitetext-[14px] backdrop-blur-sm p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-gray-700">
            Revenue:{" "}
            <span className="font-bold">{formatCurrency(data.revenue)}</span>
          </p>
          <p className="text-gray-700">
            Bookings: <span className="font-bold">{data.bookings}</span>
          </p>
          <p className="text-gray-700">
            Avg per Booking:{" "}
            <span className="font-bold">
              {formatCurrency(data.avgBookingValue)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-black mt-1">
            Welcome back! Here's what's happening with PickAStudio
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-border">
            Export Data
          </Button>
          <Button className="bg-[#8c0707] hover:bg-primary-hover">
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>

      {/* Revenue Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Revenue Chart */}
        <div className="">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Revenue Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly revenue trends
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="!p-2 py-4 h-[58px]"
              >
                Avg. Month Revenue
                <br />
                {formatCurrency(avgMonthlyRevenue)}
              </Button>
            </div>

            {/* Placeholder for chart */}
            <div className="min-h-64 py-4 bg-muted/20 rounded-lg flex items-center justify-center border border-border">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={processedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0fe" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `₦${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82"
                    strokeWidth={3}
                    dot={{ fill: "#8c0707", strokeWidth: 1, r: 6 }}
                    activeDot={{ r: 8, stroke: "8c0707", strokeWidth: 1 }}
                    name="Monthly Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Recent Activities */}
        <div className="flex-1 lg:col-span-3">
          <SummaryCard bookings={bookings} />
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Activities
            </h3>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="w-2 h-2 bg-[#8c0707] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 text-[#8c0707] hover:bg-primary/10"
            >
              View All Activities
            </Button>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border"
          >
            <Users className="w-6 h-6" />
            <span>Manage Users</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border"
          >
            <Building2 className="w-6 h-6" />
            <span>Review Studios</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border"
          >
            <CreditCard className="w-6 h-6" />
            <span>Process Payments</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="!text-[#8c0707]! ">View Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}


const SummaryCard = ({ bookings }) => {

  const processedData = React.useMemo(() => {
    // Group by month-year
    const groupedByMonth = _.groupBy(bookings, (item) => {
      const date = new Date(item.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    // Calculate monthly totals
    const monthlyData = _.map(groupedByMonth, (bookings, monthKey) => {
      const totalRevenue = _.sumBy(bookings, "cost");
      const bookingCount = bookings.length;
      const [year, month] = monthKey.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1
      ).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthName,
        revenue: totalRevenue,
        bookings: bookingCount,
        avgBookingValue: Math.round(totalRevenue / bookingCount),
      };
    });

    // Sort by date
    return _.sortBy(monthlyData, (item) => new Date(item.month + " 1"));
  }, []);


  return (
    <div className="w-full p-6 bg-gradient-card shadow-card border rounded-md border-gray-100 min-h">
      <div className="max-w-6xl mx-auto">
        {/* Line Chart */}
        

        {/* Bar Chart for Bookings Count */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Booking Count
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                formatter={(value, name) => [value, "Bookings"]}
                labelStyle={{ color: "#374151" }}
              />
              <Bar
                dataKey="bookings"
                fill="#8c0707"
                radius={[4, 4, 0, 0]}
                name="Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};