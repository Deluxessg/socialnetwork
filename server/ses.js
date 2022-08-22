const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

function sendEmail(recipient, name, code) {
    return ses.sendEmail(
        {
            Source: "You Know Who <aromatic.road@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `You will need this to reset: ${code}`,
                    },
                },
                Subject: {
                    Data: `Dear ${name}, resetting the password aren't we?`,
                },
            },
        }
            .promise()
            .then(() => console.log("it worked!"))
            .catch((err) => console.log(err))
    );
}

module.exports = { sendEmail };
