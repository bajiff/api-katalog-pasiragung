import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

const createTransporter = async () => {
  if (env.NODE_ENV === "development" && env.SMTP_HOST === "smtp.ethereal.email") {
    // Generate test account if using ethereal and credentials are default
    if (env.SMTP_USER === "ethereal_user") {
      const testAccount = await nodemailer.createTestAccount();
      console.log("📨 Ethereal Test Account Created:", testAccount.user);
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }

  // Production or manual development config
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

export const sendVerificationEmail = async (to: string, code: string) => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Kode Verifikasi Admin - E-Katalog Pasiragung",
    html: `
      <h2>Kode Verifikasi Admin</h2>
      <p>Pengajuan admin Anda telah disetujui. Silakan masukkan kode berikut untuk memverifikasi akun Anda:</p>
      <h3 style="letter-spacing: 2px; padding: 10px; background-color: #f0f0f0; display: inline-block;">${code}</h3>
      <p>Kode ini akan kedaluwarsa dalam ${env.VERIFICATION_CODE_EXPIRY_MINUTES} menit.</p>
    `,
  });

  if (env.NODE_ENV === "development") {
    console.log("📨 Message sent: %s", info.messageId);
    console.log("📨 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export const sendPasswordResetEmail = async (to: string, code: string) => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Reset Kata Sandi - E-Katalog Pasiragung",
    html: `
      <h2>Reset Kata Sandi Admin</h2>
      <p>Kami menerima permintaan untuk mereset kata sandi Anda. Silakan masukkan kode berikut:</p>
      <h3 style="letter-spacing: 2px; padding: 10px; background-color: #f0f0f0; display: inline-block;">${code}</h3>
      <p>Kode ini akan kedaluwarsa dalam ${env.VERIFICATION_CODE_EXPIRY_MINUTES} menit.</p>
      <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
    `,
  });

  if (env.NODE_ENV === "development") {
    console.log("📨 Password Reset Message sent: %s", info.messageId);
    console.log("📨 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export const sendRejectionEmail = async (to: string) => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Pendaftaran Akun Ditolak - E-Katalog Pasiragung",
    html: `
      <h2>Pendaftaran Akun Admin Ditolak</h2>
      <p>Mohon maaf, pendaftaran akun Anda pada sistem E-Katalog UMKM Desa Pasiragung tidak disetujui oleh Super Admin.</p>
      <p>Jika Anda merasa ini adalah kesalahan atau ingin mendaftar ulang, silakan hubungi pihak pengelola desa untuk informasi lebih lanjut.</p>
      <br>
      <p>Salam,</p>
      <p><strong>Tim E-Katalog Desa Pasiragung</strong></p>
    `,
  });

  if (env.NODE_ENV === "development") {
    console.log("📨 Rejection Email sent: %s", info.messageId);
    console.log("📨 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};
