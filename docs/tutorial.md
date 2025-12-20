# Burp MCP Assistant Tutorial

This document provides a guide on how to use Burp MCP Assistant to accelerate your web application security testing.

## Table of Contents

1. [Introduction](#introduction)
2. [Initial Setup](#initial-setup)
3. [Using the Prompt Library](#using-the-prompt-library)
4. [Example Scenario: SQL Injection](#example-scenario-sql-injection)
5. [Tips & Tricks](#tips--tricks)

---

## Introduction

Burp MCP Assistant is a VS Code extension that provides a library of ready-to-use prompts for AI Assistants (like Cursor) connected to Burp Suite via the Model Context Protocol (MCP).

**Reminder:** This extension does not connect directly to Burp Suite; instead, it helps you formulate the right commands for your AI Assistant.

## Initial Setup

### 1. Ensure Burp MCP Server is Running

You must have the **Burp MCP** extension installed in Burp Suite, and the MCP server must be "Enabled".

### 2. Connect Cursor to Burp

Make sure your `mcp.json` file is configured correctly (see README for configuration examples).

## Running the Extension (Development Mode)

If you installed from source code, follow these steps after `npm run compile`:

### 1. Open Run and Debug

Click the "Run and Debug" icon in the **Primary Side Bar** (or press `Ctrl+Shift+D` / `Cmd+Shift+D`).

### 2. Create launch.json

1. Click on the text **"create a launch.json file"**
2. An autocomplete dropdown will appear

### 3. Select Extension Type

Scroll and select **"{ } VS Code Extension Development"**.

### 4. Save launch.json

The file will be created at `.vscode/launch.json`. Save it with `Ctrl+S` / `Cmd+S`.

### 5. Launch the Extension

1. Click the green **"Launch Extension"** button (or press `F5`)
2. A new VS Code window (**Extension Development Host**) will open
3. Your extension is now running in this new window!

## Open Burp MCP Sidebar

In the **Extension Development Host** window:

- Look for the 🎯 (target) icon in the **Activity Bar** (left sidebar)
- Click it to open **Burp MCP Assistant**

## Using the Prompt Library

### Method 1: Click & Copy

1. Find the appropriate category (e.g., "Input Validation").
2. Click on the prompt you want to use.
3. The extension will copy the template to your clipboard.
4. Open the AI Chat (Ctrl+Shift+I) and paste (Ctrl+V).

### Method 2: Insert into Editor

If you want to save a prompt in a markdown file or script:

1. Right-click on the prompt in the sidebar.
2. Select "Insert at Cursor".

### Method 3: Quick Search

1. Press `Ctrl+Shift+B` then `S` (or `Cmd+Shift+B S` on macOS).
2. Type a keyword (e.g., "jwt").
3. Select from the results to copy it.

## Example Scenario: SQL Injection

Let's try testing a suspicious API endpoint: `https://test-target.com/api/v1/products?id=123`

1. Open sidebar → **Input Validation** → **SQL Injection Basic Test**.
2. Click the prompt.
3. In Cursor Chat, paste the prompt and complete the details:

   > "Test <https://test-target.com/api/v1/products?id=123> for SQL injection using Burp MCP tools. Try common payloads and analyze if there are any timing or error differences."

4. Watch as the AI Assistant uses tools like `send_http1_request` to send various SQLi payloads through your Burp Suite.
5. The AI will provide a report of findings directly in the chat.

## Tips & Tricks

- **Use Variables:** Many prompts use placeholders like `{{url}}`. You can replace them directly after pasting the prompt into the chat.
- **Combine Prompts:** Use prompts from the "Reconnaissance" category first to map endpoints, then use specific prompts for particular attack types.
- **Check History:** View the "Recently Used" panel in the sidebar to quickly access prompts you've recently used.

---

**Happy (Authorized) Hacking!** 🎯
