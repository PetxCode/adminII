import { ReactNode } from "react";
// import { Card } from "./components/ui/card";
import { TrendingUp, TrendingDown, FactoryIcon } from "lucide-react";
import { Card } from "../ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatsCardProps) {
  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>

          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-success" : "text-destructive"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">
                This year's record
              </span>
            </div>
          )}

          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>

        <div className="p-3 bg-[#8c0707]/5 text-black rounded-lg">
          {icon}
          
        </div>
      </div>
    </Card>
  );
}
