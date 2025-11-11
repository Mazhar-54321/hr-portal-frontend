# HR Portal Frontend

## Setup

1. Clone the repo  
```bash
git clone https://github.com/Mazhar-54321/hr-portal-frontend.git
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
Routes
| Route      | Description                         |
| ---------- | ----------------------------------- |
| /          | Welcome page with Login/Register    |
| /login     | Login page                          |
| /register  | Registration page                   |
| /dashboard | Employee list & actions (protected) |
| /employees | Add/Edit employee (role-based)      |

