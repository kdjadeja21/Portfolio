export const email = "kdjadeja209@gmail.com";

export const siteUrl = "https://krushnasinh.vercel.app";

export const showCvDownload =
  process.env.NEXT_PUBLIC_SHOW_CV_DOWNLOAD !== "false";

export const cvDownloadPath = "/Krushnasinh_Jadeja_CV.pdf";

export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/krushnasinh-jadeja",
  },
  {
    name: "X",
    url: "https://x.com/kdjadeja911",
    display: "@KdJadeja911",
  },
  {
    name: "GitHub",
    url: "https://github.com/kdjadeja21",
  },
  {
    name: "Cursor",
    url: "https://cursor.com/@kdjadeja",
    display: "cursor.com/@kdjadeja",
  },
] as const;
