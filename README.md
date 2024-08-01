# Transaction Broadcasting

## Getting Started

To get started with this project, follow these simple steps:

### 1. Clone the Repository

```bash
git clone git@github.com:GaiKT/transaction-broadcasting.git
# or
git clone https://github.com/GaiKT/transaction-broadcasting.git
```
### 2. Install Dependencies
Navigate to the project directory and install all the required packages:

```bashbash
npm install
```
### 3. Run the Project
Start the development server:

```bash
npm run dev
```
Open http://localhost:3000 in your browser to see the result.

# Main Idea for Handling Each Transaction Status
Here’s the core approach for managing transaction statuses in this application:

### 1. Initial Status Setup:

- After the transaction is successfully created, add the status key to "Pending" first.
  
### 2. Polling for Status Updates:

- Implement using useEffect to send a GET request every 20 seconds.
- Use .map() to loop transactions and check which ones are still in "PENDING".
- For pending transactions, send a request to GET the updated status.
  
### 3. Automatic Updates:

- The function executes every 20 seconds and stops when all transactions are no longer in the "PENDING" state.
- New transactions trigger the function again to ensure their status is updated.
  
