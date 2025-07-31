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
  algorithm: "aes-256-cbc", // Encryption algorithm (key length auto-inferred)
  encryptedFolders: {
    // Folder-level encryption with simple passwords
    "private/": "folder-password",
    "work/confidential/": "work-password",
    // Advanced per-folder configuration
    "secure/": {
      password: "advanced-password",
      algorithm: "aes-256-gcm",
      ttl: 3600 * 24 * 30, // 30 days
    },
  },
  ttl: 3600 * 24 * 7, // Password cache TTL in seconds (7 days)
})
```

> [!warning]
> It is very important to note that:
>
> - All non-markdown files will be left unencrypted in the final build.
> - Marking something as encrypted will only encrypt the page in the final build. The file's content can still be viewed if your repository is public.

### Configuration Options

- `algorithm`: Encryption algorithm to use. Supported values:
  - `"aes-256-cbc"` (default): AES-256 in CBC mode
  - `"aes-256-gcm"`: AES-256 in GCM mode (authenticated encryption)
  - `"aes-256-ecb"`: AES-256 in ECB mode (not recommended for security)
  - Key length is automatically inferred from the algorithm (e.g., 256-bit = 32 bytes)
- `encryptedFolders`: Object mapping folder paths to passwords or configuration objects for folder-level encryption
- `ttl`: Time-to-live for cached passwords in seconds (default: 604800 = 7 days, set to 0 for session-only)
- `message`: Message to be displayed in the decryption page

### Advanced Folder Configuration

You can provide detailed configuration for each encrypted folder:

```typescript
encryptedFolders: {
  "basic/": "simple-password", // Simple string password
  "advanced/": {
    password: "complex-password",
    algorithm: "aes-256-gcm",     // Override global algorithm
    ttl: 3600 * 24 * 30,        // Override global TTL (30 days)
    message: "This content is encrypted", // Message to be displayed
  }
}
```

## Usage

### Folder-level Encryption

Configure folders to be encrypted by adding them to the `encryptedFolders` option:

```typescript
Plugin.Encrypt({
  encryptedFolders: {
    "private/": "my-secret-password",
    "work/": "work-password",
    "personal/diary/": "diary-password",
  },
})
```

All pages within these folders will be encrypted with the specified password. Nested folders inherit passwords from parent folders, with deeper paths taking precedence.

### Page-level Encryption

Use frontmatter to encrypt individual pages or override folder passwords.

```yaml
---
title: "My Secret Page"
password: "page-specific-password"
encryptConfig:
  password: "password-also-allowed-here"
  message: "Sorry, this one is only for my eyes"
  algorithm: "aes-256-gcm" # Optional: override algorithm
  ttl: 86400 # Optional: override TTL (1 day)
---
This content will be encrypted and require a password to view.
```

### Frontmatter Fields

#### encryptConfig object fields:

- `password`: (required) The password required to decrypt this page
- `message`: (optional) Custom message to show on the unlock page
- `algorithm`: (optional) Override the encryption algorithm for this page
- `ttl`: (optional) Override password cache TTL for this page

#### Legacy fields (still supported):

- `encrypt`: Set to `true` to enable encryption for this page
- `password`: The password required to decrypt this page

If a page is in an encrypted folder but has its own password configuration, the page-specific settings will be used instead of the folder settings.

### Security Considerations

- Use strong passwords for sensitive content
- Consider using AES-256-GCM mode for authenticated encryption
- ECB mode is provided for compatibility but is not recommended for security-critical applications
- Key lengths are automatically determined by the algorithm (no manual configuration needed)

## Security Features

### Password Cache

The plugin implements intelligent password caching:

- Passwords are cached in browser localStorage
- Configurable TTL (time-to-live) for automatic cache expiration
- Passwords are automatically tried when navigating to encrypted pages

### Content Protection

- **Full Content Encryption**: The entire HTML content is encrypted, not just hidden
- **SEO Protection**: Search engines and RSS feeds see generic placeholder descriptions
- **Client-side Decryption**: Content is never transmitted in plain text
- **Password Verification**: Fast password hash verification before attempting decryption

## API

- Category: Transformer
- Function name: `Plugin.Encrypt()`.
- Source: [`quartz/plugins/transformers/encrypt.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/transformers/encrypt.ts).
