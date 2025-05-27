#  Book Review API
A RESTful API for managing books and user reviews. Includes features like authentication, book management, submitting reviews (one per user per book), rating aggregation, search, filtering, and pagination.
---

##  Features


- User Registration & Login with JWT Authentication
- Add, View, Search, and Filter Books
- Submit, Update, and Delete Book Reviews
- Average rating calculation per book
- Pagination on book listings
- Case-insensitive Search by Title or Author

---

## 🛠 Project Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Faisal3347/billeasy.git
cd billeasy

##Curl for Registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Faisal Khan","email":"faisal@gmail.com","password":"faisal123"}'

##Curl for Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"faisal@gmail.com","password":"faisal123"}'


##Curl for Add Books
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"The Silent Dawn","author":"Faisal Khan","genre":"Mystery","description":"Mystery novel set in ancient city."}'


##Curl for Get Books
curl http://localhost:3000/api/books?page=1&limit=5&author=Faisal \
  -H "Authorization: Bearer <token>"

##Curl For Search Books
curl http://localhost:3000/api/search?query=silent \
  -H "Authorization: Bearer <token>"


##Curl For Submit review
curl -X POST http://localhost:3000/api/review/<bookId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5, "comment":"Fantastic read!"}'

##Note:- For the Updating and Deleting the review of the Books make sure to pass the review id in the params not the user id


##Curl for Updating Review
curl -X PUT http://localhost:3000/api/review/<reviewId>/user/<userId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":4, "comment":"Updated comment"}'

##Curl for Delete Review
curl -X DELETE http://localhost:3000/api/review/<reviewId>/user/<userId> \
  -H "Authorization: Bearer <token>"




##Database Schema Design
This project uses a MongoDB database with three main collections: Users, Books, and Reviews. The schema is designed to efficiently handle user accounts, book information, and user reviews with ratings.

Collections
1. Users
_id: ObjectId (Primary Key)

name: String — User's full name

email: String — User's unique email address

password: String — Hashed password

createdAt: Date — Account creation timestamp

updatedAt: Date — Account update timestamp

2. Books
_id: ObjectId (Primary Key)

title: String — Title of the book

author: String — Author of the book

genre: String — Book genre/category

description: String — Book description

createdAt: Date — Creation timestamp

updatedAt: Date — Last update timestamp

3. Reviews
_id: ObjectId (Primary Key)

user: ObjectId — Reference to the User who wrote the review (Foreign Key)

book: ObjectId — Reference to the Book being reviewed (Foreign Key)

rating: Number — Rating score (1 to 5)

comment: String — Review text

createdAt: Date — Review creation timestamp

updatedAt: Date — Review update timestamp

Relationships
Each User can write multiple Reviews (One-to-Many).

Each Book can have multiple Reviews (One-to-Many).

Each Review links one User to one Book via their IDs.
