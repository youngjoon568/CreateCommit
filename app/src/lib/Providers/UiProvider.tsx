"use client";

import { NextUIProvider } from "@nextui-org/react";

const UiProvider = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <NextUIProvider>
            { children }
        </NextUIProvider>
    );
};

export default UiProvider;