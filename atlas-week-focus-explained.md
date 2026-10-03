# Atlas Next Week Focus — w/c 28.09.26 (Explained for Beginners)

> Source: HSBC Confluence — *Group AIMS* space → *Atlas* → *Next Week Focus - Atlas*
> Prepared 25 September 2026 by Stan Li.

## What this page is

It's the team's **to-do list for the week commencing 28 Sept 2026** — 8 tasks, who owns each one, deadlines, blockers, and what "done" looks like.

The space is called **Group AIMS** (AI Management & Strategies). The left sidebar shows the whole project library: project background, knowledge sharing, meeting prep, plus topic areas like **Codify, RC Model, Reg Genome, CCM AI, Colleague Assist, LLM Pipeline, Velocity**, etc.

## The project in one paragraph

Atlas looks like a **generative-AI knowledge project** at the bank. In simple terms, the team is trying to:

- Take **regulation/rule content** (Reg Genome) and **regulatory-change data** (RC Model)
- Connect it using a **graph database** (a web of linked facts rather than flat spreadsheets — comparing Neo4j vs. "FalcorDB") and an **ontology** (a shared dictionary that defines what things mean)
- Feed it to AI models so answers are accurate — this is **RAG** (the page calls it "RAGO"), where the AI looks up real documents instead of guessing
- Check how well it works using **Cody** (an AI assistant) and early performance testing
- Deliver it in 8-week increments called **MVP** (Minimum Viable Product — the smallest useful version), split across teams called **Pod 2** and **Pod 3**

## How to read the table

| Column | Meaning |
|---|---|
| **FDT Owner** | The single accountable person — they execute, chase, and report. "Work with" = who they collaborate with |
| **Status** | `IN PROGRESS` or `NOT STARTED` |
| **Priority** | `FIRST` = highest, `MEDIUM` = normal |
| **Due** | Deadline (all are 1–3 Oct 2026) |
| **Dependency/Blocker** | What's slowing it down |
| **Delivery artifact** | The proof/output you upload when finished (call notes, doc link, etc.) |
| **Jira** | Blank for now — tasks migrate to Jira later |

## The 8 focus tasks

| # | Task (simplified) | Owner | Status | Priority | Due |
|---|---|---|---|---|---|
| 1 | Hold a Pod 2/Pod 3 alignment session; write down where "data ingestion" ends and "data consumption" begins; set a recurring sync | Stan | In progress | First | 01 Oct |
| 2 | Confirm with Annalyn Chen who owns the ontology; ensure it's on track for mid-November | Stan | In progress | First | 03 Oct |
| 3 | Push the graph database + hosting decision and start legal/data-classification approval (Neo4j vs FalcorDB) | Atlas (team) | In progress | First | 03 Oct |
| 4 | Write internal answers to RegGenome clarification questions | Ken | Not started | First | 02 Oct |
| 5 | Reproduce and visualize Cody's outputs for the RC team | Jessica | Not started | Medium | 01 Oct |
| 6 | Start early performance testing of model-based linkage using Raheel's sample data | Peram/Jessica | Not started | First | 03 Oct |
| 7 | Chase the confirmed MVP regulation list; if it doesn't arrive, fall back to a single RAGO page | Amer | Not started | First | 01 Oct |
| 8 | **⬅️ Your task.** Stand up an interim graph option and scaffold the RegGenome linkage, working with Sonia's engineers | **Panuganti/Ken** | Not started | Medium | 03 Oct |

### Work-with collaborators

- **Task 1:** Debashmita (RC Analytics), Sonia (Eng)
- **Task 2:** Annalyn Chen, Tim Fitzgerald
- **Task 3:** Vas & Archana (Arch), Matt (Platform), Legal
- **Task 4:** Vinil (oord1), R&BC SMEs, Raheel
- **Task 5:** Debashmita's team, Kashif (BA), Kaushik (Cody)
- **Task 6:** Debashmita (RC models), Raheel (quality review)
- **Task 7:** Maena & Andrea (BAL), Raheel (decision)
- **Task 8:** Sonia's engineers

### Key blockers / dependencies

- **Task 1:** Debashmita's availability post-holiday
- **Task 2:** Annalyn's availability
- **Task 3:** Legal sign-off lead time; platform input
- **Task 4:** SME input
- **Task 5:** Access to test policy doc
- **Task 6:** Sample data from Raheel; RC-model access
- **Task 7:** Raheel consulting HK / UK customers
- **Task 8:** GraphDB decision (task 3) may refine it

## The two red-box items ("Ownership to confirm")

1. **GraphDB decision** — Stan chases it, but the actual decision + legal approval sits with Platform/Legal. They still need a *named person* on the Platform side (Matt / Vis / Archana) and a Legal contact.
2. **MVP regulation list** — Stan chases, but the decision owner is **Raheel** (R&BC). They need Raheel to accept a hard deadline.

## Definition of Done for the week

1. Pod 2 / Pod 3 boundary written into the consensus doc.
2. A named owner + date for the GraphDB decision, with legal approval started.
3. Scope-theme RegGenome answers drafted.

## Notes

- Tracked in Confluence for now; will map to Jira tickets when the team migrates.
- Update **Status** and paste your **Delivery artifact** link as you progress.

## Bottom line for a new joiner

Your first deliverable is **task 8** — build a basic/interim graph setup and a skeleton ("scaffold") linking structure for RegGenome, using Raheel's sample data, coordinating with Sonia's engineers, by **3 Oct**. Since it depends on task 3, get clarity early on which database they'll pick.

## Glossary

| Term | Plain-English meaning |
|---|---|
| **w/c** | Week commencing |
| **AIMS** | AI Management & Strategies (your team) |
| **FDT Owner** | The accountable person who executes/chases/oversees |
| **MVP** | Minimum Viable Product — smallest useful version, delivered in ~8-week increments |
| **Pod 2 / Pod 3** | Sub-teams delivering the work |
| **RAG / RAGO** | Retrieval-Augmented Generation — AI looks up real documents instead of guessing |
| **Reg Genome** | The regulation knowledge base/content |
| **RC Model** | Regulatory Change model/data |
| **Ontology** | A shared dictionary defining what things mean and how they relate |
| **Graph database** | Data stored as linked nodes/relationships (Neo4j, FalcorDB) instead of flat tables |
| **Cody** | An AI assistant being tested/reproduced for the RC team |
| **Scaffold** | A basic skeleton structure you build on later |
| **SME** | Subject Matter Expert |
| **Artifact** | The proof/output you upload when a task is done |
