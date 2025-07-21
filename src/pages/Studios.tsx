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
import {
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Eye,
  MoreHorizontal,
  Edit,
  Ban,
  LockOpen,
} from "lucide-react";
import {
  useReadStudios,
  useReadStudiosBookings,
  useReadStudiosOwner,
  useReadStudiosRevenue,
} from "../hooks/use-users";
import Pagination from "../lib/pagination";
import { banStudio, unbanStudio } from "../api/usersAPI";

export default function Studios() {
  const { studios, mutate } = useReadStudios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredStudios = (studios || [])?.filter((studio: any) => {
    const matchesSearch =
      studio.studioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.studioAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || studio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // .slice(currentPage, itemsPerPage);

  const totalPages = Math.ceil(studios?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudios?.slice(
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
            Studio Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage platform studios
          </p>
        </div>

        <div className="flex items-center space-x-3 opacity-10">
          <Button className="bg-[#8c0707] hover:bg-[#8c0707]/80">
            Viewing studios
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
              // variant=
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-none hover:bg-transparent  ${
                viewMode === "grid"
                  ? "bg-[#8c0707] hover:bg-[#8c0707]/80"
                  : "bg-white !text-gray-800 "
              }`}
            >
              Grid
            </Button>
            <Button
              // variant={viewMode === "list" /? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-none hover:bg-transparent ${
                viewMode === "list"
                  ? "bg-[#8c0707] hover:bg-[#8c0707]/80"
                  : "bg-white !text-gray-800"
              }`}
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
            Studios ({currentItems.length})
          </h3>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((studio) => (
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
                  <div className="absolute top-3 left-3 ">
                    {/* {getStatusBadge(!studio.block ? "active" : "blocked")} */}
                    <p
                      className={`${
                        !studio.block ? "bg-[#8c0707]" : "bg-orange-400"
                      } 

                      ${
                        studio.ban && studio.block
                          ? "bg-red-500"
                          : studio.block && !studio.ban
                          ? "bg-orange-400"
                          : "bg-[#8c0707]"
                      }
                      
                      text-white rounded-full px-4 capitalize text-[14px]`}
                    >
                      {studio.ban && studio.block
                        ? "Ban"
                        : studio.block && !studio.ban
                        ? "Block"
                        : "Active"}
                    </p>
                    {/* {(? "active" : "blocked")} */}
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
                      <DollarSign className="w-4 h-4 text-[#8c0707]" />
                      <span className="font-semibold text-[14px]">
                        {studio.studioPrice?.toLocaleString() || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /day
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-[#8c0707]" />
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {studio?.ban ? (
                          <DropdownMenuItem
                            className="text-green-500"
                            onClick={() => {
                              unbanStudio(studio?._id).then(() => {
                                // mutate(`/view-all-studios/`);
                              });
                            }}
                          >
                            <LockOpen className="w-4 h-4 mr-2" />
                            Release Studio
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              banStudio(studio?._id).then(() => {
                                // mutate(`/view-all-studios/`);
                              });
                            }}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Ban Studio
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <div className="space-y-4">
                {currentItems.map((studio) => (
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
                        <p
                          className={`${
                            !studio.block ? "bg-[#8c0707]" : "bg-orange-400"
                          } text-white rounded-full px-4 capitalize text-[14px]`}
                        >
                          {studio.ban && studio.block
                            ? "Ban"
                            : studio.block && !studio.ban
                            ? "Block"
                            : "Active"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by <ReadUser id={studio?.accountHolderID} />
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {studio.studioAddress}
                      </div>
                    </div>

                    <div className="text-right ">
                      <div className="flex items-center space-x-1 mb-1 ">
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
