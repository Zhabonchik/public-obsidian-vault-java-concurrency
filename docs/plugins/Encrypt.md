---
title: "Encrypt"
tags:
  - plugin/transformer
encrypt: true
encryptConfig:
  password: "quartz"
  message: '^ Password is "quartz"'
---

This plugin enables content encryption for sensitive pages in your Quartz site. It uses AES encryption with password-based access control, allowing you to protect specific pages or entire folders with passwords.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Configuration

```typescript
Plugin.Encrypt({
  algorithm: "aes-256-cbc", // Encryption algorithm
  ttl: 3600 * 24 * 7, // Password cache TTL in seconds (7 days)
  message: "This content is encrypted.", // Default message shown
  encryptedFolders: {
    // Simple password for a folder
    "private/": "folder-password",

    // Advanced configuration for a folder
    "secure/": {
      password: "advanced-password",
      algorithm: "aes-256-gcm",
      ttl: 3600 * 24 * 30, // 30 days
      message: "Authorized access only",
    },
  },
})
```

> [!warning]
> Important security notes:
>
> - All non-markdown files remain unencrypted in the final build
> - Encrypted content is still visible in your source repository if it's public
> - Use this for access control, not for storing highly sensitive secrets

### Configuration Options

- `algorithm`: Encryption algorithm to use
  - `"aes-256-cbc"` (default): AES-256 in CBC mode
  - `"aes-256-gcm"`: AES-256 in GCM mode (authenticated encryption)
  - Key length is automatically inferred from the algorithm (e.g., 256-bit = 32 bytes)
- `encryptedFolders`: Object mapping folder paths to passwords or configuration objects for folder-level encryption
- `ttl`: Time-to-live for cached passwords in seconds (default: 604800 = 7 days, set to 0 for session-only)
- `message`: Message to be displayed in the decryption page

## How Configuration Works

### Configuration Inheritance

Settings cascade down through your folder structure:

```typescript
encryptedFolders: {
  "docs/": {
    password: "docs-password",
    algorithm: "aes-256-gcm"
  },
  "docs/internal/": {
    password: "internal-password"
    // Inherits algorithm from parent folder
  }
}
```

In this example:

- `docs/page.md` uses `"docs-password"` with `"aes-256-gcm"`
- `docs/internal/report.md` uses `"internal-password"` but still uses `"aes-256-gcm"` (inherited)

### Configuration Priority

When multiple configurations apply, the priority is:

1. **Page frontmatter** (highest priority)
2. **Deepest matching folder**
3. **Parent folders** (inherited settings)
4. **Global defaults** (lowest priority)

## Security Features

### Password Caching

- Passwords are stored in browser localStorage
- Automatic expiration based on TTL settings
- Cached passwords are tried automatically when navigating

### Protection Levels

- **Content**: Entire page HTML is encrypted
- **Search/RSS**: Only generic descriptions are exposed
- **Navigation**: Encrypted pages appear in navigation but require passwords to view

## API

- Category: Transformer
- Function name: `Plugin.Encrypt()`
- Source: [`quartz/plugins/transformers/encrypt.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/transformers/encrypt.ts)
