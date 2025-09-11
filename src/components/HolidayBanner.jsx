import { useState, useEffect } from "react";
import { Calendar, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HolidayBanner = ({ onPlanLongWeekend }) => {
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [longWeekends, setLongWeekends] = useState([]);
const [dismissed, setDismissed] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem("dismissedHolidayBanners");
  setDismissed(stored ? JSON.parse(stored) : []);
}, []);


  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/US`
      );
      const holidays = await response.json();

      // Filter upcoming holidays (next 3 months)
      const now = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(now.getMonth() + 3);

      const upcoming = holidays.filter((holiday) => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= now && holidayDate <= threeMonthsFromNow;
      });

      setUpcomingHolidays(upcoming);

      // Check for long weekends (Mon or Fri holidays)
      const longWeekendDates = upcoming
        .filter((holiday) => {
          const holidayDate = new Date(holiday.date);
          const dayOfWeek = holidayDate.getDay();
          return dayOfWeek === 1 || dayOfWeek === 5;
        })
        .map((holiday) => holiday.date);

      setLongWeekends(longWeekendDates);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    }
  };

  const formatLongWeekendDates = (holidayDate) => {
    const date = new Date(holidayDate);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 1) {
      // Monday holiday
      const saturday = new Date(date);
      saturday.setDate(date.getDate() - 2);
      return `${saturday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} (Sat-Mon)`;
    } else {
      // Friday holiday
      const sunday = new Date(date);
      sunday.setDate(date.getDate() + 2);
      return `${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${sunday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} (Fri-Sun)`;
    }
  };

  const dismissBanner = (holidayDate) => {
    const newDismissed = [...dismissed, holidayDate];
    setDismissed(newDismissed);
    localStorage.setItem(
      "dismissedHolidayBanners",
      JSON.stringify(newDismissed)
    );
  };

  const visibleLongWeekends = longWeekends.filter(
    (date) => !dismissed.includes(date)
  );

  if (visibleLongWeekends.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleLongWeekends.map((holidayDate) => {
        const holiday = upcomingHolidays.find((h) => h.date === holidayDate);
        if (!holiday) return null;

        return (
          <Card
            key={holidayDate}
            className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        Long Weekend Coming Up!
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {holiday.localName}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ✨ {formatLongWeekendDates(holidayDate)} - Want to plan
                      something special?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={onPlanLongWeekend} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Plan Weekend
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissBanner(holidayDate)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HolidayBanner;
