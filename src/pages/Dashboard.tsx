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
import {
  useReadActivities,
  useReadStudios,
  useReadStudiosBookings,
  useReadUsers,
} from "../hooks/use-users";
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
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data } = useReadUsers();
  const { studios } = useReadStudios();
  const { bookings } = useReadStudiosBookings();
  const { activities } = useReadActivities();

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
      icon: <Building2 className="w-6 h-6 " color={"#8c0707"} />,
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
      icon: <DollarSign className="w-6 h-6 " color={"#8c0707"} />,
      trend: { value: 23.1, isPositive: true },
      description: "Revenue recorded this month",
    },
    {
      title: "Bookings",
      value: data ? parseInt(bookings?.length).toLocaleString() : "0",
      icon: <Calendar className="w-6 h-6 " color={"#8c0707"} />,
      trend: { value: 5.4, isPositive: false },
      description: "Completed bookings",
    },
  ];

  const processedData = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

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
        avgBookingValue:
          bookingCount > 0 ? Math.round(totalRevenue / bookingCount) : 0,
      };
    });

    // Sort by date
    return _.sortBy(monthlyData, (item) => new Date(item.month + " 1"));
  }, [bookings]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = _.sumBy(processedData, "revenue");
  const avgMonthlyRevenue =
    processedData.length > 0
      ? Math.round(totalRevenue / processedData.length)
      : 0;

  // Fixed CustomTooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white text-[14px] backdrop-blur-sm p-4 border border-gray-300 rounded shadow-lg">
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

  const navigate = useNavigate();

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
          <Button
            variant="outline"
            className="border-border opacity-35 font-[300]"
          >
            Viewing cross-section Data
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

            {/* Chart */}
            <div className="min-h-64 py-4 bg-muted/20 rounded-lg flex items-center justify-center border border-border">
              {processedData.length > 0 ? (
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
                      stroke="gray"
                      strokeWidth={1}
                      dot={{ fill: "#8c0707", strokeWidth: 1, r: 6 }}
                      activeDot={{ r: 8, stroke: "#8c0707", strokeWidth: 1 }}
                      name="Monthly Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500">
                  <p>No booking data available</p>
                </div>
              )}
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
              {activities?.slice(0, 5)?.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="w-2 h-2 bg-[#8c0707] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {moment(activity?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 text-[#8c0707] hover:bg-[#8c0707]/20"
              onClick={() => {
                navigate("/activities");
              }}
            >
              View All Activities
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ bookings }) => {
  const processedData = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

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
        avgBookingValue:
          bookingCount > 0 ? Math.round(totalRevenue / bookingCount) : 0,
      };
    });

    // Sort by date
    return _.sortBy(monthlyData, (item) => new Date(item.month + " 1"));
  }, [bookings]);

  return (
    <div className="w-full p-6 bg-gradient-card shadow-card border rounded-md border-gray-100 min-h">
      <div className="max-w-6xl mx-auto">
        {/* Bar Chart for Bookings Count */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Booking Count
          </h2>
          {processedData.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No booking data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
