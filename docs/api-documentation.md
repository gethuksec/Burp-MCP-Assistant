# Burp MCP Assistant Technical Documentation

This document explains the internal architecture and data structures used in this project.

## Component Architecture

The project is built using TypeScript and is divided into several main modules:

- `PromptLibrary`: Manages the loading and searching of prompt templates from JSON files.
- `HistoryManager`: Tracks prompt usage using VS Code's `globalState`.
- `CommandRegistry`: Registers VS Code commands and links them to business logic.
- `Extension`: The main entry point that initializes all components.

## Prompt Data Structure

Prompt templates are stored in JSON format within the `resources/prompts/` directory. Each file contains an array of objects with the following structure:

```typescript
interface PromptTemplate {
    id: string;          // Unique ID for the prompt
    name: string;        // Display name
    description: string; // Brief description of its purpose
    category: string;    // Category (Input Validation, Auth, etc.)
    mcpTool: string;     // Suggested primary MCP tool name (e.g., send_http1_request)
    template: string;    // The prompt content to be sent to the AI
    parameters: PromptParameter[]; // Supporting parameters (optional)
    examples: string[];  // Usage examples
    tags: string[];      // Tags to assist in searching
}

interface PromptParameter {
    name: string;
    type: 'string' | 'number' | 'url' | 'json' | 'select';
    required: boolean;
    description: string;
    default?: any;
    options?: string[]; // Only for 'select' type
}
```

## Extension Settings

Users can configure the extension's behavior via `settings.json`:

| Key | Type | Default | Description |
|-------|------|---------|-----------|
| `burpMCP.prompt.defaultAction` | `string` | `"copy"` | Default action when clicking a prompt ("copy" or "insertAtCursor"). |
| `burpMCP.prompt.includeComments` | `boolean` | `true` | Whether to include explanatory comments in the prompt. |
| `burpMCP.history.maxItems` | `number` | `50` | Maximum number of history items to store. |
| `burpMCP.ui.showNotifications` | `boolean` | `true` | Show info notifications when performing actions. |

---

## Further Development (Contribution)

If you want to add new prompts:

1. Create a JSON file in `resources/prompts/` (or add to an existing file).
2. Follow the `PromptTemplate` schema defined above.
3. Run `npm test` to verify JSON validity and tool references.
