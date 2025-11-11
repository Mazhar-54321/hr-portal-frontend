# HR Portal Frontend

## Setup


### 1: Clone the Repo 
```bash
git clone https://github.com/Mazhar-54321/hr-portal-frontend.git
```
### 2: Go to the project folder
cd frontend

### 3: Install dependencies
npm install

### 4: Create .env file with:
VITE_API_BASE_URL=http://localhost:5000/api

### 5: Start the development server
npm run dev

### Routes
| Route      | Description                         |
| ---------- | ----------------------------------- |
| /          | Welcome page with Login/Register    |
| /login     | Login page                          |
| /register  | Registration page                   |
| /dashboard | Employee list & actions (protected) |
| /employees | Add/Edit employee (role-based)      |

### Notes
- Dashboard and Employee pages are protected; user must be logged in.
- Role-based access: Admin, Editor, Viewer.
- Logout clears user session.