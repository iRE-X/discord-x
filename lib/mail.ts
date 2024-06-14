import nodemailer from "nodemailer";

const ORIGIN = process.env.AUTH_TRUST_HOST;

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: "irex.ondevelopment@gmail.com",
      pass: process.env.NODEMAILER_APP_PASS,
    },
  },
  {
    from: {
      name: "Discord-X",
      address: "irex.ondevelopment@gmail.com",
    },
  },
);

const generateMail = (name: string, link: string) => {
  const mail = {
    body: {
      name,
      intro: "Welcome to Next-Auth! We're very excited to have you on board.",
      action: {
        instructions:
          "To get started, please confirm your mail address by clicking here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${ORIGIN}/auth/new-verification?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email by clicking here: </p>
                <div>--->>>>> <a href="${confirmLink}">CONFIRM</a> <<<<<---</div>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${ORIGIN}/auth/new-password?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset Your Password",
    html: `<p>Reset your password : </p>
        <div>--->>>>> <a href="${resetLink}">RESET</a> <<<<<---</div>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    to: email,
    subject: "2FA Verification Code",
    html: `<p>Your 2-Factor Verification Code : ${token} </p>
                <br/>
                <p>This code is valid for only 10 Minuites.</p>`,
  });
};
