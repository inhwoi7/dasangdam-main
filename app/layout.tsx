import "./globals.css";

export const metadata = {
  title: {
    default: "다상담",
    template: "%s | 다상담",
  },
  description: "써니와 함께하는 인생의 지혜로운 쉼터",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
