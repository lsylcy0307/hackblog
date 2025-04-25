### **1\. Project Proposal**

I would like to develop a Hack4Impact Engineering Blog. 

Registered author users can create and write articles using flexible style features (text, font, images). They have an author profile page to start writing a new article and manage their previous articles. They should be able to view, edit, and delete their own articles. 

Admin users can manage the accounts and their status (author or admin). They can view, edit, and delete any articles. They can also pin articles to highlight in the blog.

Non-registered viewers can browse the articles and view the profiles of the authors without a login. 

### **2\. Technical Stack**

* MongoDB \+ Express \+ Node: We intend to use MongoDB for storage of articles and registered users.    
* Vercel: Both the backend and frontend will be deployed on Vercel (in different deployments of course)   
* React: The frontend will be all react. The app has been created using npx create-react-app to begin with.

### **3\. Data Models**

Article Model   
\- Title (String)    
\- Published\_Date (Datetime)    
\- Last\_Edited (Datetime)    
\- Authors\[\] (Foreign Key)  
\- Cover\_Picture\_URL (String)  
\- Article\_Content (\*Determine in order to maintain the article format)  
\- Pinned (Boolean)

User Model  
\- Username (String)    
\- Name (String)    
\- Linkedin\_URL (String)    
\- Personal\_Bio (String)  
\- Class\_Year (String)  
\- Email (String)   
\- Github\_URL (String)  
\- Articles\[\] (Foreign Key)   
\- Profile\_Picture\_URL (String)    
\- Admin\_Status (String)

### **4\. Backend Development Steps**

1\. Set up the file directory and all necessary introductory files for the project. Install any necessary components.    
2\. Create and define our different file models    
3\. Build out authentication and sign up/login framework.   
4\. Build the controllers, middleware, and routes needed to add, remove, and edit each of our models. Then, create routes to query the lists of them.  

### **5\. Frontend Development Steps**

1\. Create a file directory with images, components, data and pages. Create a global API variable that is set and can be edited for where the server is hosted    
2\. Develop a sign up/log in page which follows the authentication guidelines laid out above    
3\. Develop a main page from which users can view the pinned articles, followed by the tabs to select and view all articles, or articles tagged products, engineering, impact, or nonprofits.  
4\. Develop a component for an article, which includes the article’s tag, title, published date, authors, first few lines of the article, and a cover picture.  
4\. Develop a tab on footer from which registered users (author or admin) can log in.  
5\. Develop a tab on the header from which logged in users (authors or admin) can view and manage their profile and view and manage their articles (add, delete, edit)  
6\. Develop a page from which registered users can write a new article.

### **6\. Special Considerations**

1\. We want the frontend to be as clean and modern as possible, considering our target audience is 16-24 year olds. Take heavy inspiration from the UI of Strip Engineering Blog.  
2\. We want the frontend to feel responsive and provide micro feedback 

### **7\. API Keys and Configuration**

MongoDB connection URI: mongodb+srv://yeonlee:\<db\_password\>@[cluster0.tlqrppp.mongodb.net/?retryWrites=true\&w=majority\&appName=Cluster0](http://cluster0.tlqrppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0)
