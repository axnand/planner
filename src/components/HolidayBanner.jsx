'use client'
import { useState, useEffect } from "react";
import { Calendar, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const HolidayBanner = ({ onPlanLongWeekend }) => {
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [longWeekends, setLongWeekends] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [show, setShow] = useState(true); 
  const pathname = usePathname();

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

      const now = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(now.getMonth() + 3);

      const upcoming = holidays.filter((holiday) => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= now && holidayDate <= threeMonthsFromNow;
      });

      setUpcomingHolidays(upcoming);

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
    setShow(false);
  };

  const visibleLongWeekends = longWeekends.filter(
    (date) => !dismissed.includes(date)
  );

  if (visibleLongWeekends.length === 0) return null;

  const holidayDate = visibleLongWeekends[0]; 
  const holiday = upcomingHolidays.find((h) => h.date === holidayDate);
  if (!holiday) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 sm:right-4 z-50 sm:w-full max-w-xs md:max-w-lg lg:max-w-xl"
        >
          <div className="border border-primary/20  dark:bg-[#171717] bg-[#ffffff] rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex sm:flex-row flex-col sm:items-center sm:gap-0 gap-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex sm:flex-row flex-col sm:items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">
                        Long Weekend Coming Up!
                      </h3>
                      <Badge variant="secondary" className="sm:text-xs text-[10px]">
                        {holiday.localName}
                      </Badge>
                    </div>
                    <p className="sm:text-[13px] text-[11px] text-muted-foreground mr-5">
                      {formatLongWeekendDates(holidayDate)} - Want to plan
                      something special?
                    </p>
                  </div>
                </div>
                <div className="flex  items-center gap-2 ">
                  {pathname!=='/weekend-planner' && <Button size="sm" onClick={onPlanLongWeekend} className="sm:gap-2 gap-1 sm:text-base text-xs">
                    <Calendar className="h-4 w-4" />
                    Plan
                  </Button>}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissBanner(holidayDate)}
                    className={"hidden sm:block"}
                  >
                    <X className="sm:h-4 sm:w-4 h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dismissBanner(holidayDate)}
                    className={" sm:hidden"}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HolidayBanner;
