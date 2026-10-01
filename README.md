# FairShare - Smart Restaurant Bill Splitter 🍽️

A modern, intuitive web application designed to eliminate the awkwardness of splitting restaurant bills among friends. Built with a clean UI and Firebase for history tracking, it handles custom tips, multi-currency support, and itemized exceptions (like when someone skips a starter).

## 🚀 Repository
[GitHub - crazxy851/Chaos-Engineering](https://github.com/crazxy851/Chaos-Engineering)

## ✨ Features
- **Smart Bill Splitting:** Divide the total bill effortlessly among any number of people.
- **Itemized Deductions (Who Ate What?):** Add specific items (like a shared starter or an expensive drink) and assign them to specific people so everyone pays exactly their fair share.
- **Flexible Tipping:** Quick-select tip percentages (5%, 10%, 15%, 20%) or enter a custom amount.
- **Multi-Currency Support:** Switch between popular currencies dynamically ($, €, £, ₹).
- **Persistent History:** Saves your past split bills along with the restaurant name securely using Firebase, so you can always check who owes what later.
- **Responsive Design:** Beautiful, mobile-friendly card-based UI.

## 📁 Project Structure
The application has been refactored for better maintainability and separation of concerns:
- `index.html`: Contains the core structure and layout of the application.
- `style.css`: Custom styling, responsive rules, and UI enhancements.
- `script.js`: Handles all the application logic, mathematical calculations, UI interactivity, and Firebase integration.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Tailwind CSS (via CDN) & Custom CSS (`style.css`)
- **Database:** Firebase Realtime Database / Firestore (for tracking history)
- **Icons:** FontAwesome / Inline SVGs

## 💻 Getting Started

### Prerequisites
All you need is a modern web browser. No complex build tools or Node.js environment is required to run the application locally.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/crazxy851/Chaos-Engineering.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Chaos-Engineering
   ```
3. Open the `index.html` file in your preferred web browser.

## 🔧 Firebase Configuration (For History Feature)
To enable the **History** tracking feature, you need to connect your own Firebase backend:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project and register a web app.
3. Copy your Firebase config object.
4. Replace the placeholder Firebase configuration inside your `script.js` file with your actual credentials.

## 💡 How to Use
1. Enter the **Restaurant Name** and select your preferred **Currency**.
2. Input the **Total Bill Amount** and the **Number of People**.
3. Select or enter a **Tip Percentage**.
4. *(Optional)* Use the **Itemized Breakdowns** section if someone ordered something extra or skipped a dish. Specify the item cost and how many people shared it.
5. Click **Calculate Final Split** to generate a clean breakdown of exactly how much each person owes.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/crazxy851/Chaos-Engineering/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
