import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Search, Filter, Star, MapPin, DollarSign, Eye } from "lucide-react";
import {
  useReadStudios,
  useReadStudiosBookings,
  useReadStudiosOwner,
  useReadStudiosRevenue,
} from "../hooks/use-users";

export default function Studios() {
  const { studios } = useReadStudios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fix: Provide fallback empty array to prevent undefined error
  const filteredStudios = (studios || []).filter((studio) => {
    const matchesSearch =
      studio.studioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.studioAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || studio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
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
            Studio Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage platform studios
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-border">
            Export Data
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            Review Pending
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search studios by name, location, or owner..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                Suspended
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              List
            </Button>
          </div>
        </div>
      </Card>

      {/* Studios Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Studios ({filteredStudios.length})
          </h3>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudios.map((studio) => (
              <Card
                key={studio.id}
                className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      studio.studioImages?.[0] ||
                      "https://res.cloudinary.com/dv4dlmp4e/image/upload/v1752769508/insigna_jqo7m2.png"
                    }
                    alt={studio.studioName || "Studio"}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(!studio.block ? "active" : "blocked")}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1">
                    <div className="flex items-center space-x-1 text-white text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{studio.studioRate || 0}</span>
                      <span>({studio.studioRating?.length || 0})</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">
                    {studio.studioName}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2 flex gap-2">
                    by <ReadUser id={studio?.accountHolderID} />
                  </p>

                  <div className="flex items-center text-[14px] text-muted-foreground mb-3">
                    <MapPin className="w-6 h-6 mr-1" />
                    <p className="w-[250px] text-[12px] tracking-wider ">
                      {studio.studioAddress}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-[14px]">
                        {studio.studioPrice?.toLocaleString() || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /day
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-[14px]">
                        {studio.studioPriceDaily?.toLocaleString() || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">/hr</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {studio.history?.length || 0} bookings
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-sm flex gap-2">
                      <span className="text-muted-foreground">Revenue: </span>
                      <span className="font-semibold text-foreground flex">
                        ₦<ReadStudioRevenue id={studio?._id} />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <div className="space-y-4">
                {filteredStudios.map((studio) => (
                  <div
                    key={studio.id}
                    className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={
                        studio.studioImages?.[0] ||
                        "https://res.cloudinary.com/dv4dlmp4e/image/upload/v1752769508/insigna_jqo7m2.png"
                      }
                      alt={studio.studioName || "Studio"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {studio.studioName}
                        </h4>
                        {getStatusBadge(!studio.block ? "active" : "blocked")}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by <ReadUser id={studio?.accountHolderID} />
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {studio.studioAddress}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {studio.studioRate || 0}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({studio.studioRating?.length || 0})
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {studio.history?.length || 0} bookings
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ₦{studio.studioPriceDaily?.toLocaleString() || 0}/hr
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ₦<ReadStudioRevenue id={studio?._id} /> total
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

const ReadUser = ({ id }) => {
  const { user } = useReadStudiosOwner(id);

  return (
    <div className="font-[600]">
      {user?.firstName} {user?.lastName}
    </div>
  );
};

const ReadStudioRevenue = ({ id }) => {
  const { studioRevenue } = useReadStudiosRevenue(id);

  return (
    <div className="font-[600]">
      {studioRevenue?.history?.length > 0
        ? studioRevenue.history
            .map((el) => el?.cost || 0)
            .reduce((a, b) => a + b, 0)
            .toLocaleString()
        : 0}
    </div>
  );
};
