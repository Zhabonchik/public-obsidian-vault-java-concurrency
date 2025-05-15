---
title: Reply by Email Button
tags:
  - component
---

The Reply By Email Button is a feature that allows users to display a button under their notes, allowing visitors to comment or submited feedback for your notes via email.  
- The email address is base64 encoded to provide some basic protection from bots.
- The subject line of the email will be taken from the page title where the button is clicked.
- You can specify on what notes the button should be displayed or excluded.
- The label on the button can also be customised.

## Configuration

The Reply By Email Button is disabled by default. To enable it, you can add the component to your layout configuration in `quartz.layout.ts`.

Minimal configuration:
```ts
Component.ReplyByEmail({
  email: "contact@example.com"
}),
```
You can specify under which notes to display the button by adding the following:
```ts
includeTitles: ["Welcome to Quartz 4", "Reply by Email Button", "Contact"],
```
Alternatively, you can include the button by default by ommiting the `includeTitles` line, and specify notes under which the button should not be displayed:
```ts
excludeTitles: ["Welcome to Quartz 4", "Home"],
```
You can also override the default `buttonLabel` text:
```ts
buttonLabel: "Reply by email"
```


## Usage

The natural placement for the Reply By Email Button is within `afterBody` in the Content Pages, so that it is displayed right under the note:

```ts
  afterBody: [
    Component.ReplyByEmail({
      email: "contact@example.com", // The email address to be linked to
      // includeTitles: ["Welcome to Quartz 4"], // You can specify which page titles to include or comment out the line to include on all pages
      excludeTitles: ["Welcome to Quartz 4", "Home"],  // You can specify which page titles to exclude when includeTitles is empty
      buttonLabel: "Submit feedback by email" // You can override the default button text "Reply by email"
    }),
  ],
```

## Customization

You can customize the appearance of the ReplyByEmail button through CSS variables and styles. The component uses the following class:

- `.reply-by-email-button`


Example customization in your custom CSS:

```scss
.reply-by-email-button {
  color: var(--tertiary);
}
```
