# Project Setup and Launch Instructions

Follow the steps below to set up and run the project locally:

---

## Prerequisites

Before starting, make sure you have the following installed on your system:

- [Vue.js](https://vuejs.org/) 
- [npm](https://www.npmjs.com/)

---

## Setup Instructions

### 1. Install dependencies
Run the following command to install all required dependencies:

```bash
npm install
```

---

### Check .env file

If it doesnt exist, create one at the root of the project.
Add the following lines while replacing the url and key (infos in the report) :
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```
---

## Running the project
```bash
npm run dev
```

