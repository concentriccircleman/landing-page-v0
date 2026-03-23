import { useState, useMemo, useEffect, useCallback, Component, type ReactNode } from "react";
import styles from "./ReviewTool.module.css";
import manifestData from "../../component-manifest.json";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "../components/Card";
import { Label } from "../components/Label";
import { Separator } from "../components/Separator";
import { Skeleton } from "../components/Skeleton";
import { Switch } from "../components/Switch";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../components/Select";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogClose,
} from "../components/Dialog";
import { Textarea } from "../components/Textarea";
import { Tooltip } from "../components/Tooltip";
import { Progress } from "../components/Progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Alert, AlertTitle, AlertDescription } from "../components/Alert";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
} from "../components/AlertDialog";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from "../components/Breadcrumb";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "../components/DropdownMenu";
import { Popover, PopoverTrigger, PopoverContent } from "../components/Popover";
import {
  Field, FieldLabel, FieldDescription, FieldError, FieldGroup,
} from "../components/Field";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { Toast } from "../components/Toast";
import { DataTable } from "../components/DataTable";
import { Checkbox } from "../components/Checkbox";
import { RadioGroup, RadioGroupItem } from "../components/RadioGroup";
import { Toggle } from "../components/Toggle";
import { Kbd, KbdGroup } from "../components/Kbd";
import { Spinner } from "../components/Spinner";
import { Loader } from "../components/Loader";
import { NativeSelect, NativeSelectOption } from "../components/NativeSelect";
import { AspectRatio } from "../components/AspectRatio";
import { TextShimmer } from "../components/TextShimmer";
import { InlineInput } from "../components/InlineInput";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "../components/Item";
import { PromptSuggestion } from "../components/PromptSuggestion";
import { CopyButton } from "../components/CopyButton";
import { ScrollButton } from "../components/ScrollButton";
import { ToggleGroup, ToggleGroupItem } from "../components/ToggleGroup";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../components/InputOTP";
import { ActionBar, ActionBarGroup, ActionBarItem, ActionBarSeparator } from "../components/ActionBar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/Sheet";
import { ButtonGroup } from "../components/ButtonGroup";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/Collapsible";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../components/HoverCard";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../components/InputGroup";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription as FormDesc, FormMessage } from "../components/Form";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription as DrawerDesc } from "../components/Drawer";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "../components/Command";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "../components/Pagination";
import { PromptInput } from "../components/PromptInput";
import { ScrollArea } from "../components/ScrollArea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/Resizable";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "../components/NavigationMenu";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator as MenubarSep } from "../components/Menubar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../components/Carousel";
import { Combobox } from "../components/Combobox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/Table";
import { Calendar } from "../components/Calendar";
import { CodeBlock } from "../components/CodeBlock";
import { Markdown } from "../components/Markdown";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { Chat, ChatMessageList, ChatMessage, ChatInput } from "../components/Chat";
import { ChainOfThought, ChainOfThoughtStep } from "../components/ChainOfThought";
import { Scroller } from "../components/Scroller";
import { SystemMessage } from "../components/SystemMessage";
import { MediaPlayer } from "../components/MediaPlayer";
import { SidebarProvider, Sidebar as SidebarComponent, SidebarHeader as SBHeader, SidebarContent as SBContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger } from "../components/Sidebar";
import { Accordion } from "../components/Accordion";
import { AppShell } from "../components/AppShell";
import { CheckboxLabel } from "../components/CheckboxLabel";
import { FilterMenu } from "../components/FilterMenu";
import { FilterItem } from "../components/FilterMenu";
import { Menu } from "../components/Menu";
import { MilestoneCard } from "../components/MilestoneCard";
import { ProfileCard } from "../components/ProfileCard";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { ShareSheet } from "../components/ShareSheet";
import { SidebarNav } from "../components/SidebarNav";
import { TopBar } from "../components/TopBar";

/* ── Types ── */

type ComponentStatus = "pending" | "approved" | "denied" | "discussion";
type ComponentLayer = "atom" | "molecule" | "organism";

interface HistoryEntry {
  status: ComponentStatus;
  notes: string;
  timestamp: number;
  version: number;
}

interface FixEntry {
  version: number;
  timestamp: string;
  description: string;
  filesChanged: string[];
}

interface ReviewState {
  status: ComponentStatus;
  notes: string;
  version: number;
  history: HistoryEntry[];
  fixes: FixEntry[];
  dependencyAlert: boolean;
}

interface ComponentEntry {
  id: string;
  name: string;
  layer: ComponentLayer;
  sku: string;
  migrated: boolean;
  designSystemPath: string | null;
  dependsOn: string[];
  reason: string;
  review: ReviewState;
}

interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/* ── localStorage ── */

const STORAGE_KEY = "sentra-ds-review-v2";

function loadPersistedState(): Record<string, Omit<ReviewState, "dependencyAlert">> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt data */ }
  return {};
}

function persistState(components: ComponentEntry[]) {
  const data: Record<string, Omit<ReviewState, "dependencyAlert">> = {};
  for (const c of components) {
    if (c.review.status !== "pending" || c.review.notes || c.review.version > 1 || c.review.fixes.length > 0) {
      data[c.id] = {
        status: c.review.status,
        notes: c.review.notes,
        version: c.review.version,
        history: c.review.history,
        fixes: c.review.fixes,
      };
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  syncToDisk(components);
}

function syncToDisk(components: ComponentEntry[]) {
  const payload: Record<string, {
    name: string;
    status: string;
    notes: string;
    version: number;
    layer: string;
    migrated: boolean;
    lastUpdated: string;
    history: HistoryEntry[];
    fixes: FixEntry[];
  }> = {};
  for (const c of components) {
    payload[c.id] = {
      name: c.name,
      status: c.review.status,
      notes: c.review.notes,
      version: c.review.version,
      layer: c.layer,
      migrated: c.migrated,
      lastUpdated: new Date().toISOString(),
      history: c.review.history,
      fixes: c.review.fixes,
    };
  }
  fetch("/__review-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload, null, 2),
  }).catch(() => {});
}

/* ── Build entries from manifest ── */

function buildEntries(): ComponentEntry[] {
  const persisted = loadPersistedState();
  return manifestData.components.map((mc) => {
    const id = mc.name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
    const saved = persisted[id];
    return {
      id,
      name: mc.name,
      layer: mc.layer as ComponentLayer,
      sku: mc.newSku,
      migrated: mc.migrated,
      designSystemPath: mc.designSystemPath,
      dependsOn: mc.dependsOn,
      reason: mc.reason,
      review: {
        status: saved?.status ?? "pending",
        notes: saved?.notes ?? "",
        version: saved?.version ?? 1,
        history: saved?.history ?? [],
        fixes: saved?.fixes ?? [],
        dependencyAlert: false,
      },
    };
  });
}

/* ── Props definitions for migrated components ── */

const propsMap: Record<string, PropDef[]> = {
  "alert": [
    { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "info"', default: '"default"', description: "Severity level" },
  ],
  "alert-dialog": [
    { name: "open", type: "boolean", description: "Controlled open state" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler" },
  ],
  "avatar": [
    { name: "content", type: '"letters" | "image" | "icon"', default: '"letters"', description: "Content type" },
    { name: "size", type: '"18" | "20" | "24" | "28" | "32" | "36" | "40"', default: '"32"', description: "Size in px" },
    { name: "radius", type: '"full" | "rounded"', default: '"full"', description: "Border radius" },
    { name: "initials", type: "string", description: "Letters when content='letters'" },
  ],
  "badge": [
    { name: "variant", type: '"default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline"', default: '"default"', description: "Color variant" },
    { name: "size", type: '"default" | "sm"', default: '"default"', description: "Badge size" },
    { name: "onDismiss", type: "() => void", description: "Shows dismiss button" },
  ],
  "breadcrumb": [
    { name: "children", type: "ReactNode", description: "BreadcrumbList with items" },
  ],
  "button": [
    { name: "variant", type: '"primary" | "secondary" | "destructive" | "ghost" | "text" | "link"', default: '"primary"', description: "Visual style" },
    { name: "size", type: '"sm" | "default" | "lg" | "icon"', default: '"default"', description: "Button size" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
    { name: "loading", type: "boolean", default: "false", description: "Shows spinner" },
  ],
  "card": [
    { name: "children", type: "ReactNode", description: "Card content" },
    { name: "className", type: "string", description: "Additional CSS class" },
  ],
  "context-menu": [
    { name: "items", type: "MenuEntry[]", description: "Array of menu items" },
    { name: "children", type: "ReactNode", description: "Trigger element" },
  ],
  "data-table": [
    { name: "columns", type: "DataTableColumn[]", description: "Column definitions" },
    { name: "rows", type: "DataTableRow[]", description: "Row data" },
    { name: "pageSize", type: "number", default: "10", description: "Rows per page" },
  ],
  "dialog": [
    { name: "open", type: "boolean", description: "Controlled open state" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler" },
  ],
  "dropdown-menu": [
    { name: "open", type: "boolean", description: "Controlled open state" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler" },
  ],
  "empty": [
    { name: "variant", type: '"light" | "dark"', default: '"light"', description: "Visual variant" },
    { name: "title", type: "string", description: "Heading text" },
    { name: "description", type: "string", description: "Description text" },
    { name: "actions", type: "EmptyStateAction[]", description: "Action buttons" },
  ],
  "field": [
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction" },
    { name: "invalid", type: "boolean", default: "false", description: "Error state" },
    { name: "disabled", type: "boolean", default: "false", description: "Disabled state" },
  ],
  "input": [
    { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Input height" },
    { name: "error", type: "boolean", default: "false", description: "Error border" },
    { name: "variant", type: '"default" | "brand"', default: '"default"', description: "Focus ring color" },
  ],
  "label": [
    { name: "disabled", type: "boolean", default: "false", description: "Dimmed appearance" },
    { name: "htmlFor", type: "string", description: "Associated input ID" },
  ],
  "popover": [
    { name: "open", type: "boolean", description: "Controlled open state" },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Open change handler" },
  ],
  "progress": [
    { name: "value", type: "number", default: "0", description: "Current value" },
    { name: "max", type: "number", default: "100", description: "Maximum value" },
    { name: "variant", type: '"default" | "brand"', default: '"default"', description: "Bar color" },
  ],
  "select": [
    { name: "value", type: "string", description: "Current value" },
    { name: "onValueChange", type: "(value: string) => void", description: "Change handler" },
    { name: "placeholder", type: "string", description: "Placeholder text" },
  ],
  "separator": [
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction" },
  ],
  "skeleton": [
    { name: "width", type: "number", description: "Width in px" },
    { name: "height", type: "number", description: "Height in px" },
    { name: "radius", type: '"sm" | "md" | "lg" | "full"', default: '"md"', description: "Border radius" },
  ],
  "sonner": [
    { name: "type", type: '"info" | "success" | "error" | "warning" | "loading"', default: '"info"', description: "Toast type" },
    { name: "title", type: "string", description: "Toast title" },
    { name: "description", type: "string", description: "Toast description" },
  ],
  "switch": [
    { name: "checked", type: "boolean", description: "Controlled state" },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
  ],
  "tabs": [
    { name: "value", type: "string", description: "Controlled active tab" },
    { name: "defaultValue", type: "string", description: "Uncontrolled default" },
    { name: "variant", type: '"underline" | "pills" | "default"', default: '"underline"', description: "Visual style" },
  ],
  "textarea": [
    { name: "variant", type: '"default" | "brand"', default: '"default"', description: "Focus ring color" },
    { name: "size", type: '"xs" | "sm" | "default" | "lg"', default: '"default"', description: "Min height" },
    { name: "error", type: "boolean", default: "false", description: "Error border" },
  ],
  "tooltip": [
    { name: "content", type: "ReactNode", description: "Tooltip content" },
    { name: "variant", type: '"default" | "inverse"', default: '"default"', description: "Color variant" },
    { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Placement" },
  ],
};

/* ── Preview renderers ── */

function ButtonPreview() {
  return (
    <>
      <div className={styles.previewRow}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="text">Text</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className={styles.previewRow}>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="default">Default</Button>
        <Button variant="primary" size="lg">Large</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" loading>Loading</Button>
      </div>
    </>
  );
}

function InputPreview() {
  return (
    <div className={styles.previewRow} style={{ gap: 24 }}>
      <div className={styles.previewCol} style={{ width: 240 }}>
        <Input placeholder="Default input" />
        <Input placeholder="Small" size="sm" />
        <Input placeholder="Large" size="lg" />
      </div>
      <div className={styles.previewCol} style={{ width: 240 }}>
        <Input placeholder="Error" error />
        <Input placeholder="Disabled" disabled />
        <Input defaultValue="shaurya@sentra.ai" />
      </div>
    </div>
  );
}

function BadgePreview() {
  return (
    <div className={styles.previewRow}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="secondary" size="sm">Small</Badge>
    </div>
  );
}

function CardPreview() {
  return (
    <div className={styles.previewRow} style={{ gap: 24 }}>
      <div style={{ width: 300 }}>
        <Card>
          <CardHeader>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>Configure your workspace preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Label style={{ marginBottom: 4, display: "block" }}>Name</Label>
                <Input placeholder="Sentra" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="sm">Save</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function LabelPreview() {
  return (
    <div className={styles.previewRow}>
      <Label>Default label</Label>
      <Label disabled>Disabled label</Label>
    </div>
  );
}

function SeparatorPreview() {
  return (
    <div className={styles.previewCol} style={{ width: 300 }}>
      <Separator />
      <div style={{ display: "flex", gap: 12, alignItems: "center", height: 32 }}>
        <span style={{ fontSize: 13, color: "var(--fg-base)", fontFamily: "var(--font-family)" }}>Left</span>
        <Separator orientation="vertical" />
        <span style={{ fontSize: 13, color: "var(--fg-base)", fontFamily: "var(--font-family)" }}>Right</span>
      </div>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className={styles.previewRow}>
      <Skeleton width={36} height={36} radius="full" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width={120} height={12} radius="sm" />
        <Skeleton width={80} height={12} radius="sm" />
      </div>
    </div>
  );
}

function SwitchPreview() {
  const [on, setOn] = useState(false);
  return (
    <div className={styles.previewRow}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Switch checked={on} onCheckedChange={setOn} />
        <Label>{on ? "On" : "Off"}</Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Switch disabled />
        <Label disabled>Disabled</Label>
      </div>
    </div>
  );
}

function SelectPreview() {
  const [val, setVal] = useState("");
  return (
    <div style={{ width: 240 }}>
      <Select value={val} onValueChange={setVal} placeholder="Select source...">
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="intercom">Intercom</SelectItem>
          <SelectItem value="zendesk">Zendesk</SelectItem>
          <SelectItem value="freshdesk">Freshdesk</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function DialogPreview() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger><Button variant="secondary" size="sm">Open Dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Delete evaluation</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TextareaPreview() {
  return (
    <div className={styles.previewRow} style={{ gap: 24 }}>
      <div className={styles.previewCol} style={{ width: 240 }}>
        <Textarea placeholder="Default" />
        <Textarea placeholder="Error" error />
      </div>
      <div className={styles.previewCol} style={{ width: 240 }}>
        <Textarea placeholder="Brand focus" variant="brand" />
        <Textarea placeholder="Disabled" disabled />
      </div>
    </div>
  );
}

function TooltipPreview() {
  return (
    <div className={styles.previewRow}>
      <Tooltip content="Tooltip top" side="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip bottom" side="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Inverse style" variant="inverse" side="top">
        <Button variant="secondary" size="sm">Inverse</Button>
      </Tooltip>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className={styles.previewCol} style={{ width: 300, gap: 12 }}>
      <Progress value={25} />
      <Progress value={65} />
      <Progress value={100} variant="brand" />
    </div>
  );
}

function TabsPreview() {
  const [val, setVal] = useState("all");
  return (
    <div className={styles.previewRow} style={{ gap: 32 }}>
      <div style={{ width: 260 }}>
        <Tabs value={val} onValueChange={setVal} variant="underline">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)" }}>All items</div>
          </TabsContent>
          <TabsContent value="pending">
            <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)" }}>Pending items</div>
          </TabsContent>
          <TabsContent value="resolved">
            <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)" }}>Resolved items</div>
          </TabsContent>
        </Tabs>
      </div>
      <div style={{ width: 240 }}>
        <Tabs defaultValue="w" variant="pills">
          <TabsList>
            <TabsTrigger value="w">Weekly</TabsTrigger>
            <TabsTrigger value="m">Monthly</TabsTrigger>
            <TabsTrigger value="y">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className={styles.previewCol} style={{ width: 400, gap: 12 }}>
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral informational alert.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Settings saved successfully.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to connect.</AlertDescription>
      </Alert>
    </div>
  );
}

function BreadcrumbPreview() {
  return (
    <div className={styles.previewCol} style={{ gap: 16 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbPage>Evaluations</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Evaluations</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Q1 Sales Review</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function AlertDialogPreview() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="destructive" size="sm">Delete team</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this team?</AlertDialogTitle>
          <AlertDialogDescription>This will permanently remove the team.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary" size="sm">
          Actions
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => {}}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="secondary" size="sm">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-base)" }}>Quick settings</div>
          <div>
            <Label style={{ marginBottom: 4, display: "block" }}>Name</Label>
            <Input placeholder="Sentra" size="sm" />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="primary" size="sm">Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FieldPreview() {
  const [on, setOn] = useState(false);
  return (
    <div className={styles.previewRow} style={{ gap: 32, alignItems: "flex-start" }}>
      <div style={{ width: 260 }}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="rv-f1">Workspace name</FieldLabel>
            <Input id="rv-f1" placeholder="Sentra" />
          </Field>
          <Field>
            <FieldLabel htmlFor="rv-f2">URL</FieldLabel>
            <Input id="rv-f2" placeholder="www.sentra.ai" />
            <FieldDescription>Your public-facing website.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel htmlFor="rv-f3">Email</FieldLabel>
            <Input id="rv-f3" placeholder="email" error />
            <FieldError>Required.</FieldError>
          </Field>
        </FieldGroup>
      </div>
      <div style={{ width: 280 }}>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Dark mode</FieldLabel>
            <Switch checked={on} onCheckedChange={setOn} />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel>Notifications</FieldLabel>
            <Switch />
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}

function AvatarPreview() {
  return (
    <div className={styles.previewRow} style={{ gap: 16 }}>
      <Avatar content="letters" initials="SH" size="40" />
      <Avatar content="letters" initials="AB" size="32" variant="dark" />
      <Avatar content="letters" initials="CD" size="28" />
      <Avatar content="letters" initials="EF" size="24" radius="rounded" />
      <Avatar content="letters" initials="GH" size="20" />
      <Avatar content="icon" size="36" />
    </div>
  );
}

function EmptyStatePreview() {
  return (
    <div className={styles.previewCol} style={{ gap: 24, width: 400 }}>
      <EmptyState
        title="No evaluations yet"
        description="Create your first evaluation to start reviewing agent calls."
        actions={[{ label: "Create evaluation", variant: "primary" }]}
      />
    </div>
  );
}

function ToastPreview() {
  return (
    <div className={styles.previewCol} style={{ gap: 12, width: 380 }}>
      <Toast type="success" title="Settings saved" description="Your workspace has been updated." />
      <Toast type="error" title="Connection failed" description="Unable to reach the server." />
      <Toast type="info" title="New version available" description="Update to get the latest features." />
      <Toast type="warning" title="Rate limit" description="You're approaching your API limit." />
    </div>
  );
}

function DataTablePreview() {
  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      <DataTable
        columns={[
          { id: "name", header: "Name", type: "label" },
          { id: "status", header: "Status", type: "statusBadge" },
          { id: "role", header: "Role", type: "subtle" },
        ]}
        rows={[
          { id: "1", cells: { name: "Alice Johnson", status: { label: "Active", color: "green" as const }, role: "Admin" } },
          { id: "2", cells: { name: "Bob Smith", status: { label: "Pending", color: "orange" as const }, role: "Member" } },
          { id: "3", cells: { name: "Carol Lee", status: { label: "Inactive", color: "grey" as const }, role: "Viewer" } },
        ]}
      />
    </div>
  );
}

function ContextMenuPreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      Right-click context menu — preview available in Playground
    </div>
  );
}

function CheckboxPreview() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState<boolean | "indeterminate">("indeterminate");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox checked={a} onCheckedChange={setA} id="ck1" />
        <Label htmlFor="ck1">Checked</Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox checked={b} onCheckedChange={setB} id="ck2" />
        <Label htmlFor="ck2">Unchecked</Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox checked={c} onCheckedChange={() => setC(prev => prev === "indeterminate" ? true : prev ? false : "indeterminate")} id="ck3" />
        <Label htmlFor="ck3">Indeterminate</Label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox disabled id="ck4" />
        <Label htmlFor="ck4" disabled>Disabled</Label>
      </div>
    </div>
  );
}

function RadioGroupPreview() {
  const [val, setVal] = useState("a");
  return (
    <div style={{ display: "flex", gap: 32 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500, color: "var(--fg-base)" }}>Vertical</div>
        <RadioGroup value={val} onValueChange={setVal} name="demo-rg">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><RadioGroupItem value="a" id="rg-a" /><Label htmlFor="rg-a">Option A</Label></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><RadioGroupItem value="b" id="rg-b" /><Label htmlFor="rg-b">Option B</Label></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><RadioGroupItem value="c" id="rg-c" disabled /><Label htmlFor="rg-c" disabled>Disabled</Label></div>
        </RadioGroup>
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500, color: "var(--fg-base)" }}>Horizontal</div>
        <RadioGroup value={val} onValueChange={setVal} orientation="horizontal" name="demo-rg2">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><RadioGroupItem value="a" /><Label>A</Label></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><RadioGroupItem value="b" /><Label>B</Label></div>
        </RadioGroup>
      </div>
    </div>
  );
}

function TogglePreview() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Toggle pressed={a} onPressedChange={setA} size="sm">Bold</Toggle>
      <Toggle pressed={b} onPressedChange={setB}>Italic</Toggle>
      <Toggle variant="outline" size="lg">Outline</Toggle>
      <Toggle disabled>Disabled</Toggle>
    </div>
  );
}

function KbdPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Kbd>⌘</Kbd><Kbd>K</Kbd>
      </div>
      <KbdGroup><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup>
      <div style={{ display: "flex", gap: 8 }}>
        <Kbd>Enter</Kbd><Kbd>Esc</Kbd><Kbd>Tab</Kbd><Kbd>Space</Kbd>
      </div>
    </div>
  );
}

function SpinnerPreview() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}

function LoaderPreview() {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <Loader variant="circular" size="md" />
      <Loader variant="dots" size="md" text="Loading..." />
      <Loader variant="pulse" size="md" />
      <Loader variant="bars" size="md" />
    </div>
  );
}

function NativeSelectPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 240 }}>
      <NativeSelect>
        <NativeSelectOption value="">Select option...</NativeSelectOption>
        <NativeSelectOption value="a">Option A</NativeSelectOption>
        <NativeSelectOption value="b">Option B</NativeSelectOption>
        <NativeSelectOption value="c">Option C</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="sm" disabled>
        <NativeSelectOption value="">Disabled</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

function AspectRatioPreview() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 160 }}>
        <AspectRatio ratio={16 / 9}>
          <div style={{ width: "100%", height: "100%", background: "var(--bg-base-pressed)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--fg-muted)" }}>16:9</div>
        </AspectRatio>
      </div>
      <div style={{ width: 100 }}>
        <AspectRatio ratio={1}>
          <div style={{ width: "100%", height: "100%", background: "var(--bg-base-pressed)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--fg-muted)" }}>1:1</div>
        </AspectRatio>
      </div>
    </div>
  );
}

function TextShimmerPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <TextShimmer duration={3}>Loading content...</TextShimmer>
      <TextShimmer as="div" duration={5} spread={30}>Analyzing your data with AI</TextShimmer>
    </div>
  );
}

function InlineInputPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
      <InlineInput defaultValue="Click to edit" onValueCommit={(v) => console.log(v)} />
      <InlineInput defaultValue="Small size" size="xs" onValueCommit={() => {}} />
      <InlineInput defaultValue="Large heading" size="xl" onValueCommit={() => {}} />
    </div>
  );
}

function CopyButtonPreview() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <CopyButton value="Hello, world!" />
      <CopyButton value="npm install @sentra/ds" size="sm" />
    </div>
  );
}

function PromptSuggestionPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 400 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <PromptSuggestion>Summarize this meeting</PromptSuggestion>
        <PromptSuggestion>Write a follow-up email</PromptSuggestion>
        <PromptSuggestion size="sm">Quick action</PromptSuggestion>
      </div>
      <PromptSuggestion variant="highlight" highlight="meeting">What were the key takeaways from the meeting?</PromptSuggestion>
    </div>
  );
}

function ItemPreview() {
  return (
    <div style={{ width: 360 }}>
      <Item>
        <ItemMedia variant="icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Settings</ItemTitle>
          <ItemDescription>Configure workspace preferences</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">Edit</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" /></svg>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Notifications</ItemTitle>
          <ItemDescription>Manage alert preferences</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}

function ScrollButtonPreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      ScrollButton — appears in scrollable containers
    </div>
  );
}

function ToggleGroupPreview() {
  const [val, setVal] = useState("center");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ToggleGroup type="single" value={val} onValueChange={(v) => v && setVal(v)} variant="outline">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function InputOTPPreview() {
  const [otp, setOtp] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>Enter 6-digit code</div>
    </div>
  );
}

function ActionBarPreview() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ position: "relative", height: 120, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} ActionBar</Button>
      {open && (
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", gap: 4, padding: 6, background: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-flyout)" }}>
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">Duplicate</Button>
          <Separator orientation="vertical" />
          <Button variant="ghost" size="sm">Delete</Button>
        </div>
      )}
    </div>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger><Button variant="secondary" size="sm">Open Sheet</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div><Label style={{ marginBottom: 4, display: "block" }}>Name</Label><Input placeholder="Shaurya" /></div>
          <div><Label style={{ marginBottom: 4, display: "block" }}>Email</Label><Input placeholder="shaurya@sentra.ai" /></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ButtonGroupPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ButtonGroup>
        <Button variant="secondary" size="sm">Left</Button>
        <Button variant="secondary" size="sm">Center</Button>
        <Button variant="secondary" size="sm">Right</Button>
      </ButtonGroup>
    </div>
  );
}

function CollapsiblePreview() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 300 }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <Button variant="ghost" size="sm">{open ? "Hide" : "Show"} details</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6 }}>
            This content can be expanded and collapsed. It uses a smooth height animation transition.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" size="sm">Hover over me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar content="letters" initials="SH" size="36" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-base)" }}>Shaurya</div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>shaurya@sentra.ai</div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }}>Admin · Joined Feb 2026</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function InputGroupPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <InputGroup>
        <InputGroupAddon align="start"><InputGroupText>$</InputGroupText></InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
        <InputGroupInput placeholder="sentra.ai" />
      </InputGroup>
    </div>
  );
}

function FormPreview() {
  return (
    <div style={{ width: 320 }}>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input placeholder="you@example.com" />
          <FormDesc>We will never share your email.</FormDesc>
        </FormItem>
        <FormItem>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="••••••••" />
        </FormItem>
        <Button variant="primary" size="sm">Submit</Button>
      </Form>
    </div>
  );
}

function DrawerPreview() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger><Button variant="secondary" size="sm">Open Drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quick Actions</DrawerTitle>
          <DrawerDesc>Choose an action below.</DrawerDesc>
        </DrawerHeader>
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Button variant="secondary">Create meeting</Button>
          <Button variant="secondary">Generate report</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CommandPreview() {
  return (
    <div style={{ width: 350 }}>
      <Command>
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="new-meeting" onSelect={() => {}}>New Meeting<CommandShortcut>⌘N</CommandShortcut></CommandItem>
            <CommandItem value="search" onSelect={() => {}}>Search<CommandShortcut>⌘K</CommandShortcut></CommandItem>
            <CommandItem value="settings" onSelect={() => {}}>Settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(3);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} /></PaginationItem>
        {[1, 2, 3, 4, 5].map(p => (
          <PaginationItem key={p}><PaginationLink page={p} isActive={p === page} onClick={() => setPage(p)}>{p}</PaginationLink></PaginationItem>
        ))}
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationNext onClick={() => setPage(Math.min(10, page + 1))} /></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PromptInputPreview() {
  const [val, setVal] = useState("");
  return (
    <div style={{ width: 400 }}>
      <PromptInput value={val} onChange={setVal} onSubmit={() => setVal("")} placeholder="Ask anything..." />
    </div>
  );
}

function ScrollAreaPreview() {
  return (
    <div style={{ width: 250 }}>
      <ScrollArea style={{ height: 150 }}>
        <div style={{ padding: 12 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ padding: "4px 0", fontSize: 13, color: "var(--fg-base)", borderBottom: "1px solid var(--border-subtle)" }}>Item {i + 1}</div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ResizablePreview() {
  return (
    <div style={{ width: 400, height: 160, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--fg-muted)", background: "var(--bg-subtle)" }}>Panel A</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--fg-muted)" }}>Panel B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function NavigationMenuPreview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
            <NavigationMenuLink href="#">Automation</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MenubarPreview() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => {}}>New</MenubarItem>
          <MenubarItem onSelect={() => {}}>Open</MenubarItem>
          <MenubarSep />
          <MenubarItem onSelect={() => {}}>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => {}}>Undo</MenubarItem>
          <MenubarItem onSelect={() => {}}>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function CarouselPreview() {
  return (
    <div style={{ width: 360 }}>
      <Carousel>
        <CarouselContent>
          {[1, 2, 3, 4, 5].map(i => (
            <CarouselItem key={i}>
              <div style={{ width: 280, height: 120, background: "var(--bg-base-pressed)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--fg-muted)" }}>Slide {i}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function ComboboxPreview() {
  const [val, setVal] = useState("");
  return (
    <div style={{ width: 260 }}>
      <Combobox
        value={val}
        onValueChange={setVal}
        placeholder="Select framework..."
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "svelte", label: "Svelte" },
          { value: "angular", label: "Angular" },
          { value: "solid", label: "Solid" },
        ]}
      />
    </div>
  );
}

function TablePreview() {
  return (
    <div style={{ width: "100%", maxWidth: 500 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell><TableCell>Engineer</TableCell><TableCell><Badge variant="success">Active</Badge></TableCell></TableRow>
          <TableRow><TableCell>Bob</TableCell><TableCell>Designer</TableCell><TableCell><Badge variant="warning">Away</Badge></TableCell></TableRow>
          <TableRow><TableCell>Carol</TableCell><TableCell>PM</TableCell><TableCell><Badge variant="secondary">Offline</Badge></TableCell></TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(new Date());
  return (
    <Calendar selected={date} onSelect={setDate} month={month} onMonthChange={setMonth} />
  );
}

function CodeBlockPreview() {
  return (
    <div style={{ width: 460 }}>
      <CodeBlock
        language="typescript"
        showLineNumbers
        code={`import { Button } from "@sentra/ds";

function App() {
  return (
    <Button variant="primary">
      Get Started
    </Button>
  );
}`}
      />
    </div>
  );
}

function MarkdownPreview() {
  return (
    <div style={{ width: 480 }}>
      <Markdown content={`# Design System

This is the **Sentra** design system. It includes:

- 70 migrated components
- Light and dark mode
- CSS Modules with design tokens

> All components follow the 4px grid rule.

\`\`\`
npm install @sentra/ds
\`\`\`
`} />
    </div>
  );
}

function MarkdownEditorPreview() {
  const [val, setVal] = useState("# Hello\n\nWrite some **markdown** here.");
  return (
    <div style={{ width: 480 }}>
      <MarkdownEditor value={val} onChange={setVal} placeholder="Write markdown..." />
    </div>
  );
}

function ChatPreview() {
  return (
    <div style={{ width: 420, height: 320, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <Chat>
        <ChatMessageList>
          <ChatMessage role="user" content="Can you summarize the Q1 meeting?" />
          <ChatMessage role="assistant" content="The Q1 meeting covered three key topics: revenue targets, team expansion, and the design system migration timeline." />
          <ChatMessage role="user" content="What about the timeline?" />
        </ChatMessageList>
        <ChatInput value="" onChange={() => {}} onSubmit={() => {}} placeholder="Type a message..." />
      </Chat>
    </div>
  );
}

function ChainOfThoughtPreview() {
  return (
    <div style={{ width: 360 }}>
      <ChainOfThought>
        <ChainOfThoughtStep title="Analyzing query" status="complete" duration="0.8s" content="Parsed user intent and extracted key entities." />
        <ChainOfThoughtStep title="Searching knowledge base" status="complete" duration="1.2s" />
        <ChainOfThoughtStep title="Generating response" status="active" />
        <ChainOfThoughtStep title="Formatting output" status="pending" />
      </ChainOfThought>
    </div>
  );
}

function ScrollerPreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      Scroller — infinite scroll container with IntersectionObserver
    </div>
  );
}

function SystemMessagePreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 440 }}>
      <SystemMessage variant="info" title="New feature available" description="Try out the new meeting memory feature." />
      <SystemMessage variant="success" title="Report published" description="Your weekly report is now live." />
      <SystemMessage variant="warning" title="Usage limit" description="You've used 80% of your API quota." />
      <SystemMessage variant="error" title="Sync failed" description="Unable to connect to the server." />
    </div>
  );
}

function MediaPlayerPreview() {
  return (
    <div style={{ width: 380 }}>
      <MediaPlayer type="audio" title="Q1 Planning Review" artist="Meeting Recording" src="" />
    </div>
  );
}

function SidebarPreview() {
  return (
    <div style={{ width: 280, height: 320, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <SidebarProvider defaultOpen={true}>
        <SidebarComponent>
          <SBHeader>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-base)", padding: "0 12px" }}>Sentra</div>
          </SBHeader>
          <SBContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem><SidebarMenuButton isActive>Dashboard</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton>Meetings</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton>Reports</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton>Settings</SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SBContent>
        </SidebarComponent>
      </SidebarProvider>
    </div>
  );
}

function ThemeProviderPreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      ThemeProvider — context provider for light/dark theme switching. Wraps the entire app.
    </div>
  );
}

function AccordionPreview() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Accordion
        type="single"
        items={[
          { id: "1", title: "What is the design system?", description: "A collection of reusable components built with consistent design tokens for spacing, color, and typography." },
          { id: "2", title: "How do I use tokens?", description: "Use CSS variables like var(--space-4) for spacing and var(--fg-base) for colors." },
          { id: "3", title: "Does it support dark mode?", description: "Yes. All components support both light and dark themes via the data-theme attribute.", defaultOpen: true },
        ]}
      />
    </div>
  );
}

function AiChatPreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      AiChat — AI chat modal with suggestions, message bubbles, and input footer. Renders as an overlay.
    </div>
  );
}

function AppShellPreview() {
  return (
    <div style={{ height: 320, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <AppShell
        workspaceName="Sentra"
        sections={[
          { id: "main", label: "Main", items: [
            { id: "home", label: "Home", icon: "home" },
            { id: "inbox", label: "Inbox", icon: "inbox", badge: "3" },
            { id: "reports", label: "Reports", icon: "reports" },
          ]},
        ]}
        footerItems={[
          { id: "settings", label: "Settings", icon: "settings" },
        ]}
        activeItemId="home"
      >
        <div style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--fg-base)" }}>Main Content</h3>
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--fg-muted)" }}>AppShell provides the app layout with sidebar and content area.</p>
        </div>
      </AppShell>
    </div>
  );
}

function CheckboxLabelPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <CheckboxLabel label="Email notifications" description="Receive email when someone mentions you" />
      <CheckboxLabel label="Push notifications" description="Receive push notifications on your device" defaultChecked />
      <CheckboxLabel label="Marketing emails" description="Receive emails about new features" />
    </div>
  );
}

function CreateEvaluationPagePreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      CreateEvaluationPage — Full evaluation creation form with tabs, inputs, and action buttons.
    </div>
  );
}

function EvaluationsPagePreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      EvaluationsPage — Evaluations list with status badges, filters, and data table.
    </div>
  );
}

function FilterMenuPreview() {
  return (
    <div style={{ maxWidth: 280 }}>
      <FilterMenu>
        <FilterItem label="Active" selected />
        <FilterItem label="Completed" />
        <FilterItem label="Archived" />
        <FilterItem label="Draft" badge="12" />
      </FilterMenu>
    </div>
  );
}

function InboxPagePreview() {
  return (
    <div style={{ padding: 24, border: "1px dashed var(--border-base)", borderRadius: "var(--radius-md)", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 }}>
      InboxPage — Inbox with message list, conversation detail, and compose actions.
    </div>
  );
}

function MenuPreview() {
  return (
    <div style={{ maxWidth: 240 }}>
      <Menu
        items={[
          { type: "user-header", name: "Sarah Chen", email: "sarah@sentra.app" },
          { type: "divider" },
          { type: "caption", text: "Navigation" },
          { type: "item", label: "Dashboard" },
          { type: "item", label: "Settings" },
          { type: "item", label: "Profile" },
          { type: "divider" },
          { type: "item", label: "Sign out", destructive: true },
        ]}
      />
    </div>
  );
}

function MilestoneCardPreview() {
  const zoneLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--fg-muted)",
    margin: "0 0 8px 0",
    fontFamily: "var(--font-family)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 760 }}>
      {/* Milestones zone */}
      <div>
        <p style={zoneLabel}>Milestones</p>
        <MilestoneCard
          type="milestone"
          title="Q1 Product Launch"
          date="Mar 31, 2026"
          notes="Launch the new product feature set for enterprise customers with full design system integration"
          participants={[
            { name: "Sarah Chen" },
            { name: "Alex Kim" },
            { name: "Jordan Lee" },
          ]}
          lead="Sarah Chen"
        />
      </div>
      {/* Decisions zone */}
      <div>
        <p style={zoneLabel}>Decisions</p>
        <MilestoneCard
          type="decision"
          title="Pricing Model"
          date="Feb 15, 2026"
          notes="Decide between usage-based and seat-based pricing for the enterprise tier"
          participants={[
            { name: "Sarah Chen" },
            { name: "Alex Kim" },
          ]}
          lead="Alex Kim"
        />
      </div>
      {/* Blockers zone */}
      <div>
        <p style={zoneLabel}>Blockers</p>
        <MilestoneCard
          type="blocker"
          title="API Rate Limiting"
          date="Feb 10, 2026"
          notes="Third-party API rate limits blocking integration tests across staging"
          participants={[
            { name: "Marcus Johnson" },
          ]}
        />
      </div>
      {/* Insights zone */}
      <div>
        <p style={zoneLabel}>Insights</p>
        <MilestoneCard
          type="insight"
          title="Eval Transparency Boosts Performance"
          date="Jan 19, 2026"
          notes="Agents who can see scoring criteria before calls perform 23% higher on quality benchmarks"
          participants={[
            { name: "Jordan Lee" },
            { name: "Sarah Chen" },
          ]}
          lead="Jordan Lee"
        />
      </div>
    </div>
  );
}

function ProfileCardPreview() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <ProfileCard name="Sarah Chen" role="Product Designer" status="online" avatarInitials="SC" />
      <ProfileCard name="Alex Kim" role="Engineer" status="away" avatarInitials="AK" />
      <ProfileCard name="Jordan Lee" role="PM" status="busy" avatarInitials="JL" selected />
      <ProfileCard loading />
    </div>
  );
}

function SettingsSidebarPreview() {
  return (
    <div style={{ height: 360, width: 260, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <SettingsSidebar
        sections={[
          { id: "general", label: "General", items: [
            { id: "workspace", label: "Workspace", icon: "workspace" },
            { id: "users", label: "Users", icon: "users" },
            { id: "groups", label: "Groups", icon: "groups" },
            { id: "audit-logs", label: "Audit Logs", icon: "audit-logs" },
          ]},
          { id: "quality", label: "Quality", items: [
            { id: "calibrations", label: "Calibrations", icon: "calibrations" },
            { id: "processes", label: "Processes", icon: "processes" },
            { id: "teams", label: "Teams", icon: "teams" },
          ]},
        ]}
        activeItemId="workspace"
      />
    </div>
  );
}

function ShareSheetPreview() {
  return (
    <div style={{ maxWidth: 420, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <ShareSheet
        people={[
          { name: "Sarah Chen", email: "sarah@sentra.app", permission: "owner", avatarInitials: "SC" },
          { name: "Alex Kim", email: "alex@sentra.app", permission: "edit", avatarInitials: "AK" },
          { name: "Jordan Lee", email: "jordan@sentra.app", permission: "view", avatarInitials: "JL" },
        ]}
        link="https://sentra.app/share/abc123"
      />
    </div>
  );
}

function SidebarNavPreview() {
  return (
    <div style={{ width: 260, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <SidebarNav
        workspaceName="Sentra"
        sections={[
          { id: "main", label: "Main", items: [
            { id: "home", label: "Home", icon: "home" },
            { id: "inbox", label: "Inbox", icon: "inbox", badge: "5" },
            { id: "reports", label: "Reports", icon: "reports" },
          ]},
          { id: "tools", label: "Tools", items: [
            { id: "workflows", label: "Workflows", icon: "workflows" },
            { id: "assignments", label: "Assignments", icon: "assignments" },
          ]},
        ]}
        footerItems={[
          { id: "help", label: "Help", icon: "help" },
          { id: "settings", label: "Settings", icon: "settings" },
        ]}
        activeItemId="home"
      />
    </div>
  );
}

function ToastComponentPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
      <Toast type="info" title="Changes saved" description="Your settings have been updated." />
      <Toast type="success" title="Success" description="The file was uploaded successfully." />
      <Toast type="error" title="Error" description="Something went wrong. Please try again." />
      <Toast type="warning" title="Warning" description="Your subscription is about to expire." />
    </div>
  );
}

function TopBarPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 600 }}>
      <TopBar breadcrumbs={[{ label: "Weekly Reports" }]} />
      <TopBar
        breadcrumbs={[
          { label: "Weekly Reports", onClick: () => {} },
          { label: "Week of Feb 10 Summary" },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm">Share</Button>
            <Button variant="primary" size="sm">Publish</Button>
          </>
        }
      />
      <TopBar
        breadcrumbs={[
          { label: "Meeting Notes", onClick: () => {} },
          { label: "Q1 Planning Review" },
        ]}
        actions={<Button variant="secondary" size="sm">Export</Button>}
      />
    </div>
  );
}

const previewMap: Record<string, () => JSX.Element> = {
  "button": ButtonPreview,
  "input": InputPreview,
  "badge": BadgePreview,
  "card": CardPreview,
  "label": LabelPreview,
  "separator": SeparatorPreview,
  "skeleton": SkeletonPreview,
  "switch": SwitchPreview,
  "select": SelectPreview,
  "dialog": DialogPreview,
  "textarea": TextareaPreview,
  "tooltip": TooltipPreview,
  "progress": ProgressPreview,
  "tabs": TabsPreview,
  "alert": AlertPreview,
  "breadcrumb": BreadcrumbPreview,
  "alert-dialog": AlertDialogPreview,
  "dropdown-menu": DropdownMenuPreview,
  "popover": PopoverPreview,
  "field": FieldPreview,
  "avatar": AvatarPreview,
  "empty": EmptyStatePreview,
  "sonner": ToastPreview,
  "data-table": DataTablePreview,
  "context-menu": ContextMenuPreview,
  "checkbox": CheckboxPreview,
  "radio-group": RadioGroupPreview,
  "toggle": TogglePreview,
  "kbd": KbdPreview,
  "spinner": SpinnerPreview,
  "loader": LoaderPreview,
  "native-select": NativeSelectPreview,
  "aspect-ratio": AspectRatioPreview,
  "text-shimmer": TextShimmerPreview,
  "inline-input": InlineInputPreview,
  "copy-button": CopyButtonPreview,
  "prompt-suggestion": PromptSuggestionPreview,
  "item": ItemPreview,
  "scroll-button": ScrollButtonPreview,
  "toggle-group": ToggleGroupPreview,
  "input-o-t-p": InputOTPPreview,
  "action-bar": ActionBarPreview,
  "sheet": SheetPreview,
  "button-group": ButtonGroupPreview,
  "collapsible": CollapsiblePreview,
  "hover-card": HoverCardPreview,
  "input-group": InputGroupPreview,
  "form": FormPreview,
  "drawer": DrawerPreview,
  "command": CommandPreview,
  "pagination": PaginationPreview,
  "prompt-input": PromptInputPreview,
  "scroll-area": ScrollAreaPreview,
  "resizable": ResizablePreview,
  "navigation-menu": NavigationMenuPreview,
  "menubar": MenubarPreview,
  "carousel": CarouselPreview,
  "combobox": ComboboxPreview,
  "table": TablePreview,
  "calendar": CalendarPreview,
  "code-block": CodeBlockPreview,
  "markdown": MarkdownPreview,
  "markdown-editor": MarkdownEditorPreview,
  "chat": ChatPreview,
  "chain-of-thought": ChainOfThoughtPreview,
  "scroller": ScrollerPreview,
  "system-message": SystemMessagePreview,
  "media-player": MediaPlayerPreview,
  "sidebar": SidebarPreview,
  "theme-provider": ThemeProviderPreview,
  "accordion": AccordionPreview,
  "ai-chat": AiChatPreview,
  "app-shell": AppShellPreview,
  "checkbox-label": CheckboxLabelPreview,
  "create-evaluation-page": CreateEvaluationPagePreview,
  "evaluations-page": EvaluationsPagePreview,
  "filter-menu": FilterMenuPreview,
  "inbox-page": InboxPagePreview,
  "menu": MenuPreview,
  "milestone-card": MilestoneCardPreview,
  "profile-card": ProfileCardPreview,
  "settings-sidebar": SettingsSidebarPreview,
  "share-sheet": ShareSheetPreview,
  "sidebar-nav": SidebarNavPreview,
  "toast": ToastComponentPreview,
  "top-bar": TopBarPreview,
};

/* ── Error Boundary ── */

class PreviewErrorBoundary extends Component<
  { componentName: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prev: { componentName: string }) {
    if (prev.componentName !== this.props.componentName) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>&#9888;</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-base)", marginBottom: 4 }}>
            Preview crashed
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 12 }}>
            {this.props.componentName} threw an error during render.
          </div>
          <pre style={{ fontSize: 11, color: "var(--fg-error)", background: "var(--bg-subtle)", padding: 12, borderRadius: "var(--radius-sm)", textAlign: "left", overflow: "auto", maxHeight: 120, whiteSpace: "pre-wrap" }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Not Migrated placeholder ── */

function NotMigratedPlaceholder({ name }: { name: string }) {
  return (
    <div className={styles.notMigrated}>
      <svg className={styles.notMigratedIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <h3 className={styles.notMigratedTitle}>{name}</h3>
      <p className={styles.notMigratedDesc}>This component has not been migrated yet. It will appear here once built with design system tokens.</p>
      <Badge variant="outline" size="sm">Queued for migration</Badge>
    </div>
  );
}

/* ── Main component ── */

export function ReviewTool() {
  const [components, setComponents] = useState<ComponentEntry[]>(buildEntries);
  const [selectedId, setSelectedId] = useState<string>("button");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ComponentStatus>("all");
  const [darkPreview, setDarkPreview] = useState(false);
  const [showMigratedOnly, setShowMigratedOnly] = useState(false);

  useEffect(() => {
    persistState(components);
  }, [components]);

  useEffect(() => {
    fetch("/__review-state")
      .then((r) => r.json())
      .then((diskState: Record<string, { fixes?: FixEntry[]; status?: string; version?: number }>) => {
        setComponents((prev) => {
          let changed = false;
          const next = prev.map((c) => {
            const disk = diskState[c.id];
            if (!disk) return c;
            const diskFixes = disk.fixes ?? [];
            if (diskFixes.length > c.review.fixes.length) {
              changed = true;
              return {
                ...c,
                review: {
                  ...c.review,
                  fixes: diskFixes,
                  version: disk.version ?? c.review.version,
                  status: (disk.status as ComponentStatus) ?? c.review.status,
                },
              };
            }
            return c;
          });
          return changed ? next : prev;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const entries = components.slice();
    let changed = false;
    for (const c of entries) {
      const hasDepsChanged = c.dependsOn.some((depName) => {
        const dep = entries.find((e) => e.name === depName);
        return dep && dep.review.status === "denied";
      });
      if (c.review.dependencyAlert !== hasDepsChanged) {
        c.review.dependencyAlert = hasDepsChanged;
        changed = true;
      }
    }
    if (changed) setComponents([...entries]);
  }, [components]);

  const counts = useMemo(() => {
    const c = { all: 0, pending: 0, approved: 0, denied: 0, discussion: 0, migrated: 0 };
    for (const comp of components) {
      c.all++;
      c[comp.review.status]++;
      if (comp.migrated) c.migrated++;
    }
    return c;
  }, [components]);

  const filtered = useMemo(() => {
    return components.filter((c) => {
      if (showMigratedOnly && !c.migrated) return false;
      if (filter !== "all" && c.review.status !== filter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.sku.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [components, filter, search, showMigratedOnly]);

  const atoms = filtered.filter((c) => c.layer === "atom");
  const molecules = filtered.filter((c) => c.layer === "molecule");
  const organisms = filtered.filter((c) => c.layer === "organism");

  const selected = components.find((c) => c.id === selectedId);

  const flatList = useMemo(() => [...atoms, ...molecules, ...organisms], [atoms, molecules, organisms]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const idx = flatList.findIndex((c) => c.id === selectedId);
      if (idx === -1) return;
      const next = e.key === "ArrowRight"
        ? flatList[(idx + 1) % flatList.length]
        : flatList[(idx - 1 + flatList.length) % flatList.length];
      setSelectedId(next.id);
      document.querySelector(`[data-component-id="${next.id}"]`)?.scrollIntoView({ block: "nearest" });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flatList, selectedId]);

  const updateStatus = useCallback((id: string, status: ComponentStatus) => {
    setComponents((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const entry: HistoryEntry = {
        status: c.review.status,
        notes: c.review.notes,
        timestamp: Date.now(),
        version: c.review.version,
      };
      const nextVersion = status === "denied" ? c.review.version + 1 : c.review.version;
      return {
        ...c,
        review: {
          ...c.review,
          status,
          version: nextVersion,
          history: [...c.review.history, entry],
        },
      };
    }));
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setComponents((prev) => prev.map((c) => c.id === id ? { ...c, review: { ...c.review, notes } } : c));
  }, []);

  const PreviewComponent = selected && selected.migrated ? previewMap[selected.id] : null;
  const selectedProps = selected ? propsMap[selected.id] ?? [] : [];

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Component Review</h2>
          <input
            className={styles.searchInput}
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterRow}>
          {(["all", "pending", "approved", "denied", "discussion"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "discussion" ? "Discuss" : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={styles.filterCount}>{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className={styles.migratedToggle}>
          <label className={styles.migratedToggleLabel}>
            <input
              type="checkbox"
              checked={showMigratedOnly}
              onChange={(e) => setShowMigratedOnly(e.target.checked)}
            />
            <span className={styles.migratedToggleCheck} />
            Migrated only ({counts.migrated})
          </label>
        </div>

        <div className={styles.sidebarList}>
          {atoms.length > 0 && (
            <div className={styles.layerGroup}>
              <div className={styles.layerLabel}>Atoms ({atoms.length})</div>
              {atoms.map((c) => {
                const latestFix = c.review.fixes[c.review.fixes.length - 1];
                const wasFixed = latestFix && latestFix.version === c.review.version;
                return (
                  <div
                    key={c.id}
                    data-component-id={c.id}
                    className={`${styles.componentItem} ${selectedId === c.id ? styles.componentItemActive : ""}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className={`${styles.statusDot} ${statusDotClass(c.review.status)}`} />
                    <span className={styles.componentName}>
                      {c.name}
                      {!c.migrated && <span className={styles.notMigratedTag}>queued</span>}
                      {c.review.dependencyAlert && <span className={styles.depAlert} title="Dependency was denied">!</span>}
                    </span>
                    {wasFixed && <span className={styles.fixedBadge}>Fixed</span>}
                    {c.review.version > 1 && <span className={styles.versionBadge}>v{c.review.version}</span>}
                  </div>
                );
              })}
            </div>
          )}
          {molecules.length > 0 && (
            <div className={styles.layerGroup}>
              <div className={styles.layerLabel}>Molecules ({molecules.length})</div>
              {molecules.map((c) => {
                const latestFix = c.review.fixes[c.review.fixes.length - 1];
                const wasFixed = latestFix && latestFix.version === c.review.version;
                return (
                  <div
                    key={c.id}
                    data-component-id={c.id}
                    className={`${styles.componentItem} ${selectedId === c.id ? styles.componentItemActive : ""}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className={`${styles.statusDot} ${statusDotClass(c.review.status)}`} />
                    <span className={styles.componentName}>
                      {c.name}
                      {!c.migrated && <span className={styles.notMigratedTag}>queued</span>}
                      {c.review.dependencyAlert && <span className={styles.depAlert} title="Dependency was denied">!</span>}
                    </span>
                    {wasFixed && <span className={styles.fixedBadge}>Fixed</span>}
                    {c.review.version > 1 && <span className={styles.versionBadge}>v{c.review.version}</span>}
                  </div>
                );
              })}
            </div>
          )}
          {organisms.length > 0 && (
            <div className={styles.layerGroup}>
              <div className={styles.layerLabel}>Organisms ({organisms.length})</div>
              {organisms.map((c) => {
                const latestFix = c.review.fixes[c.review.fixes.length - 1];
                const wasFixed = latestFix && latestFix.version === c.review.version;
                return (
                  <div
                    key={c.id}
                    data-component-id={c.id}
                    className={`${styles.componentItem} ${selectedId === c.id ? styles.componentItemActive : ""}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className={`${styles.statusDot} ${statusDotClass(c.review.status)}`} />
                    <span className={styles.componentName}>
                      {c.name}
                      {!c.migrated && <span className={styles.notMigratedTag}>queued</span>}
                      {c.review.dependencyAlert && <span className={styles.depAlert} title="Dependency was denied">!</span>}
                    </span>
                    {wasFixed && <span className={styles.fixedBadge}>Fixed</span>}
                    {c.review.version > 1 && <span className={styles.versionBadge}>v{c.review.version}</span>}
                  </div>
                );
              })}
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ padding: 16, textAlign: "center", color: "var(--fg-disabled)", fontSize: 13 }}>
              No components match.
            </div>
          )}
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{counts.approved}</span> approved
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{counts.denied}</span> denied
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{counts.pending}</span> pending
          </div>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className={styles.mainPanel}>
        {selected ? (
          <>
            <div className={styles.mainHeader}>
              <div className={styles.mainHeaderLeft}>
                <h1 className={styles.mainHeaderTitle}>{selected.name}</h1>
                <span className={styles.mainHeaderLayer}>{selected.layer}</span>
                <span className={styles.mainHeaderLayer}>{selected.sku}</span>
                {selected.review.version > 1 && (
                  <span className={styles.mainHeaderLayer}>v{selected.review.version}</span>
                )}
                {selected.review.dependencyAlert && (
                  <span className={styles.depAlertBadge}>Dependency denied</span>
                )}
              </div>
              <div className={styles.mainHeaderRight}>
                {selected.migrated && (
                  <label className={styles.darkModeToggle}>
                    <input type="checkbox" checked={darkPreview} onChange={(e) => setDarkPreview(e.target.checked)} />
                    <div className={`${styles.toggleTrack} ${darkPreview ? styles.toggleTrackActive : ""}`}>
                      <div className={`${styles.toggleThumb} ${darkPreview ? styles.toggleThumbActive : ""}`} />
                    </div>
                    Dark
                  </label>
                )}
              </div>
            </div>

            <div className={styles.contentArea}>
              <div className={styles.previewContainer}>
                <div
                  className={`${styles.previewArea} ${darkPreview ? styles.previewAreaDark : ""}`}
                  data-theme={darkPreview ? "dark" : undefined}
                >
                  <PreviewErrorBoundary componentName={selected.id}>
                    {PreviewComponent ? <PreviewComponent /> : <NotMigratedPlaceholder name={selected.name} />}
                  </PreviewErrorBoundary>
                </div>
              </div>

              {selected.dependsOn.length > 0 && (
                <div className={styles.depsSection}>
                  <h3 className={styles.propsSectionTitle}>Dependencies</h3>
                  <div className={styles.depsList}>
                    {selected.dependsOn.map((dep) => {
                      const depComp = components.find((c) => c.name === dep);
                      return (
                        <span
                          key={dep}
                          className={`${styles.depChip} ${depComp?.review.status === "denied" ? styles.depChipDenied : depComp?.review.status === "approved" ? styles.depChipApproved : ""}`}
                          onClick={() => depComp && setSelectedId(depComp.id)}
                        >
                          {dep}
                          {depComp && <span className={`${styles.depChipDot} ${statusDotClass(depComp.review.status)}`} />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedProps.length > 0 && (
                <div className={styles.propsSection}>
                  <h3 className={styles.propsSectionTitle}>Props API</h3>
                  <table className={styles.propsTable}>
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProps.map((p) => (
                        <tr key={p.name}>
                          <td><span className={styles.propName}>{p.name}</span></td>
                          <td><span className={styles.propType}>{p.type}</span></td>
                          <td><span className={styles.propDefault}>{p.default ?? "—"}</span></td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selected.review.history.length > 0 && (
                <div className={styles.historySection}>
                  <h3 className={styles.propsSectionTitle}>Review History</h3>
                  <div className={styles.historyList}>
                    {selected.review.history.slice().reverse().map((h, i) => (
                      <div key={i} className={styles.historyItem}>
                        <span className={`${styles.statusDot} ${statusDotClass(h.status)}`} />
                        <span className={styles.historyStatus}>{h.status}</span>
                        <span className={styles.historyVersion}>v{h.version}</span>
                        <span className={styles.historyTime}>{new Date(h.timestamp).toLocaleString()}</span>
                        {h.notes && <span className={styles.historyNotes}>{h.notes}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.review.fixes.length > 0 && (
                <div className={styles.historySection}>
                  <h3 className={styles.propsSectionTitle}>Fix History</h3>
                  <div className={styles.fixList}>
                    {selected.review.fixes.slice().reverse().map((f, i) => (
                      <div key={i} className={styles.fixItem}>
                        <div className={styles.fixHeader}>
                          <span className={styles.fixBadge}>Fix v{f.version}</span>
                          <span className={styles.historyTime}>{new Date(f.timestamp).toLocaleString()}</span>
                        </div>
                        <div className={styles.fixDescription}>{f.description}</div>
                        {f.filesChanged.length > 0 && (
                          <div className={styles.fixFiles}>
                            {f.filesChanged.map((file) => (
                              <span key={file} className={styles.fixFile}>{file}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.actionsBar}>
              <div className={styles.actionsLeft}>
                <span className={`${styles.statusBadge} ${statusBadgeClass(selected.review.status)}`}>
                  {selected.review.status === "discussion" ? "Needs Discussion" : selected.review.status.charAt(0).toUpperCase() + selected.review.status.slice(1)}
                </span>
                <input
                  className={styles.notesInput}
                  placeholder="Add review notes..."
                  value={selected.review.notes}
                  onChange={(e) => updateNotes(selected.id, e.target.value)}
                />
              </div>
              <div className={styles.actionsRight}>
                <Button variant="ghost" size="sm" onClick={() => updateStatus(selected.id, "discussion")}>
                  Needs Discussion
                </Button>
                <Button variant="destructive" size="sm" onClick={() => updateStatus(selected.id, "denied")}>
                  Deny
                </Button>
                <Button variant="primary" size="sm" onClick={() => updateStatus(selected.id, "approved")}>
                  Approve
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-3-3v6m-7.5 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className={styles.emptyTitle}>Select a component</h3>
            <p className={styles.emptyDesc}>Choose a component from the sidebar to preview, review props, and approve or deny.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function statusDotClass(status: ComponentStatus): string {
  switch (status) {
    case "approved": return styles.statusApproved;
    case "denied": return styles.statusDenied;
    case "discussion": return styles.statusDiscussion;
    default: return styles.statusPending;
  }
}

function statusBadgeClass(status: ComponentStatus): string {
  switch (status) {
    case "approved": return styles.statusBadgeApproved;
    case "denied": return styles.statusBadgeDenied;
    case "discussion": return styles.statusBadgeDiscussion;
    default: return styles.statusBadgePending;
  }
}
