# Sentra Frontend — Complete Component Catalog

**Purpose:** Exhaustive categorization of every visual/frontend component in the Sentra codebase for design system migration.

**Source:** `/Users/shaurya/Downloads/Sentra-main`  
**Structure:** packages/ui (shared library) + website (app)

---

## Layer Definitions

| Layer | Definition | Examples |
|-------|------------|----------|
| **Atom** | Single primitive, no composition of other UI components | Button, Input, Avatar, Badge |
| **Molecule** | Composes 2+ atoms or simple patterns | Card, Form, DropdownMenu |
| **Organism** | Complex section, composes molecules/atoms | Sidebar, DataTable, Chat |
| **Page** | Full page composition | LoginPage, MeetingDetailsPage |
| **Layout** | Structural wrapper, no visual design | AppLayout, PublicPageLayout |
| **Utility** | Non-visual or minimal UI | Portal, DirectionProvider |

---

## packages/ui — Shared Component Library

### Atoms (Layer 0)

| # | Component | Path | Depends On | Notes |
|---|-----------|------|------------|-------|
| 1 | ActionBar | action-bar | Button, Separator | Action bar with buttons |
| 2 | Alert | alert | — | Alert banner |
| 3 | Avatar | avatar | — | User avatar |
| 4 | Badge | badge | — | Status badge |
| 5 | Button | button | — | Primary CTA |
| 6 | Checkbox | checkbox | — | Form checkbox |
| 7 | Empty | empty | — | Empty state placeholder |
| 8 | Input | input | — | Text input |
| 9 | Kbd | kbd | — | Keyboard shortcut display |
| 10 | Label | label | — | Form label |
| 11 | Loader | loader | — | Loading spinner |
| 12 | Progress | progress | — | Progress bar |
| 13 | ScrollArea | scroll-area | — | Scrollable area |
| 14 | Separator | separator | — | Divider |
| 15 | Skeleton | skeleton | — | Loading placeholder |
| 16 | Spinner | spinner | — | Alternate loader |
| 17 | Switch | switch | — | Toggle switch |
| 18 | Table | table | — | Table primitives |
| 19 | Textarea | textarea | — | Multi-line input |
| 20 | Tooltip | tooltip | — | Hover tooltip |
| 21 | AspectRatio | aspect-ratio | — | Aspect ratio container |
| 22 | Item | item | — | List item primitive |

### Molecules (Layer 1)

| # | Component | Path | Depends On | Notes |
|---|-----------|------|------------|-------|
| 23 | AlertDialog | alert-dialog | Dialog, Button | Confirmation modal |
| 24 | Card | card | — | Content card |
| 25 | Collapsible | collapsible | — | Expand/collapse |
| 26 | Command | command | — | Command palette |
| 27 | CopyButton | copy-button | Button | Copy to clipboard |
| 28 | Dialog | dialog | — | Modal overlay |
| 29 | Drawer | drawer | — | Slide-out panel |
| 30 | DropdownMenu | dropdown-menu | — | Context menu |
| 31 | Field | field | Label, Input | Form field wrapper |
| 32 | Form | form | Field, Label, Input | Form with validation |
| 33 | HoverCard | hover-card | — | Hover popover |
| 34 | InlineInput | inline-input | Input | Inline editable |
| 35 | InputGroup | input-group | Input, Button | Input with addons |
| 36 | Popover | popover | — | Popover overlay |
| 37 | Select | select | — | Dropdown select |
| 38 | Sheet | sheet | Dialog | Slide-out sheet |
| 39 | Tabs | tabs | — | Tab navigation |
| 40 | TextShimmer | text-shimmer | — | Shimmer effect |
| 41 | Breadcrumb | breadcrumb | — | Breadcrumb nav |
| 42 | ButtonGroup | button-group | Button | Button group |
| 43 | Calendar | calendar | — | Date picker |
| 44 | Carousel | carousel | — | Carousel |
| 45 | Combobox | combobox | Command, Popover | Searchable select |
| 46 | ContextMenu | context-menu | — | Right-click menu |
| 47 | Menubar | menubar | — | Menu bar |
| 48 | NativeSelect | native-select | — | Native select |
| 49 | InputOtp | input-otp | Input | OTP input |
| 50 | NavigationMenu | navigation-menu | — | Nav menu |
| 51 | Pagination | pagination | Button | Pagination |
| 52 | RadioGroup | radio-group | — | Radio buttons |
| 53 | Resizable | resizable | — | Resizable panels |
| 54 | ScrollButton | scroll-button | Button | Scroll to top/bottom |
| 55 | Scroller | scroller | — | Horizontal scroll |
| 56 | Toggle | toggle | — | Toggle button |
| 57 | ToggleGroup | toggle-group | Toggle | Toggle group |

### Organisms (Layer 2)

| # | Component | Path | Depends On | Notes |
|---|-----------|------|------------|-------|
| 58 | DataTable | data-table | Table, DropdownMenu, Select, Input | Full data table |
| 59 | Sidebar | sidebar | Separator, ScrollArea, Collapsible | App sidebar |
| 60 | Chat | chat | — | Chat interface |
| 61 | ChainOfThought | chain-of-thought | — | AI reasoning display |
| 62 | CodeBlock | code-block | — | Code block with syntax |
| 63 | Markdown | markdown | — | Markdown renderer |
| 64 | MarkdownEditor | markdown-editor | — | Editable markdown |
| 65 | MediaPlayer | media-player | — | Video/audio player |
| 66 | PromptInput | prompt-input | Textarea, Button | AI prompt input |
| 67 | PromptSuggestion | prompt-suggestion | — | Suggestion chips |
| 68 | SystemMessage | system-message | — | System message block |
| 69 | Sonner | sonner | — | Toast notifications |

### Utilities (Non-Layer)

| # | Component | Path | Notes |
|---|-----------|------|-------|
| 70 | DirectionProvider | direction-provider | RTL/LTR |
| 71 | FocusRing | focus-ring | Focus styles |
| 72 | Portal | portal | Render elsewhere |
| 73 | Presence | presence | Animation presence |
| 74 | ThemeProvider | theme-provider | Dark/light theme |

---

## website — App Components

### Pages (Layer 3)

| # | Page | Path | Route | Flow |
|---|------|------|-------|------|
| 1 | LoginPage | pages/login.tsx | /login | auth |
| 2 | SignUpPage | pages/sign-up.tsx | /signup | auth |
| 3 | SignUpDirectPage | pages/sign-up-direct.tsx | /create-account | auth |
| 4 | SignUpSuccessPage | pages/sign-up-success.tsx | /signup-success | auth |
| 5 | ForgotPasswordPage | pages/forgot-password.tsx | /forgot-password | auth |
| 6 | ResetPasswordPage | pages/reset-password.tsx | /reset-password | auth |
| 7 | EmployeeOnboardingPage | pages/employee-onboarding.tsx | /employee-onboarding | onboarding |
| 8 | MeetingDetailsPage | pages/meeting-details.tsx | /meeting/:id | meetings |
| 9 | MeetingMemoryPage | pages/meeting-memory.tsx | /meeting-memory | meetings |
| 10 | MeetingRoomPage | pages/meeting-room.tsx | /meeting-room | meetings |
| 11 | VoiceMeetingRoomPage | pages/voice-meeting-room.tsx | /voice-meeting | meetings |
| 12 | PublicReportViewPage | pages/public-report-view.tsx | /report/:id | reports |
| 13 | NotFoundPage | pages/not-found.tsx | * | — |

### Layouts

| # | Component | Path | Notes |
|---|-----------|------|-------|
| 1 | AppLayout | components/layouts/app-layout.tsx | Main app shell |
| 2 | PublicPageLayout | components/layouts/public-page-layout.tsx | Public pages |
| 3 | AuthLayout | components/auth/auth-layout.tsx | Auth pages |
| 4 | MultiSidebarLayout | components/layouts/multi-sidebar-layout.tsx | Multi-panel |

### App-Level Components (Organisms)

| # | Component | Path | Uses @sentra/ui |
|---|-----------|------|-----------------|
| 1 | AppSidebar | components/app-sidebar.tsx | SidebarProvider, SidebarInset, many |
| 2 | AppSidebarMobile | components/app-sidebar-mobile.tsx | Sheet, Button, etc. |
| 3 | LeftSidebar | components/left-sidebar.tsx | Multiple |
| 4 | RightSidebar | components/right-sidebar.tsx | Multiple |
| 5 | UserDropdown | components/user-dropdown.tsx | Avatar, DropdownMenu, etc. |
| 6 | MeetingChat | components/meeting-chat.tsx | Multiple |
| 7 | MeetingChatPanel | components/meeting-chat-panel.tsx | Button, Dialog, Input |
| 8 | RoleGuard | components/guards/role-guard.tsx | — |
| 9 | MobileMenu | components/layouts/mobile-menu.tsx | Button |
| 10 | Header | components/landing/header.tsx | Button |
| 11 | Footer | components/landing/footer.tsx | — |
| 12 | SidebarNavItem | components/sidebar-nav-item.tsx | Multiple |
| 13 | GoogleOAuthInstructionModal | components/google-oauth-instruction-modal.tsx | Dialog, etc. |

### Feature Components (by feature)

#### Auth
- LoginForm, SignUpForm

#### Onboarding
- FeatureShowcase, OnboardingShell, OnboardingTimeline, SlackConnection, FeatureWeeklyReviews, Review, TeamInvitation, FeaturePremeetingBriefs, FeatureRiskRadar, SentraOverview, FeatureTodos, CompanyDetails, CalendarConnection

#### Meeting Notes
- MeetingTranscriptTab, MeetingNotesMarkdown, UserCombobox, FormattedTranscript, MeetingAttendeesPanel, JoinMeetingDialog, ImportTranscriptButton, MeetingVideoTab, MeetingSettings, SpeakerMatchingModal, MeetingList, MeetingDetailView, MeetingDetailHeader, MeetingShareDialog

#### Weekly Reports
- CommentInput, ReportSettings, FeedbackThread, SharedWeeklyReportView, ReportDetail, FeedbackSidebar, AddStakeholdersModal, CommentableReport

#### Misalignment Radar
- SharedReportView, AddStakeholdersModal, ReportDetail, RadarList, InboxSidebar, CreateRadarForm, RadarDetailEditor, RadarSettings, ReportShareDialog

#### App Store
- AppCard, AppDetail

#### Todos
- TodoItem, TodoList, TodoReminderSettingsModal, AddTaskDialog

#### Deep Research
- SessionList

#### Feed
- EventDetailsPanel, EventTimeline

#### Settings
- ThemeSettings, AccountConnections, WorkspaceIntegrations, UpdateSettings

#### Users
- AddUsersModal

#### Shared
- AddUsersModal, ActionSwipeReview, ActionReviewCard

#### Integrations
- AsanaWorkspaceSelection

---

## SKU Assignment (OLD-XXXX / NEW-XXXX)

Components are assigned sequential SKUs. Full mapping in `component-manifest.json`.

**Build order (bottom-up):**
1. Atoms (Button, Input, Avatar, Badge, etc.)
2. Molecules (Card, Form, Select, etc.)
3. Organisms (DataTable, Sidebar, Chat, etc.)
4. Website components (AppSidebar, etc.)
5. Pages

---

## Migration Path

```
packages/ui atoms     →  Design system atoms (figma-component-viewer)
packages/ui molecules →  Design system molecules
packages/ui organisms →  Design system organisms
website components    →  Swap @sentra/ui for design system imports
website pages        →  Use migrated components
```

**Result:** Sentra frontend visually matches the design system (tokens, typography, spacing, components).
