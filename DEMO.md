# Bridge 1.0 prototype: demo script

Four short journeys that show Bridge as one connected platform. About 15 minutes in total.

**Link:** https://bridge-platform-eovr.vercel.app

## Before you start

1. Use a laptop or desktop browser, full width. Everything also works on a phone, but the dashboards read best on a big screen.
2. Open https://bridge-platform-eovr.vercel.app/sign-in and press **Reset demo data** at the bottom. This clears anything from a previous run.
3. **Stay in the same browser tab for the whole demo.** The prototype keeps demo actions (applications, approvals, verifications) in that tab only. Use **Switch user** (account menu, top right of any dashboard) to move between people, rather than opening new tabs.

What to say once, at the start:

> This is a clickable prototype. All people, companies and figures are samples, and they're labelled as such. Anything still waiting for Bridge's approval carries a **Draft** badge. Nothing you do here is sent anywhere.

---

## Journey 1: The public story (3 minutes)

*Shows: positioning, trust, programmes driven by dates.*

1. **Homepage.** Scroll slowly from the hero.
   - Hero: "From Technical Skills to Real-World Opportunity." The visual shows a learner's Skills Passport connected to disciplines, a school, an industry partner and an opportunity.
   - Trust section: the four figures carry **Draft** badges. *"These wait for Bridge to confirm them. You'll see me approve one later."*
   - Programmes: *"Status is never typed by hand. It's worked out from the dates every time the page loads."* Point at Open, Upcoming and Closed.
   - Bridge AI: *"Shown as a product preview, clearly in development. There's no chat box, because nothing is live yet."*
2. Open **Ventures Lab** in the header, then **View programme and apply**.
3. On the application form, press **Submit application** without filling anything in. Show the error list that links to each field. *"Validation, loading and success states are all there."*
   - You can skip completing it; Journey 2 starts fresh.

## Journey 2: A learner proves a skill (4 minutes)

*Shows: the Skills Passport, and how school and student connect.*

1. Go to **Login** and choose **Continue as Diane M.** (student).
2. Walk through the dashboard: courses, the Skills Passport card (14 verified skills), opportunities matched to her skills (*"No match percentages; we name the skills instead"*), and the weekly goal.
3. Press **Add New Skill**, type `Docker Compose` and press **Add skill**. It appears as **Pending verification**.
4. Open the account menu (top right), choose **Switch user**, then **Continue as Jean-Paul K.** (school).
   - The bell shows *"Diane M. asked you to verify Docker Compose"*.
   - In **Verification requests**, press **Review** on Docker Compose, then **Verify skill**.
5. Switch back to **Diane M.** The bell shows *"Your Docker Compose skill was verified by Sample TVET School"*, and **Skills Passport** now lists it as verified.
6. Optional: on Skills Passport press **View public version**. This is the shareable passport: verified skills, projects and certificates only, never contact details.

## Journey 3: From talent to hire (4 minutes)

*Shows: student applies, company discovers and progresses her, student sees it.*

1. As **Diane M.**, on the dashboard press **Apply** next to *Back-End Developer Intern, Sample Tech Company*, then **Send application**.
2. Switch to **Grace N.** (company). The bell shows *"Diane M. applied to Back-End Developer Intern"*.
3. Open **Talent discovery**. Show the filters (discipline, verified only, availability), then **View profile** on Diane and **Add to shortlist**. *"Companies only see what learners have chosen to make public."*
4. Open **Applicants**, press **Review** on Diane, and set **Move to stage** to *Interview*. Point out the note: Bridge never guarantees a match or a placement.
5. Switch back to **Diane M.** The bell shows three notices: her passport was viewed, she was shortlisted, and her application moved to Interview. **Opportunities** shows her tracker at *In review · Interview*.

## Journey 4: Bridge stays in control (3 minutes)

*Shows: approvals, programme management and reporting.*

1. Switch to **Eric H.** (admin).
2. Open **Content approvals** and press **Approve** on *1,000+ students in the Bridge community*.
3. Open **Programmes**, press **Edit** on *Internship and Training Placement: January intake*, then **Open applications today** and **Save programme**. The status preview changes to Open as you do it.
4. Choose **Back to website** in the account menu and scroll to the homepage:
   - *1,000+* no longer has a Draft badge; the other three still do.
   - The January intake now shows as **Open** with an **Apply now** button.
5. Optional: back in the admin dashboard, open **Reports**. The figures are labelled *Sample figures, not real data*. Each chart can be shown as a table.

## Optional extras (if there's time)

- **Course and lesson:** as Diane, press **Up next** on the overview. The lesson opens; **Mark as complete** moves the course progress.
- **Messages:** as Grace (company), open Diane's application and send her a message. Switch to Diane: it's in **Messages**, with a notification.
- **Privacy:** as Diane, open **Settings** and turn off the public passport link. Her passport page now says it's private, and companies no longer see her availability.

## Close

> Everything you've seen runs on one shared set of sample data, so the story is the same whichever role you sign in as. Next steps are Bridge's real content: approved figures, programme dates, stories and official contact details. Then the decisions on hosting, booking, analytics and login.

Press **Reset demo data** on the sign-in page before the next run.

---

## Good to know

- **Phone or tablet:** every page works down to 375px wide. The dashboard menu moves into the menu button.
- **If something looks "stuck":** you've probably switched tabs. Go back to the original tab, or reset and start the journey again.
- **What isn't real:** accounts and passwords, the database, emails, payments, the booking tool, and Bridge AI. Each is faked and labelled, so a real service can replace it later without redesigning.
