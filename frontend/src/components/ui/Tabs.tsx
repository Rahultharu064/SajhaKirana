import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({
    defaultValue,
    className,
    children,
    ...props
}: {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn('w-full', className)} {...props}>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('flex items-center', className)} {...props}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({
    value,
    children,
    className,
    ...props
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            data-state={isActive ? 'active' : 'inactive'}
            className={cn(
                'px-4 py-2 font-medium transition-all outline-none',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({
    value,
    children,
    className,
    ...props
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.activeTab !== value) return null;

    return (
        <div className={cn('mt-2', className)} {...props}>
            {children}
        </div>
    );
};
