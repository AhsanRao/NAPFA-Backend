# NAPFA Backend

This project is the backend for the NAPFA (National Physical Fitness Assessment) system, built using Node.js, Express, and Firebase Firestore. It provides APIs to manage schools, licenses, students, and admin logs.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AhsanRao/NAPFA-Backend.git
    cd napfa-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up Firebase:
    - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
    - Download the `serviceAccountKey.json` file from your Firebase project settings and place it in the root directory of the project.
    - Update the Firebase database URL in `server.js`.

4. Start the server:
    ```bash
    node server.js
    ```

## API Endpoints

### Schools

- **Create a new school**
  - `POST /api/schools`
  - Body:
    ```json
    {
      "schoolName": "Example School",
      "email": "school@example.com"
    }
    ```

- **Get all schools**
  - `GET /api/schools`

- **Get a school by ID**
  - `GET /api/schools/:id`

- **Update a school by ID**
  - `PUT /api/schools/:id`
  - Body:
    ```json
    {
      "schoolName": "Updated School Name",
      "email": "updated@example.com"
    }
    ```

- **Delete a school by ID**
  - `DELETE /api/schools/:id`

### Licenses

- **Create a new license for a school**
  - `POST /api/schools/:schoolId/licenses`
  - Body:
    ```json
    {
      "status": "active",
      "issuedDate": "2023-01-01T00:00:00Z",
      "expiryDate": "2024-01-01T00:00:00Z"
    }
    ```

- **Get all licenses for a school**
  - `GET /api/schools/:schoolId/licenses`

- **Get a license by ID**
  - `GET /api/schools/:schoolId/licenses/:licenseId`

- **Update a license by ID**
  - `PUT /api/schools/:schoolId/licenses/:licenseId`
  - Body:
    ```json
    {
      "status": "expired",
      "issuedDate": "2023-01-01T00:00:00Z",
      "expiryDate": "2024-01-01T00:00:00Z"
    }
    ```

- **Delete a license by ID**
  - `DELETE /api/schools/:schoolId/licenses/:licenseId`

- **Check license key and update device name**
  - `POST /api/licenses/check/:licenseKey`
  - Body:
    ```json
    {
      "deviceName": "Device123"
    }
    ```

### Students

- **Create or update multiple students**
  - `POST /api/schools/:schoolId/students`
  - Body:
    ```json
    [
      {
        "id": "studentID1",
        "name": "John Doe",
        "class": "5th Grade",
        "gender": "Male",
        "dob": "2010-05-01",
        "attendanceStatus": "Present",
        "sitUpReps": 20,
        "broadJumpCm": 150,
        "sitAndReachCm": 30,
        "pullUpReps": 10,
        "shuttleRunSec": 20,
        "runTime": 600,
        "pftTestDate": "2023-01-15",
        "uploadDate": "2023-01-16T00:00:00Z"
      }
    ]
    ```

- **Get all students for a school**
  - `GET /api/schools/:schoolId/students`

- **Get a student by ID**
  - `GET /api/schools/:schoolId/students/:id`

- **Update a student by ID**
  - `PUT /api/schools/:schoolId/students/:id`
  - Body:
    ```json
    {
      "name": "John Doe Updated",
      "class": "6th Grade",
      "gender": "Male",
      "dob": "2010-05-01",
      "attendanceStatus": "Present",
      "sitUpReps": 22,
      "broadJumpCm": 155,
      "sitAndReachCm": 32,
      "pullUpReps": 12,
      "shuttleRunSec": 19,
      "runTime": 590,
      "pftTestDate": "2023-01-16",
      "uploadDate": "2023-01-17T00:00:00Z"
    }
    ```

- **Delete a student by ID**
  - `DELETE /api/schools/:schoolId/students/:id`

### Admin Logs

- **Create a new admin log**
  - `POST /api/schools/:schoolId/adminlogs`
  - Body:
    ```json
    {
      "action": "Created new student record",
      "details": {
        "studentId": "studentID1",
        "name": "John Doe"
      }
    }
    ```

- **Get all admin logs for a school**
  - `GET /api/schools/:schoolId/adminlogs`

- **Get an admin log by ID**
  - `GET /api/schools/:schoolId/adminlogs/:logId`

- **Update an admin log by ID**
  - `PUT /api/schools/:schoolId/adminlogs/:logId`
  - Body:
    ```json
    {
      "action": "Updated student record",
      "timestamp": "2023-01-02T00:00:00Z",
      "details": {
        "studentId": "studentID1",
        "name": "John Doe Updated"
      }
    }
    ```

- **Delete an admin log by ID**
  - `DELETE /api/schools/:schoolId/adminlogs/:logId`

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
