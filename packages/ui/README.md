# @repo/ui

Shared UI component library built with [coss-ui](https://github.com/coss-ui/coss-ui) and [Base UI](https://base-ui.com/).

## Environment Variables

None required.

## Usage

```tsx
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";

export function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </Card>
  );
}
```

## Available Components

| Component      | Description                 |
| -------------- | --------------------------- |
| `accordion`    | Expandable content sections |
| `alert`        | Notification messages       |
| `alert-dialog` | Modal confirmation dialogs  |
| `autocomplete` | Input with suggestions      |
| `avatar`       | User profile images         |
| `badge`        | Status indicators           |
| `breadcrumb`   | Navigation trail            |
| `button`       | Action buttons              |
| `card`         | Content containers          |
| `checkbox`     | Boolean inputs              |
| `combobox`     | Searchable select           |
| `dialog`       | Modal windows               |
| `input`        | Text inputs                 |
| `menu`         | Dropdown menus              |
| `popover`      | Floating content            |
| `select`       | Dropdown select             |
| `sheet`        | Side panels                 |
| `tabs`         | Tabbed navigation           |
| `toast`        | Toast notifications         |
| `tooltip`      | Hover hints                 |

## Utilities

```typescript
import { cn } from "@repo/ui/lib/utils";

// Merge Tailwind classes
cn("px-4 py-2", "bg-blue-500", condition && "opacity-50");
```

## Hooks

```typescript
import { useMobile } from "@repo/ui/hooks/use-mobile";

// Detect mobile viewport
const isMobile = useMobile();
```
