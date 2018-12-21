# Hotel_League

This project is still in development!

The owner wanted the following features:
  -He/She would have to be able to create, delete, edit every hotel. Upload, delete every image. Create, delete, edit rooms to hotels.
  -The Hotel owners would have to be able to do everything of the above, but only for their own hotel.
  -Normal users should be able to comment, creating a short review.

The project was created for a Hotel League featuring multiple hotels. The site's owner can register admin level users, who can create a new hotel, upload images, create rooms, modify their own hotels. The site's owner can modify every hotel.

Image uploading works with AWS. Uploaded image data, like the key, id, mime-type gets saved to the room's or hotel's database. Deleting a hotel will delete every image from the AWS Bucket associated with the hotel. 

Future updates:
  -Search functionality
  -Google OAuth 
  -Comments/Reviews
  -General bug fixing
  
Technologies used: 
  -NodeJS
  -Express
  -Passport
  -Mongo
  -Multer
  -Amazon Web Services
  -Handlebars
  -HTML
  -Materialize CSS
  
Please, if you have any questions, feel free to ask, I am more than happy to demo the website for you.
