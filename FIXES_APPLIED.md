# StudyPlanner fixes applied

## Changes
- Login now requires a registered account and valid password; unknown accounts cannot open the dashboard.
- Signup waits for the API response and reports duplicate accounts/database errors instead of silently creating a local-only account.
- Added server-side session tokens and scoped task, subject, note, exam, calendar, and focus records to the logged-in account.
- Namespaced planner data in browser storage by account so one account's subjects/tasks/focus history do not appear in another account's session.
- Aligned Calendar and Focus Timer sidebar styling with the Dashboard sidebar.
- Changed the landing-page feature cards to a balanced responsive 3-column layout (2 columns on tablets, 1 on mobile).

## Run
1. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string.
2. Run `npm install`.
3. Ensure MongoDB is running / reachable.
4. Run `npm start`.
5. Open `http://localhost:5000`, create an account, then log in.

Note: Existing records created before account scoping are not automatically assigned to an account, so they will not appear in the newly scoped views. Back up your database before applying schema changes to an existing database.
