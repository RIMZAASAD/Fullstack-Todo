
---
name: shadcn
description: Comprehensive Shadcn/UI component library. Use when building modern React UIs with Tailwind CSS. IMPORTANT: Always use MCP server tools first when available.
---

# Shadcn/UI Skill

Beautiful, accessible components built with Radix UI and Tailwind CSS. Copy and paste into your apps or use MCP commands for integration.

## MCP Server Integration (PRIORITY)

**Always check and use MCP server tools first:**

```bash
# 1. Check available registries
mcp__shadcn__get_project_registries

# 2. List all items in registries
mcp__shadcn__list_items_in_registries

# 3. Search general components in registries
mcp__shadcn__search_items_in_registries
  registries: ["@shadcn", "@kibo-ui", "@react-bits"]
  query: "button"

# 4. Search Task-specific components (cards, task lists, checkboxes)
mcp__shadcn__search_items_in_registries
  registries: ["@shadcn", "@kibo-ui"]
  query: "task card"

# 5. Get usage examples for Task components
mcp__shadcn__get_item_examples_from_registries
  registries: ["@shadcn", "@kibo-ui"]
  query: "task-card-demo"

# 6. Generate add/import command for Task components
mcp__shadcn__get_add_command_for_items
  items: ["@shadcn/task-card", "@kibo-ui/checkbox"]

# 7. Verify implementation
mcp__shadcn__get_audit_checklist
```

## Quick Start for Task Components

```bash
# Initialize shadcn in your project (if not already)
npx shadcn@latest init

# Configure components.json with CSS variables theming
# This enables proper Tailwind CSS integration with Next.js App Router

# Add general components
npx shadcn@latest add button
npx shadcn@latest add card

# Add Task-specific components
npx shadcn@latest add task-card
npx shadcn@latest add checkbox
```

## Component Categories (Including Task Components)

### Inputs

* Button
* Input
* Textarea
* Select
* Checkbox (for task completion)

### Data Display

* Card
* Task Card (for Planit tasks)
* Table
* Badge
* Avatar

### Feedback

* Alert
* Toast
* Dialog
* Tooltip

### Layout

* Accordion
* Collapsible
* Separator
* Scroll Area

### Navigation

* Tabs
* Navigation Menu
* Breadcrumb
* Pagination

