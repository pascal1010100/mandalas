"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Send, UserRound, UsersRound } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  normalizePublicProperty,
  trackWhatsAppIntent,
} from "@/lib/analytics";
import { buildContactHref } from "@/lib/public-contact";

const fieldClass =
  "h-11 border-white/20 px-0 text-white placeholder:text-stone-500 shadow-none focus-visible:border-amber-200/80 md:text-base";

const selectTriggerClass =
  "h-11 w-full rounded-none border-x-0 border-t-0 border-b-2 border-white/20 bg-transparent px-0 text-base text-white shadow-none focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-stone-500 md:text-base";

const formLabelClass =
  "text-xs uppercase tracking-[0.18em] text-white/65";

function normalizeLocation(value: string | null) {
  if (!value) return null;
  if (value.toLowerCase().includes("hideout")) return "Hideout";
  if (value.toLowerCase().includes("mandalas")) return "Mandalas";

  return null;
}

function formatInquiryDates(dates: DateRange | undefined) {
  if (!dates?.from) return "";

  const checkIn = format(dates.from, "MMM d, yyyy");
  if (!dates.to) return `${checkIn} (check-out pending)`;

  return `${checkIn} to ${format(dates.to, "MMM d, yyyy")}`;
}

export function ReservationInquiryForm() {
  const [name, setName] = useState("");
  const [dates, setDates] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("Not sure yet");
  const [roomType, setRoomType] = useState("Not sure yet");
  const [message, setMessage] = useState("");
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const formattedDates = useMemo(() => formatInquiryDates(dates), [dates]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedLocation = searchParams.get("location") || searchParams.get("sede");
    const selectedRoom = searchParams.get("room") || searchParams.get("habitacion");
    const normalizedLocation = normalizeLocation(selectedLocation);

    queueMicrotask(() => {
      if (normalizedLocation) {
        setLocation(normalizedLocation);
      }

      if (selectedRoom) {
        setRoomType(selectedRoom);
      }
    });
  }, []);

  const whatsappMessage = useMemo(() => {
    return [
      "Hi Mandalas, I would like to ask about a stay.",
      "",
      `Name: ${name || "Pending"}`,
      `Dates: ${formattedDates || "Pending"}`,
      `Guests: ${guests || "Pending"}`,
      `Preferred stay: ${location}`,
      `Room type: ${roomType}`,
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [formattedDates, guests, location, message, name, roomType]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackWhatsAppIntent(normalizePublicProperty(location), "contact_form");
    window.open(
      buildContactHref(whatsappMessage),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      id="inquiry"
      onSubmit={handleSubmit}
      className="relative w-full max-w-full scroll-mt-24 overflow-hidden border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.045)_44%,rgba(255,255,255,0.025))] p-5 shadow-2xl shadow-black/30 sm:p-8 md:scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />

      <div className="mb-9 grid gap-6 border-b border-white/10 pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200/70">
            Personal help
          </p>
          <h2 className="max-w-xl font-heading text-2xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-3xl">
            Need a hand choosing?
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-300">
            For groups, special plans, or a recommendation between the two
            stays, leave us the essentials and we will help personally.
          </p>
        </div>

        <p className="max-w-36 border-l border-white/15 pl-4 text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-white/55 max-sm:border-l-0 max-sm:border-t max-sm:pt-4 max-sm:pl-0">
          Groups, special requests, and personal advice.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-name" className={formLabelClass}>
              Name
            </Label>
            <UserRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="guest-count" className={formLabelClass}>
              Guests
            </Label>
            <UsersRound className="h-4 w-4 text-white/40" />
          </div>
          <Input
            id="guest-count"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            placeholder="2 guests"
            className={fieldClass}
          />
        </div>

        <fieldset className="min-w-0 space-y-4 sm:col-span-2">
          <legend className="sr-only">Dates</legend>
          <div className="flex items-center justify-between gap-3">
            <span className={formLabelClass}>Dates</span>
            <CalendarDays className="h-4 w-4 text-white/40" aria-hidden="true" />
          </div>

          <p id="travel-dates-help" className="text-sm leading-relaxed text-stone-300">
            Select your check-in date, then your check-out date.
          </p>

          <div className="border-y border-white/15 py-4 pb-6">
            <Calendar
              mode="range"
              selected={dates}
              onSelect={setDates}
              disabled={{ before: today }}
              startMonth={today}
              showOutsideDays={false}
              aria-describedby="travel-dates-help travel-dates-selection"
              className="mx-auto w-full max-w-[28rem] bg-transparent p-0 text-white [--cell-size:2.5rem] sm:[--cell-size:2.75rem]"
              classNames={{
                root: "w-full",
                months: "relative flex w-full flex-col gap-4",
                month: "flex w-full flex-col gap-4",
                month_caption:
                  "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                caption_label:
                  "select-none font-heading text-sm font-medium uppercase tracking-[0.14em] text-white",
                nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
                button_previous:
                  "flex size-(--cell-size) items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-200/80 disabled:opacity-40",
                button_next:
                  "flex size-(--cell-size) items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-200/80 disabled:opacity-40",
                weekdays: "flex border-b border-white/10 pb-2",
                weekday:
                  "flex-1 select-none text-center text-xs font-semibold uppercase tracking-[0.08em] text-stone-400",
                week: "mt-1 flex w-full",
                day: "relative aspect-square h-full w-full p-0 text-center",
                day_button:
                  "flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center rounded-md text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-amber-100/90 data-[range-start=true]:bg-amber-200 data-[range-start=true]:text-amber-950 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-amber-100/15 data-[range-middle=true]:text-amber-50 data-[range-end=true]:bg-amber-200 data-[range-end=true]:text-amber-950",
                today: "rounded-md ring-1 ring-inset ring-white/35",
                disabled: "text-stone-600 opacity-50",
                range_start: "rounded-l-md bg-amber-200",
                range_middle: "rounded-none bg-amber-100/15",
                range_end: "rounded-r-md bg-amber-200",
              }}
            />
          </div>

          <div
            id="travel-dates-selection"
            aria-live="polite"
            className="grid grid-cols-2 gap-4 pt-2 sm:pt-3"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Check-in
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {dates?.from ? format(dates.from, "EEE, MMM d") : "Choose a date"}
              </p>
            </div>
            <div className="border-l border-white/15 pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Check-out
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {dates?.to ? format(dates.to, "EEE, MMM d") : "Choose a date"}
              </p>
            </div>
          </div>
        </fieldset>

        <div className="space-y-3">
          <Label
            id="preferred-stay-label"
            htmlFor="preferred-stay"
            className={formLabelClass}
          >
            Stay
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              id="preferred-stay"
              aria-labelledby="preferred-stay-label"
              className={selectTriggerClass}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Mandalas">Mandalas</SelectItem>
              <SelectItem value="Hideout">Hideout</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label
            id="room-type-label"
            htmlFor="room-type"
            className={formLabelClass}
          >
            Room
          </Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger
              id="room-type"
              aria-labelledby="room-type-label"
              className={selectTriggerClass}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-stone-950 text-white shadow-2xl shadow-black/40">
              <SelectItem value="Mixed Dorm">Mixed dorm</SelectItem>
              <SelectItem value="Female Dorm">Female dorm</SelectItem>
              <SelectItem value="Private Room">Private room</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="extra-message" className={formLabelClass}>
            Helpful details
          </Label>
          <Textarea
            id="extra-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Late arrival, private room, quieter stay, rooftop, lake..."
            className={`${fieldClass} min-h-24 resize-none px-0`}
          />
        </div>
      </div>

      <div className="mt-8 border-y border-white/15 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          <span>{location}</span>
          <span className="h-px w-8 bg-amber-200/45" />
          <span>{roomType}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 h-12 w-full rounded-full border border-amber-100/30 bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-amber-950 shadow-none transition-colors hover:bg-amber-100"
      >
        <Send className="h-4 w-4" />
        Ask on WhatsApp
      </Button>
    </form>
  );
}
