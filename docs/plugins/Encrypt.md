---
title: "Encrypt"
tags:
  - plugin/transformer
encrypt: true
encrypt_message: '^ Password is "quartz"'
password: "quartz"
---

This plugin enables content encryption for sensitive pages in your Quartz site. It uses AES encryption with password-based access control, allowing you to protect specific pages or entire folders with passwords.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Configuration

```typescript
Plugin.Encrypt({
  algorithm: "aes-256-cbc", // Encryption algorithm
  keyLength: 32, // Key length in bytes
  iterations: 100000, // PBKDF2 iterations
  encryptedFolders: {
    // Folder-level encryption
    "private/": "folder-password",
    "work/confidential/": "work-password",
  },
  ttl: 3600 * 24 * 7, // Password cache TTL in seconds (7 days)
})
```

### Configuration Options

- `algorithm`: Encryption algorithm to use. Supported values:
  - `"aes-256-cbc"` (default): AES-256 in CBC mode
  - `"aes-256-gcm"`: AES-256 in GCM mode (authenticated encryption)
  - `"aes-256-ecb"`: AES-256 in ECB mode (not recommended for security)
- `keyLength`: Key length in bytes (default: 32 for AES-256)
- `iterations`: Number of PBKDF2 iterations for key derivation (default: 100000)
- `encryptedFolders`: Object mapping folder paths to passwords for folder-level encryption
- `ttl`: Time-to-live for cached passwords in seconds (default: 604800 = 7 days, set to 0 for session-only)

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

Use frontmatter to encrypt individual pages or override folder passwords:

```yaml
---
title: "My Secret Page"
encrypt: true
password: "page-specific-password"
encrypt_message: "Sorry, this one is only for my eyes,"
---
This content will be encrypted and require a password to view.
```

### Frontmatter Fields

The plugin recognizes these frontmatter fields:

- `encrypt`: Set to `true` to enable encryption for this page
- `password`: The password required to decrypt this page
- `encrypt_message`: Message to be shown on the unlock page.

If a page is in an encrypted folder but has its own `password` field, the page-specific password will be used instead of the folder password.

### Security Considerations

- Use strong passwords for sensitive content
- Consider using AES-256-GCM mode for authenticated encryption
- The default 100,000 PBKDF2 iterations provide good security but can be increased for higher security needs, or decreased for slow devices
- ECB mode is provided for compatibility but is not recommended for security-critical applications

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
- **Secure Key Derivation**: Uses PBKDF2 with configurable iterations
- **Password Verification**: Fast password hash verification before attempting decryption

## API

- Category: Transformer
- Function name: `Plugin.Encrypt()`.
- Source: [`quartz/plugins/transformers/encrypt.ts`](https://github.com/jackyzha0/quartz/blob/v4/quartz/plugins/transformers/encrypt.ts).
