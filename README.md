Notes System
## **Notes System Backend API**

A system which gives the user the features of creating notes,viewing and sharing notes with other users.
Each user registers his own account and is authenticated upon loginto be granted access to his account where he could control his notes.
The user could share his notes with other users or keep it private and be viewed only by him.
Each note has a title,description and an image.Users also has the ability to edit their account information as email , password and username.
Users also has the abiity to deactivate their accounts.

## **Project Structure** 

 Server packages are created to apply **Domain-Driven Design - Layered Architecture** as shown below:

```
src
|
└─── views              # Store all the views(templates) (UI layer)
└─── public             # Store static files (UI layer)
└─── routes             # Route controllers for all the endpoints of the app
└─── services           # Responsible for creation and retrieval of domain objects, as well as calling their methods to satisfy user commands (Application layer)
└─── entities           # Database models and contains all business logic (Domain layer)
└─── repositories       # Managing entities in the database (Infrastructure layer)
└─── app.js             # The "real" app entry point
```
## **Prerequisites**

Note Images are not saved in the database but rather is saved in a file directory and retrieved using nginx web server.This approach is better as no images are saved in the DB not to worry about size and retrieval issues but images are retrieved through the webserver without the nodeserver knowing of the existence of images. For that to work a nginx webServer should be working with the project This is a [basic tutorial](https://www.netguru.com/codestories/nginx-tutorial-basics-concepts) to download and start nginx. Next step is to let the nginx server search fo requested images in the images directory.This could be done by editting the config file in **nginx/sites-available/default**.Attached in this repo is a [config file](https://bitbucket.org/AbdallahElMaradny/notes-system/src/master/config.md) ,it could be used by changing the directories with your own local directories

## **ER Diagram**##
![ER Diagram](https://i.ibb.co/7XjHHvV/Screenshot-from-2020-04-30-22-12-40.png)

## **API documentation**

**Register a new user**
----
  Returns token for registered user.

* **URL**
	* /register

* **Method:**
	* POST`
  
*  **URL Params**
	*	**No Params**
        
*  **Request Body**
    * User Info(email,password,username,fullname) 	
          
    
* **Headers**
    * No Headers
         
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `{
                token: token,
                id: userEntity.id,
                iat: iat,
                exp: exp
            }`
 
* **Error Response:**
      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`
      * **Content:** `{ error : "Email Already exists" }`


**Login A user**
----
  Returns token for registered user.

* **URL**
	* /login

* **Method:**
	* POST
  
*  **URL Params**
	*	**No Params**
    
*  **Request Body**
    * User Info(email,password) 	
          
* **Headers**
    * No Headers
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `{
                token: token,
                id: userEntity.id,
                iat: iat,
                exp: exp
            }`
 
* **Error Response:**
      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`

      * **Code:** 404 Not Found
      * **Content:** `{ error : "User Doesn't Exist" }`
       
      * **Code:** 401 UNAUTHORIZED 
      * **Content:** `{ error : "You are unauthorized to make this request." }`


**Deactivate a user account**
----
  deletes a user account and returns a status code confirming.

* **URL**
	* /user/:userId

* **Method:**
	* DELETE
  
*  **URL Params**
	*	**required**
        * userId
    
*  **Request Body**
    * **No Body**	
          
* **Headers**
    * Authorization
        * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
 
* **Error Response:**
      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`

      * **Code:** 401 UNAUTHORIZED 
      * **Content:** `{ error : "You are unauthorized to make this request." }`

**Edit information for a user**
----
  returns the editted information of an existing user

* **URL**
	* /user/:userId

* **Method:**
	* PUT
  
*  **URL Params**
	*	**required**
        * userId
    
*  **Request Body**
    * User Info(email,password,fullname,username) 	
          
* **Headers**
    * Authorization
        * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** {email:email,username:username,fullname:fullname}

* **Error Response:**
      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`

      * **Code:** 401 UNAUTHORIZED 
      * **Content:** `{ error : "You are unauthorized to make this request." }`


**Get information of an existing user**
----
  returns account info of a user

* **URL**
	* /user/:userId

* **Method:**
	* PUT
  
*  **URL Params**
	*	**required**
        * userId
    
* **Headers**
    * Authorization
        * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** {email:email,username:username,fullname:fullname}
 
* **Error Response:**
      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`

      * **Code:** 401 UNAUTHORIZED 
      * **Content:** `{ error : "You are unauthorized to make this request." }`



**Save A Note For A User**
----
  Returns json data of the added note.

* **URL**
	* /note/:userId

* **Method:**
	* POST`
  
*  **URL Params**
	*	**Required:**
    	 *	userId
       
*  **Request Body**
    * req body(title,description)
    * file(image)
    

* **Headers**
    * Authorization
          * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `[{ title : "note title", description : "note description" ,imagePath:"/public/:userid/:noteid"}]`
 
* **Error Response:**
      * **Code:** 500 Internal Server Error<br />
      * **Content:** `{ error : "Internal Server Error Occured" }`

      * **Code:** 404 Not Found<br />
      * **Content:** `{ error : "User Doesn't Exist" }`
       
      * **Code:** 401 UNAUTHORIZED <br />
      * **Content:** `{ error : "You are unauthorized to make this request." }`



**Get All Sharable notes**
----
  Returns json data of all sharable notes.

* **URL**
      * /note/notes/:userId

* **Method:**
      * GET
  
*  **URL Params**
	   * **Required:**
	       * userId
   
* **Headers**
      * Authorization
         * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `[{ title : "note title", description : "note description" ,imagePath:"/public/:userid/:noteid"}]`
 
* **Error Response:**

      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`	
   
       * **Code:** 401 UNAUTHORIZED 
       * **Content:** `{ error : "You are unauthorized to make this request." }`
	   

**Get user notes**
----
  Returns json data of user notes.

* **URL**
      * /note/:userId

* **Method:**
      * GET
  
*  **URL Params**
	   * **Required:**
	       * userId
   
* **Headers**
      * Authorization
         * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `[{ title : "note title", description : "note description" ,imagePath:"/public/:userid/:noteid"}]`
 
* **Error Response:**

      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`	
   
       * **Code:** 401 UNAUTHORIZED 
       * **Content:** `{ error : "You are unauthorized to make this request." }`	   
	  
	
**Delete a note for a user**
----
  Route used to delete a note for a user.

* **URL**
      * /note/:noteId/:userId

* **Method:**
      * DELETE
  
*  **URL Params**
	   * **Required:**
	       * userId
		   * noteId
   
* **Headers**
      * Authorization
         * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
 
* **Error Response:**

      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`	
   
       * **Code:** 401 UNAUTHORIZED 
       * **Content:** `{ error : "You are unauthorized to make this request." }`	   
	 
	 
**Edit a note for a user**
----
  returns the editted note data

* **URL**
      * /note/:noteId/:userId

* **Method:**
      * PUT
  
*  **URL Params**
	   * **Required:**
	       * userId
		   * noteId

*  **Request Body**
    * req body(title,description)
    * file(image)
   
* **Headers**
      * Authorization
         * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `[{ title : "note title", description : "note description" ,imagePath:"/public/:userid/:noteid"}]`

 
* **Error Response:**

      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`	
   
       * **Code:** 401 UNAUTHORIZED 
       * **Content:** `{ error : "You are unauthorized to make this request." }`	   
	   
	 
**Edit the sharability of specific note**
----
  returns the editted note 

* **URL**
      * /note/:noteId/sharable/:userId

* **Method:**
      * PUT
  
*  **URL Params**
	   * **Required:**
	       * userId
		   * noteId
	   * **Query Params**
	   	   * sharability
   
* **Headers**
      * Authorization
         * JWT token
      
* **Success Response:**

      * **Code:** 200 OK
      * **Content:** `[{ title : "note title", description : "note description" ,imagePath:"/public/:userid/:noteid"}]`
 
* **Error Response:**

      * **Code:** 500 Internal Server Error
      * **Content:** `{ error : "Internal Server Error Occured" }`	
   
       * **Code:** 401 UNAUTHORIZED 
       * **Content:** `{ error : "You are unauthorized to make this request." }`	   
	   
	 	   