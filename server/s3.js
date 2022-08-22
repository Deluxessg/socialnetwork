const aws = require("aws-sdk");
const fs = require("fs");

const { AWS_KEY, AWS_SECRET } = require("./secrets.json");
const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

function s3Upload(request, response, next) {
    const { filename, mimetype, size, path } = request.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            next();
            fs.unlink(path, () => {});
        })
        .catch((error) => {
            // uh oh
            console.log("error uploading to s3", error);
            response.sendStatus(500);
        });
}

module.exports = { s3Upload };
