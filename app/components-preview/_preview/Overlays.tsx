"use client";

import {
  BadgeCheck,
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  Info,
  LogOut,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Caption } from "@/components/ui/typography";
import { talentProfiles } from "@/data/talent";
import { Demo, Section } from "./Section";

const diane = talentProfiles[0];

export function Overlays() {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Section
      id="overlays"
      eyebrow="Components"
      title="Dialogs, drawers and menus"
      note="All of these trap keyboard focus while open, close with Escape, and return focus to the button that opened them."
    >
      <Demo
        label="Dialog, confirmation and drawer"
        className="flex flex-wrap gap-3"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Changes are kept in this browser tab only.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="dlg-name">Full name</FieldLabel>
                <Input id="dlg-name" defaultValue="Diane M." />
              </Field>
              <Field>
                <FieldLabel htmlFor="dlg-discipline">Discipline</FieldLabel>
                <Input
                  id="dlg-discipline"
                  defaultValue="Software Development"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => toast.success("Profile updated")}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 data-icon="inline-start" /> Remove posting
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this posting?</AlertDialogTitle>
              <AlertDialogDescription>
                Back-End Developer Intern will no longer be visible to students.
                Applicants already in your process are kept.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep posting</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => toast("Posting removed")}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open applicant (drawer)</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle>{diane.name}</SheetTitle>
                  <SheetDescription>
                    {diane.discipline} · {diane.level}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="space-y-6 px-6 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="sample">Sample profile</Badge>
                <Badge variant="verified">
                  <BadgeCheck data-icon="inline-start" /> Skills verified
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-heading">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {diane.skills.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-heading">Experience</h3>
                <p className="mt-1">{diane.experience}</p>
              </div>
            </div>
            <SheetFooter>
              <Button>Move to interview</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Demo>

      <Demo
        label="Menus and hints"
        className="flex flex-wrap items-center gap-3"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar size="sm">
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              Diane M. <ChevronDown data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              <p className="font-semibold text-heading">Diane M.</p>
              <Caption>Student · Sample user</Caption>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User /> Skills Passport
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings /> Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut /> Switch role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Notifications, 2 new"
            >
              <Bell />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <PopoverHeader>
              <PopoverTitle>Notifications</PopoverTitle>
              <PopoverDescription>
                2 new since your last visit
              </PopoverDescription>
            </PopoverHeader>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                Your application for Back-End Developer Intern moved to
                Interview.
              </li>
              <li>Node.js was verified by Sample TVET School.</li>
            </ul>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="About the Skills Passport"
            >
              <Info />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Skills verified by a school or facilitator
          </TooltipContent>
        </Tooltip>

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">{diane.name}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-heading">{diane.name}</p>
                <p className="text-muted-foreground">{diane.discipline}</p>
                <p className="mt-2">{diane.experience}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Demo>

      <Demo
        label="Search (Command)"
        hint="Also opens with Ctrl+K or ⌘K"
        className="flex flex-wrap items-center gap-3"
      >
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground sm:w-72"
          onClick={() => setSearchOpen(true)}
        >
          Search courses, people, pages…
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <CommandDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          title="Search"
          description="Search courses, opportunities and pages"
        >
          <Command>
            <CommandInput placeholder="Type to search…" />
            <CommandList>
              <CommandEmpty>
                No results. Try a skill or a course name.
              </CommandEmpty>
              <CommandGroup heading="Courses">
                <CommandItem>
                  <BookOpen /> Back-End Development
                </CommandItem>
                <CommandItem>
                  <BookOpen /> Database Design
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Opportunities">
                <CommandItem>
                  <Briefcase /> Back-End Developer Intern
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </Demo>
    </Section>
  );
}
