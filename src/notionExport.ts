type ExportFile = {
  name: string
  content: string
}

const templateFiles: ExportFile[] = [
  {
    name: "START HERE.md",
    content: `# MY MIND ˏˋ°•*⁀➷

> A private living archive — Notion edition.

## How to import

1. In Notion, open **Settings → Import → Markdown & CSV**.
2. Upload this ZIP file without unpacking it.
3. Move the imported pages into your existing \`chapters\` database, or keep this folder as a standalone template.
4. Replace the prompts and empty states with your real entries.

## Chapters

- 00 — Daily / Save Point
- 01 — Work / Dispatch Desk
- 02 — Culture / Liner Notes
- 03 — Finance / Receipt & Future Me
- 04 — Dreams / Afterimage
- 05 — Questions / Unsent Letters
- 06 — Education / Skill Tree
- 07 — Lore / World Archive
- 08 — Health / Quiet Log
- 09 — Need to Buy / Catalog
- 10 — Relationships / My People
- 11 — Travel / Departure Lounge
- 12 — Eras / Personal Discography
- 13 — Second Brain / Fragments
- 14 — Game / Lite Arcade

The included \`chapters.csv\` can be imported as a database index. Markdown pages contain the complete starter layouts.
`,
  },
  {
    name: "00 Daily - Save Point.md",
    content: `# Daily

> Today does not need to be perfect to be kept.

## Save Point

- Date:
- Mood:
- Energy:
- One true thing:

## Three priorities

- [ ] Choose the day's real priority
- [ ] Chinese focus · 30 min
- [ ] Write one honest paragraph

## Small quests

| Quest | XP | Done |
| --- | ---: | --- |
| Chinese · 30 min | 20 | ☐ |
| English session | 15 | ☐ |
| Diary entry | 10 | ☐ |

## Evening log

### What felt like mine today?

Write without making it productive.

### What can I leave here?

—
`,
  },
  {
    name: "01 Work - Dispatch Desk.md",
    content: `# Work

> Make the next move visible. Keep only active opportunities here.

## Active pipeline

| Opportunity | Company | Stage | Next action | Follow-up | Link |
| --- | --- | --- | --- | --- | --- |
|  |  | Screening |  |  |  |

## Screening

- [ ] Add a real conversation
- Notes:

## Interview

- [ ] Prepare questions
- Interview notes:

## Offer

- Decision:
- Conditions:
- Follow-up:

## Routing rule

1. Conversation
2. Follow-up date
3. Interview notes
4. Decision

Google Sheets may remain the master archive; do not imply an automatic sync.
`,
  },
  {
    name: "02 Culture - Liner Notes.md",
    content: `# Culture

> Collect what changes your inner weather.

## On rotation

| Title | Type | Creator | Status | Rating | Notes |
| --- | --- | --- | --- | --- | --- |
|  | Book / Film / Music / Manhwa |  | To explore |  |  |

## Song of the week

- Title:
- Artist:
- Why it stayed:

## Film fragment

—

## Discovery still open

—

## Playlist

[Open “liked songs” in Spotify](https://open.spotify.com/playlist/3rIRMrGL3uiLqebzFfzubb)
`,
  },
  {
    name: "03 Finance - Receipt and Future Me.md",
    content: `# Finance

> Record the truth, not a prettier number.

## Transactions

| Date | Item | Category | Amount | Currency | Type |
| --- | --- | --- | ---: | --- | --- |
|  |  |  |  | KZT | Expense |

## Future Me fund

| Goal | Target | Saved | Currency | Next step |
| --- | ---: | ---: | --- | --- |
| Emergency quiet |  |  | KZT |  |
| Education |  |  | KZT |  |
| A room of my own |  |  | KZT |  |

## Money rules

- Never sum unlike currencies.
- A savings transfer is not spending twice.
- Wait before turning a want into a need.
- Use real values only.
`,
  },
  {
    name: "04 Dreams - Afterimage.md",
    content: `# Dreams

> Begin with the image that stayed.

## New dream

- **Date:**
- **Title:**
- **Mood:**
- **Lucid:** No
- **People:**
- **Places:**

## Afterimage

Write the dream here…

## Symbols

| Symbol | Feeling | Possible connection |
| --- | --- | --- |
|  |  |  |

## Hidden prompt

What was impossible there, but felt completely ordinary?
`,
  },
  {
    name: "05 Questions - Unsent Letters.md",
    content: `# Questions

> Some questions need a safe place before they need an answer.

## Question archive

| Question | To | Context | Status | Answer |
| --- | --- | --- | --- | --- |
| How did you and dad meet? | Mom | Suggested question, not a recorded family story | Unasked |  |

## To Mom

### Question

—

### Context and answer

—

## To Dad

—

## To Self

—

## To the internet / world

—
`,
  },
  {
    name: "06 Education - Skill Tree.md",
    content: `# Education

> Source before urgency.

## Learning map

| Skill | Current focus | Next action | Resource | Progress |
| --- | --- | --- | --- | --- |
| Chinese | Focus practice | 30 min session |  |  |
| English / IELTS |  |  |  |  |
| Hospitality |  |  |  |  |
| CSC | Research | Verify requirements |  |  |

## Sessions

| Date | Skill | Duration | What I learned |
| --- | --- | ---: | --- |
|  |  |  |  |

## Deadline standard

Every official deadline must include:

- [ ] University or program
- [ ] Primary source URL
- [ ] Checked-on date
- [ ] Official / personal checkpoint label

**CSC checkpoint · 01 Apr 2027** — personal checkpoint, not an official deadline.
`,
  },
  {
    name: "07 Lore - World Archive.md",
    content: `# Lore

> Prompts can open doors. Only your writing decides what lives behind them.

## Places

| Place | Region | Atmosphere | Connected stories |
| --- | --- | --- | --- |
|  |  |  |  |

## Characters

| Character | Role | Wants | Fears | Connections |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Laws

—

## Creatures

—

## Stories

—

## Field note

A place begins with…
`,
  },
  {
    name: "08 Health - Quiet Log.md",
    content: `# Health

> A record for noticing, not scoring.

Keep this page private. No XP, streak pressure, or diagnostic claims.

## Gentle check-in

- Date:
- Energy:
- Sleep:
- Body:
- Mind:
- What would make today feel 5% more supported?

## Private notes

—

## Support

- What helped:
- What I may need:
- A question for a qualified professional:

This page is for personal observation and is not medical advice.
`,
  },
  {
    name: "09 Need to Buy - Catalog.md",
    content: `# Need to Buy

> Comparison and waiting are part of buying well.

## Catalog

| Item | Type | Price | Currency | Priority | Link | Status | Added |
| --- | --- | ---: | --- | --- | --- | --- | --- |
|  | Need |  | KZT |  |  | Considering |  |

## Need

- [ ] Add only what solves a real problem

## Want

- [ ] Wait before buying

## Someday

- [ ] Keep without urgency

## Before checkout

- Do I already own something that works?
- Is the price compared?
- Have I waited long enough?
`,
  },
  {
    name: "10 Relationships - My People.md",
    content: `# Relationships

> Connection is not a leaderboard.

## My people

| Name | Circle | Birthday | Last contact | Next contact | Notes |
| --- | --- | --- | --- | --- | --- |
|  | Friends |  |  |  |  |

## Friends

—

## Family

—

## Mentors

—

## Other constellations

—

Keep personal details respectful and only record what is useful for caring well.
`,
  },
  {
    name: "11 Travel - Departure Lounge.md",
    content: `# Travel

> Places can be dreams before they are plans.

## Journeys

| Place | Status | Dates | Budget | Currency | Next step |
| --- | --- | --- | ---: | --- | --- |
|  | Dream |  |  |  |  |

## Personal plan

### Taemin · 06 Dec 2026

**Status:** planning date — not verified ticket data.

## Itinerary

- [ ] Add real booking details
- [ ] Plan preparations
- [ ] Record actual budget

## Packing

- [ ] Essentials
- [ ] Documents
- [ ] Comfort

Do not store passport numbers or other sensitive identity details here.
`,
  },
  {
    name: "12 Eras - Personal Discography.md",
    content: `# Eras

> Not deadlines. Directions.

## Personal discography

| Era | Place / direction | Status | Meaning | First move |
| --- | --- | --- | --- | --- |
| Side A | Maldives | Lived | Where the story learned its first weather |  |
| Side B | China | Unwritten |  |  |
| Side C | USA | Unwritten |  |  |
| Side D | Own business | Unwritten |  |  |

## Side A · Maldives

—

## Side B · China

—

## Side C · USA

—

## Side D · Own business

—
`,
  },
  {
    name: "13 Second Brain - Fragments.md",
    content: `# Second Brain

> Capture first. Decide later.

## Inbox

| Fragment | Type | Captured | Destination | Sorted |
| --- | --- | --- | --- | --- |
| A thought with no home yet. | Capture |  |  | ☐ |

## Quick capture

- 

## Sunday sort

- [ ] Action → Daily / Tasks
- [ ] Question → Questions
- [ ] Reference → stays here
- [ ] Delete what has no pulse

## References

—

## Notes

—
`,
  },
  {
    name: "14 Game - Lite Arcade.md",
    content: `# Game

> A light reward layer, not a measure of worth.

## Player

- **Level:** 01
- **XP:** 0 / 500
- **Title:** Island grinder

## Quest log

| Quest | XP | Date | Done |
| --- | ---: | --- | --- |
| Chinese · 30 min | 20 |  | ☐ |
| English session | 15 |  | ☐ |
| Diary entry | 10 |  | ☐ |
| Application sent | 30 |  | ☐ |

## Reward shop

| Reward | Cost | Claimed |
| --- | ---: | --- |
| Bubble tea | 100 G | ☐ |
| New book | 300 G | ☐ |

The relationship between Gold and XP is intentionally left unconfirmed. Set your own economy rule before using rewards.
`,
  },
  {
    name: "chapters.csv",
    content: `ID,Chapter,Subtitle,Status
00,Daily,Save Point,Active
01,Work,Dispatch Desk,Template
02,Culture,Liner Notes,Template
03,Finance,Receipt & Future Me,Template
04,Dreams,Afterimage,Template
05,Questions,Unsent Letters,Template
06,Education,Skill Tree,Template
07,Lore,World Archive,Template
08,Health,Quiet Log,Private
09,Need to Buy,Catalog,Template
10,Relationships,My People,Private
11,Travel,Departure Lounge,Template
12,Eras,Personal Discography,Template
13,Second Brain,Fragments,Template
14,Game,Lite Arcade,Demo
`,
  },
]

const encoder = new TextEncoder()

function crc32(data: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function write16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function write32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

function join(parts: Uint8Array[]) {
  const output = new Uint8Array(
    parts.reduce((total, part) => total + part.length, 0),
  )
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}

function createZip(files: ExportFile[]) {
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let localOffset = 0

  for (const file of files) {
    const name = encoder.encode(`MY MIND Notion Template/${file.name}`)
    const content = encoder.encode(file.content)
    const checksum = crc32(content)
    const local = new Uint8Array(30 + name.length + content.length)
    const localView = new DataView(local.buffer)

    write32(localView, 0, 0x04034b50)
    write16(localView, 4, 20)
    write16(localView, 6, 0x0800)
    write16(localView, 8, 0)
    write32(localView, 14, checksum)
    write32(localView, 18, content.length)
    write32(localView, 22, content.length)
    write16(localView, 26, name.length)
    local.set(name, 30)
    local.set(content, 30 + name.length)
    localParts.push(local)

    const central = new Uint8Array(46 + name.length)
    const centralView = new DataView(central.buffer)
    write32(centralView, 0, 0x02014b50)
    write16(centralView, 4, 20)
    write16(centralView, 6, 20)
    write16(centralView, 8, 0x0800)
    write16(centralView, 10, 0)
    write32(centralView, 16, checksum)
    write32(centralView, 20, content.length)
    write32(centralView, 24, content.length)
    write16(centralView, 28, name.length)
    write32(centralView, 42, localOffset)
    central.set(name, 46)
    centralParts.push(central)
    localOffset += local.length
  }

  const centralDirectory = join(centralParts)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  write32(endView, 0, 0x06054b50)
  write16(endView, 8, files.length)
  write16(endView, 10, files.length)
  write32(endView, 12, centralDirectory.length)
  write32(endView, 16, localOffset)

  return join([...localParts, centralDirectory, end])
}

export function downloadNotionTemplate() {
  const archive = createZip(templateFiles)
  const blob = new Blob([archive], { type: "application/zip" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "MY-MIND-Notion-Template.zip"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
