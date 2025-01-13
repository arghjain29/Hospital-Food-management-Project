# Hospital Food Delivery Management System

This is a **Full-Stack** project designed to manage meal deliveries in a hospital setting. The system allows the management of patient details, diet charts, assigned tasks for pantry managers, and delivery status for staff, all in one integrated platform.

## Features

### **User Roles and Access**
- **Admin/Manager**:
  - View an overview of tasks and deliveries.
  - Add new patients and delivery personnel.

- **Pantry Manager**:
  - View and manage assigned tasks.
  - Mark meals as prepared and delivered.
  - Manage delivery tasks and assign them to delivery personnel.
  
- **Delivery Staff**:
  - View pending deliveries and assigned tasks.
  - Mark meals as delivered once completed.

### **Patient Management**
- **Patient List**: 
  - View and manage a list of patients.
  - Each patient has associated details such as room number, assigned meal type, and diet chart.
  - Ability to assign meals to patients and add new patients to the system.

### **Diet Chart Management**
- **Diet Chart**:
  - View and edit diet charts for patients, including morning, evening, and night meals, ingredients, and special instructions.
  - Editable fields for diet chart meals and ingredients.
  - Option to add a diet chart if none exists for a patient.

### **Meal Task Management**
- **Assigned Tasks**: 
  - View tasks assigned to pantry staff, including meal types and associated patient information.
  - Mark meals as prepared for delivery.

- **Pending Deliveries**: 
  - View pending deliveries.
  - Assign delivery personnel to each delivery.

### **Delivery Personnel Management**
- **Delivery Staff Management**: 
  - Add new delivery personnel with name, email, and password fields.
  - Assign deliveries to available delivery staff.

### **Responsive Design**
- Fully responsive design for use on desktops, tablets, and mobile devices.
- Clean and organized UI with clear navigation for various user roles.

### **Modals for Interaction**
- Modals are used throughout the app for adding new patients, editing diet charts, assigning tasks, and managing delivery personnel.
- **Edit Diet Chart Modal**: Allows editing of patient-specific diet charts.
- **Add Delivery Personnel Modal**: Allows adding new delivery staff with necessary details.

### **Task Assignment**
- Assign specific tasks to delivery boys and pantry staff.
- Clear visual indicators when a task or person is selected for a specific action.

## Tech Stack

### **Frontend**:
- React.js
- Tailwind CSS (for styling)
  
### **Backend**:
- Node.js with Express.js
- MongoDB (for data storage)
- JWT Authentication

### **Full-Stack Architecture**:
This is a full-stack project where the frontend and backend communicate via RESTful APIs. The backend handles data storage and authentication, while the frontend provides a user-friendly interface for interaction.

### **Deployment**:
<!-- - Deployed on a Node.js server (e.g., Heroku or similar) -->


### Prerequisites

- Node.js (version 14.x or above)
- MongoDB instance

