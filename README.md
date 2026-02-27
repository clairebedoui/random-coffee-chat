# ☕ Random Coffee Chat (Google Apps Script)

Automatically and randomly pair colleagues for recurring coffee chats using Google Sheets and Google Apps Script.
This is ideal for team bonding and remote teams.

---

# ✨ Features

- 🎲 Random pairing of participants
- 🧠 Avoids repeating past pairings when possible
- 📧 Automatic email notifications via Gmail
- 🙋 Opt-in / opt-out support
- ⚖️ Handling of odd numbers of participants
- 📊 Pairing history tracking
- ⏱️ Fully automated with monthly trigger

---

# 📊 Google Sheet Structure

Create a Google Sheet with **two tabs**:

## Sheet 1: `Participants`

| Column | Purpose |
|------|---------|
| A | Active status ("Yes" or "No") |
| B | Name |
| C | Email |

Example:

| Active | Name | Email |
|------|------|------|
| Yes | Alice | alice@company.com |
| Yes | Bob | bob@company.com |
| No | Charlie | charlie@company.com |

### Opt-out

Participants can opt out anytime by changing:

```
Yes → No
```

They will not be paired or emailed.

---

## Sheet 2: `Past pairings`

| Column | Purpose |
|------|---------|
| A | Person 1 |
| B | Person 2 |
| C | Unpaired person (if odd number) |
| D | Date |

This sheet is automatically updated by the script. Do not edit manually.

---

# ⚙️ Installation Guide

## Step 1 — Create the Google Sheet

1. Create a new Google Sheet
2. Create two tabs:
   - `Participants`
   - `Past pairings`
3. Add headers exactly as described above

OR just create your own copy of this file: https://docs.google.com/spreadsheets/d/1zd9wbhEAvmU7MvjJ1icDmlYl9lI13Wyt4m2zBfNpfsI/edit?usp=sharing

---

## Step 2 — Open Apps Script

In your Google Sheet:

```
Extensions → Apps Script
```

Delete any existing code and paste the contents of:

```
Code.gs
```

Save the project.

---

## Step 3 — Run once manually (required for authorization)

In Apps Script:

1. Select function:

```
pairCoffeeChat
```

2. Click:

```
Run ▶
```

3. Google will ask for permissions

Approve access to:

- Google Sheets
- Gmail (to send emails)

This step is required only once.

---

## Step 4 — Create automatic monthly trigger

In Apps Script:

1. Click **Triggers** (clock icon)
2. Click **Add Trigger**
3. Configure:

Function to run:
```
pairCoffeeChat
```

Event source:
```
Time-driven
```

Type:
```
Month timer
```

Choose your preferred day/time.

Click Save.

The script will now run automatically every month.

---

# 🧠 How the pairing logic works

## Participant selection

The script reads the `Participants` sheet and selects only rows where:

```
Column A = "Yes"
```

---

## Pairing logic

The script:

1. Randomly shuffles participants
2. Creates pairs
3. Avoids repeating past pairings when possible
4. Logs all pairings in `Past pairings`

Pairings change every time the script runs.

---

## Handling odd numbers

If there is an odd number of participants:

- One person is not paired that cycle
- The script tries to avoid selecting the same person repeatedly
- The unpaired person is recorded in history
- The unpaired person receives a notification email

Next runs will prioritize pairing them.

---

# 📧 Email notifications

Each paired participant receives:

**Subject**
```
Your Coffee Chat Pair for This Month! ☕
```

**Content**
```
You've been paired for this month's coffee chat! Please take a moment to schedule a time that works best for both of you. Best,
Your Coffee Chat Bot
```

Unpaired participants receive a notification explaining they were not paired this cycle.

**Subject**
```
Coffee Chat Update ☕
```

**Content**
```
This month, we had an odd number of participants, so unfortunately you won't be paired for a coffee chat this month.
Don't worry — next month you'll have a partner!
Best,
Your Coffee Chat Bot
```

Emails are sent using your Google account via Apps Script.

---

# ▶️ Manual run (optional)

You can run anytime manually:

```
Extensions → Apps Script → Run pairCoffeeChat
```

---

# 📁 Project Files

```
Code.gs
README.md
LICENSE
```

Optional:

```
sheet-template.xlsx
```

---

# 🔐 Permissions required

The script requires permission to:

- Read Google Sheets
- Send email via Gmail

This is handled securely by Google Apps Script authorization.

---


# 📄 License

MIT License — free to use and modify.

---

# 🤝 Contributions

Feel free to fork and improve.
