---
title: InlineBadges
tags:
  - plugin/transformer
---

This plugin allows the user to create multipurpose badges that can be used within inline text.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

## Syntax

A badge may be used in line with the following syntax, within an inline code block:

```md
`[!!KEY:TEXT]` -> Normal badges
`[!!|ghs>SUBTEXT:TEXT]` -> Github Success
`[!!|ghb>SUBTEXT:TEXT]` -> Github Blue
`[!!|KEY:TEXT]` -> Plaintext
`[!!|ICON|ARIA:TEXT|COLOR-RGB]` -> Custom icon. Color can be a CSS Variable, eg. `var(--color-red-rgb)`
```

- `KEY` defines the name of the preset to be used, which are equal to the [obsidian callout types](https://help.obsidian.md/callouts#Supported+types).
- `TEXT` and `SUBTEXT` can be any text of your choosing. They cannot contain the `|` character as it is the main delimiter.
- `ICON` is the name of the [lucide icon](https://lucide.dev/) to be used.[^1]
- `ARIA` defines the name of the aria label used for the badge (Not visible to the end user).
- `COLOR-RGB` is a HTML color, such as `256, 12, 32`.
- `ghs` and `ghb` should not be changed, as they define what colour is to be used.

### Examples:

```md
`[!!note:There is no such thing as genuine questions]`
`[!!|ghs>checks:success]`
`[!!|ghb>contributors:52]`
`[!!|warning:Don't say that I didn't tell you.]`
`[!!|menu|menu-item:Go to Settings > Delete Account|140, 200, 110]`
```

```md
What is `[!!danger:love]`?
```

## Configuration

This plugin accepts the following configuration options:

- `customBadges`, an array of objects that defines custom badge types, along with their colours and icon.

### Badge Object

A badge object is defined like so:

```ts
{
	name: "foobar",
	icon: "icon_name",
	color: [10, 10, 10, 1],
	textOpacity: 0.117,
}
```

Where `foobar` is the name of the badge, `icon` is the name of the [lucide icon](https://lucide.dev/)[^1] to be used, `color` is an array defining the background colour in the format `[RED, GREEN, BLUE, ALPHA]`[^2]
These custom badges can now be used with the syntax

```md
`[!!foobar:text-here]`
```

## API

- Category: Transformer
- Function name: `Plugin.InlineBadges()`
- Source: N/A

[^1]: The name must be in lower case. That is, use `accessibility` instead of `Accessibility`, `lucide-accessibility` or `LiAccessibility` (The plugin may not accept them!)

[^2]: Note that `ALPHA` only goes from `0` to `1`, whereas the rest go from `0` to `256`
