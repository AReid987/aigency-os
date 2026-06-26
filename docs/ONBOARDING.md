# Aigency OS — Domain Expert Onboarding Guide

> **Welcome!** This guide is written for domain experts — people who know business, not code. No technical knowledge required. If you can use a web browser, you can use Aigency OS.

---

## What Is Aigency OS?

Aigency OS is an **AI-powered venture building platform**. It helps you turn business ideas into real companies by combining your industry expertise with AI agents that handle the technical work.

Think of it as a **digital co-founder** that:

- Helps you design business models using visual canvases
- Creates financial projections and revenue calculations automatically
- Manages project plans and tracks milestones
- Handles customer relationships through a built-in CRM
- Keeps a knowledge base of everything your venture learns
- Runs quality audits on all plans and documents

You provide the **domain knowledge** (what you know about your industry). The AI agents provide the **technical execution** (code, analysis, documentation). Together, you build ventures faster.

---

## How to Access the Platform

Everything runs in your web browser. No installation needed — the platform is already running on your computer.

### Step-by-step:

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Type this address** into the address bar at the top:
   ```
   http://localhost:3000
   ```
3. **Press Enter**
4. You will see the **Agor Canvas** — the main workspace where everything happens

> **What is "localhost:3000"?** It just means "this computer." The platform runs locally on your machine, so you don't need the internet to use it.

---

## How to Create a Business Model Canvas

The **Business Model Canvas (BMC)** is a one-page visual template for describing how a business creates, delivers, and captures value. It has 9 building blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partners, and Cost Structure.

### Step-by-step:

1. **Open the canvas** at `http://localhost:3000`
2. **Find the toolbar** — it's a vertical strip on the left side of the screen
3. **Locate the "BMC" card** in the toolbar (it looks like a small card with "BMC" written on it)
4. **Click and drag** the BMC card from the toolbar onto the canvas (the large white area)
5. **Drop it** wherever you want — the canvas is infinite, so you can place it anywhere
6. The BMC card will **expand into a full Business Model Canvas** with 9 sections
7. **Click on any section** to type in your business details:
   - Click "Customer Segments" → type who your customers are
   - Click "Value Propositions" → type what problem you solve
   - Continue for each section
8. **Your work saves automatically** — you don't need to click a save button

### Tips:
- You can **move the canvas around** by clicking on an empty area and dragging
- **Zoom in and out** using your mouse scroll wheel or trackpad pinch
- Create **multiple canvases** for different business ideas
- Ask the AI agents to **fill in sections** by typing a request in the chat

---

## How to Use the Revenue Calculator

The **Revenue Calculator** helps you forecast how much money your venture could make. It uses your Business Model Canvas data to build financial projections.

### Step-by-step:

1. **Create or open a BMC** on the canvas (see above)
2. **Look for the calculator icon** (it looks like a small calculator or "$" symbol) on the canvas card toolbar
3. **Click the calculator icon** — a revenue panel will slide open
4. **Enter your assumptions:**
   - **Price per unit**: How much does your product/service cost?
   - **Units per month**: How many do you expect to sell?
   - **Growth rate**: How fast do you expect sales to grow? (e.g., 10% per month)
   - **Cost per unit**: How much does it cost you to deliver one unit?
5. **See your projections** update in real-time:
   - Monthly revenue
   - Annual revenue
   - Profit margins
   - Break-even point (when you stop losing money and start making money)
6. **Adjust the numbers** to test different scenarios — "What if I charge more?" or "What if I sell twice as many?"

### Tips:
- The calculator updates **instantly** as you change numbers
- Use it to **compare different pricing strategies**
- Save your best scenario — it links back to your BMC

---

## How to Review Plans in Plannotator

**Plannotator** is the planning tool where AI agents create detailed project plans for your venture. You review and approve these plans before work begins.

### Step-by-step:

1. **Open your browser** and go to:
   ```
   http://localhost:3003
   ```
2. You will see the **Plannotator dashboard** with a list of plans
3. **Click on any plan** to open it and see the details:
   - **Summary**: A one-paragraph description of what the plan covers
   - **Tasks**: A checklist of everything that needs to be done
   - **Timeline**: When each task should be completed
   - **Dependencies**: What needs to happen before other things can start
4. **Review the plan** — read through each task carefully
5. **Leave comments** by clicking the comment icon (💬) next to any task
6. **Request changes** by typing what needs to be different
7. **Approve the plan** by clicking the green "Approve" button when you're satisfied

### Tips:
- Plans created by AI agents will say "Generated by [Agent Name]" at the top
- You can **reject a plan** and ask the AI to redo it
- Approved plans move into **execution mode** where agents start working

---

## How to Approve Milestone Gates

**Milestone gates** are checkpoints where work pauses until you (the domain expert) give the go-ahead. This ensures the AI agents don't go off track.

### Step-by-step:

1. When agents reach a milestone, you will see a **notification** on the canvas (a badge or popup)
2. **Click the notification** to open the milestone review
3. **Review what the agents have done:**
   - Read the summary of completed work
   - Check the deliverables (documents, code, analysis)
   - Look at the quality audit report (see AEGIS section below)
4. **Make your decision:**
   - Click **"Approve"** (green button) → agents continue to the next phase
   - Click **"Request Changes"** (yellow button) → tell agents what to fix
   - Click **"Reject"** (red button) → stop this direction entirely
5. **Add a note** explaining your decision (required for rejections)

### Tips:
- Milestones usually appear at the end of each sprint (work cycle)
- You can see **upcoming milestones** in the Plannotator timeline
- Approving milestones is the most important part of your role — you're the quality gate

---

## How to View Gbrain Knowledge Dashboards

**Gbrain** is the platform's shared brain — a knowledge base that stores everything your venture has learned. Documents, research, decisions, and insights all live here.

### Step-by-step:

1. **Open your browser** and go to:
   ```
   http://localhost:3008
   ```
2. You will see the **Gbrain Dashboard** with several sections:
   - **Knowledge Graph**: A visual map of how topics connect
   - **Recent Documents**: The latest files added to the knowledge base
   - **Search**: Find anything by typing keywords
3. **Browse by topic** using the knowledge graph:
   - Each circle (node) represents a topic
   - Lines between circles show how topics relate
   - Click a circle to see all documents about that topic
4. **Search for specific information:**
   - Type a question or keyword in the search bar
   - Results show matching documents with highlighted excerpts
5. **Read a document** by clicking on its title
6. **Ask Gbrain a question:**
   - Type a natural question like "What did we decide about pricing?"
   - Gbrain will search all documents and give you a summary answer

### Tips:
- Gbrain **learns automatically** as agents create documents and make decisions
- Use it to **catch up** if you've been away from the project
- Great for **onboarding new team members** — they can search and learn

---

## How to Use DenchClaw CRM

**DenchClaw** is the built-in Customer Relationship Management (CRM) tool. It helps you track customers, leads, and interactions.

### Step-by-step:

1. **Open your browser** and go to:
   ```
   http://localhost:3100
   ```
2. You will see the **DenchClaw Dashboard** with:
   - **Customer List**: Everyone in your database
   - **Pipeline View**: Where each lead is in the sales process
   - **Activity Feed**: Recent interactions
3. **Add a new customer:**
   - Click the **"+ Add Customer"** button (top right)
   - Fill in their details: name, email, company, phone
   - Choose their stage: Lead → Prospect → Customer → Advocate
   - Click **"Save"**
4. **Update a customer's status:**
   - Click on a customer's name
   - Change their **pipeline stage** using the dropdown
   - Add **notes** about your interaction
   - Click **"Save"**
5. **View the sales pipeline:**
   - Click **"Pipeline"** in the sidebar
   - See all leads organized by stage (like sticky notes on a board)
   - Drag a lead from one stage to another to update their status
6. **Search for a customer:**
   - Type their name or company in the search bar
   - Click on the matching result

### Tips:
- AI agents can **auto-populate** customer data from research
- Use the **notes field** to record what each customer cares about
- The pipeline helps you see **where your best opportunities are**

---

## How to Read AEGIS Audit Reports

**AEGIS** (AI Evaluation & Governance Intelligence System) is the quality assurance tool. It reviews everything the AI agents produce and creates audit reports.

### Step-by-step:

1. **Open your browser** and go to:
   ```
   http://localhost:3007
   ```
2. You will see the **AEGIS Dashboard** with a list of audit reports
3. **Click on a report** to open it. Each report contains:
   - **Overall Score**: A number from 0–100 rating the quality
   - **Summary**: A plain-English explanation of what was reviewed
   - **Findings**: A list of things that look good (✅) and things that need attention (⚠️)
   - **Recommendations**: Specific suggestions for improvement
4. **Understand the scores:**
   - **90–100**: Excellent — ready to proceed
   - **70–89**: Good — minor improvements suggested
   - **50–69**: Needs work — significant issues found
   - **Below 50**: Major problems — should not proceed
5. **Act on findings:**
   - Click **"Apply Fix"** next to a recommendation to have the AI address it
   - Click **"Dismiss"** if you disagree with a finding
   - Click **"Request Review"** to ask a human team member to look at it

### Tips:
- AEGIS reports are generated **automatically** when agents complete work
- **Always read the AEGIS report** before approving a milestone gate
- Low scores don't mean failure — they mean the system caught problems early
- Reports are saved forever, creating an **audit trail** of all decisions

---

## Quick Reference — Where Is Everything?

| Tool | What It Does | Web Address |
|------|-------------|-------------|
| **Agor Canvas** | Main workspace, BMC, visual design | `http://localhost:3000` |
| **Paperclip UI** | Venture org chart, agent management | `http://localhost:3002` |
| **Plannotator** | Project plans, timelines, tasks | `http://localhost:3003` |
| **HCOM Dashboard** | Agent communication monitor | `http://localhost:3005` |
| **AEGIS Dashboard** | Quality audit reports | `http://localhost:3007` |
| **Gbrain Dashboard** | Knowledge base and search | `http://localhost:3008` |
| **DenchClaw UI** | Customer relationship management | `http://localhost:3100` |

---

## Getting Help

- **Ask the AI agents** — type a question in any chat box on the canvas
- **Check Gbrain** — search for past decisions and documentation
- **Read AEGIS reports** — they explain what's happening behind the scenes
- **Talk to your Technical Founder** — they handle anything code-related

---

*Welcome to Aigency OS. Your expertise makes the AI smarter. Let's build something great.*
