import { useState } from "react";
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
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../components/Breadcrumb";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "../components/DropdownMenu";
import { Popover, PopoverTrigger, PopoverContent } from "../components/Popover";
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup } from "../components/Field";

/* ── Shared style helpers (matching main playground) ── */

const sectionHeading: React.CSSProperties = {
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--fg-muted)",
  marginBottom: "1rem",
  fontFamily: "var(--font-family)",
  fontWeight: 500,
};

const variantLabel: React.CSSProperties = {
  fontSize: 12,
  color: "var(--fg-muted)",
  marginBottom: 8,
  fontFamily: "var(--font-family)",
  fontWeight: 400,
};

const stateLabel: React.CSSProperties = {
  fontSize: 11,
  color: "var(--fg-disabled)",
  marginBottom: 4,
  fontFamily: "var(--font-family)",
};

export function MigrationAtomsTab() {
  const [switchOn, setSwitchOn] = useState(false);
  const [switchOff] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [tabVal, setTabVal] = useState("tab1");
  const [progress, setProgress] = useState(65);

  return (
    <div style={{ padding: "2rem", fontFamily: "var(--font-family)" }}>
      <h1 style={{
        fontFamily: "var(--font-family-display)",
        fontSize: "var(--font-size-xl)",
        fontWeight: 600,
        color: "var(--fg-base)",
        margin: 0,
      }}>
        Migration Components
      </h1>
      <p style={{
        fontFamily: "var(--font-family)",
        fontSize: "var(--font-size-sm)",
        color: "var(--fg-muted)",
        marginTop: 4,
        marginBottom: "2.5rem",
      }}>
        20 components migrated — scroll down to see all. Atoms and first molecules, rebuilt with design system tokens.
      </p>

      {/* ━━━━━━━━━━━━━━━━ BATCH 1: ATOMS ━━━━━━━━━━━━━━━━ */}

      {/* ── Button ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Button</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <p style={variantLabel}>Variants</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="text">Text</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <p style={variantLabel}>Sizes</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="default">Default</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="secondary" size="icon" aria-label="Add">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </Button>
            </div>
          </div>
          <div>
            <p style={variantLabel}>States</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Input ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Input</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 260 }}>
            <p style={variantLabel}>Sizes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Input placeholder="Small input" size="sm" />
              <Input placeholder="Default input" />
              <Input placeholder="Large input" size="lg" />
            </div>
          </div>
          <div style={{ width: 260 }}>
            <p style={variantLabel}>States</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Input placeholder="Error state" error />
              <Input placeholder="Disabled" disabled />
              <Input defaultValue="shaurya@sentra.ai" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Badge ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Badge</h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="secondary" size="sm">Small</Badge>
          <Badge variant="secondary" onDismiss={() => {}}>Dismissible</Badge>
        </div>
      </section>

      {/* ── Card ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Card</h2>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 320 }}>
            <Card>
              <CardHeader>
                <CardTitle>Workspace settings</CardTitle>
                <CardDescription>Configure your workspace preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <Label style={{ marginBottom: 4, display: "block" }}>Workspace name</Label>
                    <Input placeholder="Sentra" />
                  </div>
                  <div>
                    <Label style={{ marginBottom: 4, display: "block" }}>Website URL</Label>
                    <Input placeholder="www.sentra.ai" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
          <div style={{ width: 320 }}>
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Label>Enable dark mode</Label>
                    <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                  </div>
                  <Separator />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Label>Hide simulation library</Label>
                    <Switch checked={switchOff} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Label + Separator + Skeleton + Switch — compact row ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Label / Separator / Skeleton / Switch</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <p style={variantLabel}>Label</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Label>Workspace name</Label>
              <Label disabled>Disabled</Label>
            </div>
          </div>
          <div>
            <p style={variantLabel}>Separator</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", height: 32 }}>
              <span style={{ fontSize: 13, color: "var(--fg-base)", fontFamily: "var(--font-family)" }}>Left</span>
              <Separator orientation="vertical" />
              <span style={{ fontSize: 13, color: "var(--fg-base)", fontFamily: "var(--font-family)" }}>Right</span>
            </div>
          </div>
          <div>
            <p style={variantLabel}>Skeleton</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Skeleton width={36} height={36} radius="full" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Skeleton width={120} height={12} radius="sm" />
                <Skeleton width={80} height={12} radius="sm" />
              </div>
            </div>
          </div>
          <div>
            <p style={variantLabel}>Switch</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                <Label>{switchOn ? "On" : "Off"}</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch disabled />
                <Label disabled>Disabled</Label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Select + Dialog ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Select / Dialog</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 240 }}>
            <p style={variantLabel}>Select</p>
            <Select value={selectVal} onValueChange={setSelectVal} placeholder="Select a source...">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="intercom">Intercom</SelectItem>
                <SelectItem value="zendesk">Zendesk</SelectItem>
                <SelectItem value="freshdesk">Freshdesk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p style={variantLabel}>Dialog</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger><Button variant="secondary">Open Dialog</Button></DialogTrigger>
              <DialogContent>
                <DialogClose />
                <DialogHeader>
                  <DialogTitle>Delete evaluation</DialogTitle>
                  <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDialogOpen(false)}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ BATCH 2: ATOMS + MOLECULES ━━━━━━━━━━━━━━━━ */}

      <div style={{ marginBottom: "2.5rem" }}><Separator /></div>

      {/* ── Textarea ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Textarea</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>Sizes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Textarea placeholder="Extra small" size="xs" />
              <Textarea placeholder="Default size" />
              <Textarea placeholder="Large textarea" size="lg" />
            </div>
          </div>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>States</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Textarea placeholder="Error state" error />
              <Textarea placeholder="Disabled" disabled />
              <Textarea placeholder="Brand focus" variant="brand" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tooltip ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Tooltip</h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Tooltip content="This is a tooltip" side="top">
            <Button variant="secondary" size="sm">Hover me (top)</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" side="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Inverse variant" variant="inverse" side="top">
            <Button variant="secondary" size="sm">Inverse</Button>
          </Tooltip>
          <Tooltip content="Right side" side="right">
            <Button variant="ghost" size="sm">Right</Button>
          </Tooltip>
        </div>
      </section>

      {/* ── Progress ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Progress</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>Default</p>
            <Progress value={progress} />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Button variant="ghost" size="sm" onClick={() => setProgress(p => Math.max(0, p - 10))}>−10</Button>
              <Button variant="ghost" size="sm" onClick={() => setProgress(p => Math.min(100, p + 10))}>+10</Button>
            </div>
          </div>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>Brand</p>
            <Progress value={40} variant="brand" />
          </div>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>States</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Progress value={0} />
              <Progress value={50} />
              <Progress value={100} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Tabs</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 320 }}>
            <p style={variantLabel}>Underline</p>
            <Tabs value={tabVal} onValueChange={setTabVal} variant="underline">
              <TabsList>
                <TabsTrigger value="tab1">All</TabsTrigger>
                <TabsTrigger value="tab2">Pending</TabsTrigger>
                <TabsTrigger value="tab3">Resolved</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-family)" }}>All items shown here.</div>
              </TabsContent>
              <TabsContent value="tab2">
                <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-family)" }}>Pending items only.</div>
              </TabsContent>
              <TabsContent value="tab3">
                <div style={{ padding: "12px 0", fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-family)" }}>Resolved items only.</div>
              </TabsContent>
            </Tabs>
          </div>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>Pills</p>
            <Tabs defaultValue="a" variant="pills">
              <TabsList>
                <TabsTrigger value="a">Weekly</TabsTrigger>
                <TabsTrigger value="b">Monthly</TabsTrigger>
                <TabsTrigger value="c">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* ── Alert ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Alert</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
          <Alert variant="default">
            <AlertTitle>Default alert</AlertTitle>
            <AlertDescription>This is a neutral informational alert.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Your evaluation has been submitted for review.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Workspace settings saved successfully.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Your trial ends in 3 days.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to connect to the data source.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Breadcrumb</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p style={stateLabel}>Main page</p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbPage>Evaluations</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <p style={stateLabel}>Sub page</p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Evaluations</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Q1 Sales Review</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <p style={stateLabel}>Inner page</p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Quality</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Evaluations</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Create evaluation</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* ── AlertDialog ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Alert Dialog</h2>
        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogTrigger>
            <Button variant="destructive" size="sm">Delete team</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this team?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the team and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="secondary" size="sm" onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={() => setAlertDialogOpen(false)}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* ── DropdownMenu ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Dropdown Menu</h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          <div>
            <p style={variantLabel}>Standard</p>
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
          </div>
          <div>
            <p style={variantLabel}>More actions (icon)</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" aria-label="More actions">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="4" r="1" fill="currentColor" />
                    <circle cx="8" cy="8" r="1" fill="currentColor" />
                    <circle cx="8" cy="12" r="1" fill="currentColor" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => {}}>Export</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => {}}>Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* ── Popover ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Popover</h2>
        <Popover>
          <PopoverTrigger>
            <Button variant="secondary" size="sm">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-base)", fontFamily: "var(--font-family)" }}>Quick settings</div>
              <div>
                <Label style={{ marginBottom: 4, display: "block" }}>Workspace name</Label>
                <Input placeholder="Sentra" size="sm" />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* ── Field (molecule) ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeading}>Field (Molecule)</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ width: 280 }}>
            <p style={variantLabel}>Vertical (default)</p>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="f1">Workspace name</FieldLabel>
                <Input id="f1" placeholder="Sentra" />
              </Field>
              <Field>
                <FieldLabel htmlFor="f2">Website URL</FieldLabel>
                <Input id="f2" placeholder="www.sentra.ai" />
                <FieldDescription>Your public-facing website.</FieldDescription>
              </Field>
              <Field invalid>
                <FieldLabel htmlFor="f3">Email</FieldLabel>
                <Input id="f3" placeholder="shaurya@sentra.ai" error />
                <FieldError>Email is required.</FieldError>
              </Field>
            </FieldGroup>
          </div>
          <div style={{ width: 360 }}>
            <p style={variantLabel}>Horizontal</p>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldLabel>Dark mode</FieldLabel>
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>Notifications</FieldLabel>
                <Switch />
              </Field>
            </FieldGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
