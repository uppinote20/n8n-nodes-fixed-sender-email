# n8n-nodes-fixed-sender-email

This is an n8n community node that sends emails using SMTP with a **fixed sender address** automatically populated from the credential configuration.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) | [Credentials](#credentials) | [Operations](#operations) | [Compatibility](#compatibility) | [Resources](#resources)

## Why This Node?

The built-in n8n Send Email node requires users to manually enter the "From" email address for each node instance. This can lead to:
- Configuration errors when the wrong sender is used
- Time wasted re-entering the same email address
- Inconsistent sender addresses across workflows

**This node solves these problems by:**
- Auto-populating the From address from your SMTP credentials
- Preventing modification of the sender address in the node UI
- Ensuring consistent sender identity across all workflows

## Features

- **Fixed From Address**: Automatically uses the email from SMTP credentials
- **AI Agent Compatible**: Works as a tool in AI Agent workflows
- **Multiple Formats**: Supports Text, HTML, or Both
- **Full Email Options**: CC, BCC, Reply-To support
- **Attachments**: Send files via binary data
- **Connection Test**: Built-in SMTP verification

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

1. Go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter: `n8n-nodes-fixed-sender-email`
4. Click **Install**

> **Note:** This node requires self-hosted n8n (not available on n8n Cloud due to external dependencies).

## Credentials

### Fixed Sender SMTP

| Field | Description | Example |
|-------|-------------|---------|
| User (Email Address) | Your email address (used as From) | sender@example.com |
| Password | Email account password or app password | ******** |
| Host | SMTP server hostname | smtp.gmail.com |
| Port | SMTP port | 587 |
| Secure | Use SSL/TLS | false (for port 587) |

### Common SMTP Settings

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp.office365.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |

> **Gmail Users:** Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

## Operations

### Send Email

| Parameter | Required | Description |
|-----------|----------|-------------|
| To Email | Yes | Recipient email address (comma-separated for multiple) |
| Subject | No | Email subject line |
| Email Format | Yes | Text, HTML, or Both |
| Text | Conditional | Plain text content (when format is Text or Both) |
| HTML | Conditional | HTML content (when format is HTML or Both) |

### Options

| Option | Description |
|--------|-------------|
| Allow Unauthorized Certs | Skip certificate verification |
| Attachments | Binary property names for attachments |
| BCC Email | Blind carbon copy recipients |
| CC Email | Carbon copy recipients |
| Reply To | Reply-to email address |

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** n8n 1.x
- **Requirements:** Self-hosted n8n

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Nodemailer SMTP Documentation](https://nodemailer.com/smtp/)

## License

[MIT](LICENSE.md)
