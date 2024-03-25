import QueryProvider from "./QueryProvider";
import UiProvider from "./UiProvider";

const RootProvider = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <QueryProvider>
            <UiProvider>
                {children}
            </UiProvider>
        </QueryProvider>
    );
};

export default RootProvider;