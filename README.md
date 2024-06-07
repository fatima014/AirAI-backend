# AirAI Backend

This repository contains the backend code for the AirAI project. You can check out the project [here](https://air-ai-frontend.vercel.app/). 


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your_username/airai-backend.git
    cd airai-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
   
   Create a `.env` file in the root directory and add the following variables:
   
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_PORT=your_database_port
   ```
   
4. Start the server:

    ```bash
    npm start
    ```

## Endpoints

- **GET /api/no2/:date**: Fetch NO2 data for a specific date.
- **GET /api/so2/:date**: Fetch SO2 data for a specific date.
- **GET /api/o3/:date**: Fetch O3 data for a specific date.
- **GET /api/co/:date**: Fetch CO data for a specific date.
- **GET /api/forecast-next-three-days?latitude=xx&longitude=xx**: Fetch forecast data for the next three days for given coordinates.

## Technologies Used

- Node.js
- Express.js
- Amazon RDS(MySQL)


