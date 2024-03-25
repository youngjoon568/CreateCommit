import RootProvider from "@/lib/Providers/RootProvider";
import "@/style/globals.css";

const RootLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <html lang="ko" suppressHydrationWarning={true}>
            <head>
                <title></title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <div>
                    <RootProvider>
                        {children}
                    </RootProvider>
                </div>
            </body>
        </html>
    );
};

export default RootLayout;