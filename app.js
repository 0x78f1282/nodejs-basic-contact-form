const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', {layout:false});
  app.locals.layout = false;
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Email: ${req.body.email}</li>
      <li>Message: ${req.body.message}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>

    <img src="https://cdn.discordapp.com/attachments/774459256790581248/1104943850474180639/image.png">
  `;
 // Creamos una funcion re-utilizable usando el protocolo SMTP con nodemailer
const transporter = nodemailer.createTransport({
service: 'gmail',
  auth: {
    user: 'fragancecsa@gmail.com',
    pass: 'ewqmvhxgyihsuzrf' 
        }
});

// Set up de los datos del correo
let mailOptions = {
  from: '"undeƒined" <fragancecsa@gmail.com>', // Correo del emisor
  to: `${req.body.email}`, // Lista de receptores
  subject: 'IT WORKED!!!', // Asunto del correo
  html: output // cuerpo html.
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
   return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);   
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  res.render('contact', {msg:'Email has been sent'});
});
});
app.listen(3000, () => console.log('Server started...'));