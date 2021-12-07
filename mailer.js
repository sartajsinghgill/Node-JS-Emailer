const node_mailer = require('nodemailer')
const file_sync = require('fs')

// Read the configuration file
var emailer_data = JSON.parse(file_sync.readFileSync('config.json'))

//Read the userlist from the csv file
function read_users_csv(callback) {
  file_sync.readFile(emailer_data.userlist_filename, emailer_data.userlist_file_encoding, function (err, fileData) {
    list_ids = fileData.toString().split(/\r?\n/)
    callback()
  })
}

read_users_csv(sendEmail)

//Send email function
function sendEmail() {
  var sent_ids = []
  i = 0
  var transporter = node_mailer.createTransport({
    service: emailer_data.email_service,
    auth: {
      user: emailer_data.send_email_username,
      pass: emailer_data.send_email_password
    }
  });

  var timed_emails = setInterval(() => {
    if(list_ids.length > sent_ids.length){
      var mail_options = {
        from: emailer_data.send_email_username,
        to: emailer_data.to_email,
        subject: list_ids[i]
      }
      transporter.sendMail(mail_options)
      sent_ids.push(list_ids[i])
      i++
    }
    else {
      clearInterval(timed_emails)
    }
  }, emailer_data.email_interval)
}