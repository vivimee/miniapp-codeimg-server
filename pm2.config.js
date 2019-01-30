module.exports = {
    apps: [
        {
            name: "qrcode-server",
            script: "index.js",
            output: "./logs/out.log",
            error: "./logs/error.log",
            log: "./logs/log.log",
        },
    ],
};
