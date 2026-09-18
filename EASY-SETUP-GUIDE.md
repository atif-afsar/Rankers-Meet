# Yasir Ali Classes — Rankers Meet 2026
## Beginner-Friendly "Do This, Then That" Setup Guide

Don't worry if you are not from a technical background! Follow these simple steps in order.

---

## 🧭 The 4 Parts of Your System (In Plain English)

1. **Frontend (`client`)**: The website that students see on their phones, and the dashboard your staff uses.
2. **Backend (`server`)**: The engine that processes registrations, generates QR codes, and checks passes at the gate.
3. **Database (MongoDB)**: The digital ledger where student records, tickets, and check-in times are safely stored.
4. **Email (Resend)**: The service that delivers confirmation tickets to students' inboxes.

---

## 💻 PART 1: Running It on Your Computer Right Now

Everything is already built and configured for you in this workspace.

### Step 1: Start the Backend (The Engine)
1. Open a terminal or PowerShell window.
2. Type these commands one by one and press Enter:
   ```bash
   cd c:\Users\asus\Desktop\Rankers-Meet\server
   npm run dev
   ```
3. You will see:
   ```
   [Database] Connected to MongoDB
   [Server] Rankers Meet 2026 API listening on port 5000
   ```
   *Keep this window open!*

### Step 2: Start the Frontend (The Website)
1. Open a **second** terminal window.
2. Type these commands and press Enter:
   ```bash
   cd c:\Users\asus\Desktop\Rankers-Meet\client
   npm run dev
   ```
3. You will see:
   ```
   ➜ Local: http://localhost:5173/
   ```
   *Keep this window open too!*

### Step 3: Open in Your Browser
Open Chrome, Edge, or Safari and try these links:
- **Public Website**: [http://localhost:5173/rankers-meet](http://localhost:5173/rankers-meet)
- **Student Registration**: [http://localhost:5173/rankers-meet/register](http://localhost:5173/rankers-meet/register)
- **Admin Login**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - **Email**: `admin@yasiraliclasses.in`
  - **Password**: `Admin@12345`
- **Gate QR Scanner**: [http://localhost:5173/admin/check-in](http://localhost:5173/admin/check-in)

---

## ☁️ PART 2: Setting Up Free Cloud Database (MongoDB Atlas)
*(Takes ~5 minutes. Do this so your data stays online forever).*

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **"Build a Database"** and select the **FREE (M0)** option.
3. Choose **AWS** and any region near you (e.g., **Mumbai - ap-south-1**). Click **"Create"**.
4. **Create a Database User**:
   - Username: `yasir_admin`
   - Password: Choose a password (e.g. `YasirMeet2026!`) — *write this down!*
   - Click **"Create User"**.
5. **Set Network Access**:
   - In the left sidebar, click **"Network Access"**.
   - Click **"Add IP Address"**.
   - Click **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   - Click **"Confirm"**.
6. **Get Your Connection Link**:
   - In the left sidebar, click **"Database"**.
   - Click the green **"Connect"** button next to your cluster.
   - Click **"Drivers"** (Node.js).
   - Copy the link that looks like this:
     ```
     mongodb+srv://yasir_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
7. **Paste it into your project**:
   - Open file `server/.env` on your computer.
   - Replace the `MONGODB_URI=` line with your copied link (replace `<password>` with the password you wrote down in step 4).
   - Add `/rankers_meet` before the `?` mark so it looks like:
     ```env
     MONGODB_URI=mongodb+srv://yasir_admin:YasirMeet2026!@cluster0.abcde.mongodb.net/rankers_meet?retryWrites=true&w=majority
     ```

---

## ✉️ PART 3: Setting Up Free Email Service (Resend)
*(Takes ~3 minutes. Sends emails with QR passes to students).*

> **Note**: Even if you skip this step, registrations still work 100%! The system automatically runs in "mock mode" and saves every record safely.

1. Go to [https://resend.com](https://resend.com) and sign up with your email.
2. In the Resend dashboard, click **"API Keys"** on the left menu.
3. Click **"Create API Key"**. Name it `Rankers Meet` and click **"Add"**.
4. Copy the key starting with `re_...`.
5. Open `server/.env` in your code editor and paste it:
   ```env
   RESEND_API_KEY=re_123456789abcdef...
   ```
6. *(Optional for your domain)*: If you want emails sent from `no-reply@yasiraliclasses.in`:
   - In Resend, click **"Domains"** -> **"Add Domain"** (`yasiraliclasses.in`).
   - Resend gives you 3 DNS lines. Copy and paste them into your domain registrar (GoDaddy / Hostinger / Cloudflare).

---

## 🚀 PART 4: Putting It Live on the Internet (Free Hosting)

We will put the **Backend on Render** and the **Frontend on Vercel**. Both have generous free plans.

### Step 1: Push Your Code to GitHub
1. Go to [https://github.com](https://github.com) and create a free account.
2. Click **"New Repository"**, name it `rankers-meet`, and make it **Private**.
3. Push your code folder to GitHub.

---

### Step 2: Deploy Backend on Render (The Brain)
1. Go to [https://render.com](https://render.com) and sign in using your GitHub account.
2. Click **"New +"** -> **"Web Service"**.
3. Choose your `rankers-meet` repository.
4. Fill in these exact settings:
   - **Name**: `rankers-meet-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`
5. Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**:
   - `PORT` = `5000`
   - `MONGODB_URI` = *(Your MongoDB Atlas link from Part 2)*
   - `JWT_SECRET` = `super_secret_rankers_meet_jwt_key_2026_yasir_ali_classes`
   - `RESEND_API_KEY` = *(Your Resend key from Part 3, or leave blank)*
   - `EMAIL_FROM` = `Rankers Meet 2026 <no-reply@yasiraliclasses.in>`
   - `CLIENT_URL` = `https://yasiraliclasses.in` *(or your Vercel link)*
6. Click **"Deploy Web Service"**.
7. In ~2 minutes, Render will give you a live link like:
   `https://rankers-meet-api.onrender.com`
   *(Copy this link!)*

---

### Step 3: Deploy Frontend on Vercel (The Website)
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** -> **"Project"**.
3. Select your `rankers-meet` repository.
4. Under **"Root Directory"**, click **Edit** and select `client`. Click **Continue**.
5. Expand **"Environment Variables"** and add these two:
   - `VITE_API_URL` = `https://rankers-meet-api.onrender.com/api` *(Your Render link + `/api`)*
   - `VITE_SOCKET_URL` = `https://rankers-meet-api.onrender.com` *(Your Render link)*
6. Click **"Deploy"**.
7. In ~60 seconds, Vercel gives you a live website link like:
   `https://rankers-meet.vercel.app`

---

## 🌐 PART 5: Connecting Your Official Domain (`yasiraliclasses.in`)

If you want the website at `yasiraliclasses.in/rankers-meet`:

1. In **Vercel**:
   - Go to your Project **Settings** -> **Domains**.
   - Type `yasiraliclasses.in` or a subdomain like `meet.yasiraliclasses.in`.
   - Vercel will show you 1 CNAME record to add.
2. In **GoDaddy / Hostinger / Cloudflare** (where you bought your domain):
   - Go to **DNS Management**.
   - Add a **CNAME Record**:
     - Name / Host: `meet` (or `@`)
     - Value / Target: `cname.vercel-dns.com`
3. That's it! In a few minutes, your site is live for the entire world at:
   `https://yasiraliclasses.in/rankers-meet`

---

## 📱 PART 6: How Staff Uses the Scanner on Event Day

1. Any staff member opens their phone browser (Safari or Chrome).
2. Goes to: `https://yasiraliclasses.in/admin/login`
3. Logs in with:
   - Email: `staff@yasiraliclasses.in`
   - Password: `Staff@12345`
4. Clicks **"QR Check-in"** in the menu (or goes to `/admin/check-in`).
5. When the phone asks **"Allow camera?"**, taps **"Allow"**.
6. Points camera at students' printed or phone tickets.
   - 🟢 **BEEP + GREEN**: Valid entry! Shows student name & allowed guest count.
   - 🔴 **BUZZ + RED**: Duplicate or already used pass!
7. Taps **"Scan Next Attendee"** to scan the next student.

---

## 🆘 Quick Troubleshooting

| Problem | Cause | Quick Fix |
| :--- | :--- | :--- |
| **"Network Error" when registering** | Backend is not running or wrong link | Make sure Render backend service is Active and `VITE_API_URL` has `/api` at the end |
| **Camera not opening on phone** | Browser camera permission blocked | In your phone browser settings, tap the padlock icon near the URL and enable "Camera" |
| **Student has dead phone battery** | Cannot show QR pass | Use the "Manual Check-in" search box below the camera. Type their 10-digit mobile number and click "Verify" |
| **Want to export student data** | Need list in Excel | Log in as Admin, go to "Registration Table", click the green "Export Excel (.xlsx)" button |
