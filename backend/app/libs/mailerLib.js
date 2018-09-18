const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'kiydj7n67xxlej3u@ethereal.email',
            pass: 'MrwPPe5zU3SDgWbyX3'
        },
        tls: {
          rejectUnauthorized: false
        }

});

let mailOptions = {
    from: 'admin',
    to: '',
    subject: 'hello',
    html:""
};

let autoEmail = (reciever, message) =>{

    mailOptions.to = reciever;

    mailOptions.html = message;
    //console.log(mailOptions);

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email Sent' + info.response);
        }
    });

}//end autoEmail

module.exports = {
    autoEmail: autoEmail
}