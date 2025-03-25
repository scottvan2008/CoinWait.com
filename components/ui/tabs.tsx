"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// Custom hook for swipeable tabs
const useSwipeableTabs = (
    value: string | undefined,
    onValueChange: ((value: string) => void) | undefined,
    values: string[]
) => {
    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

    // Required minimum distance between touch start and touch end to be detected as swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || !onValueChange || !value) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (!isLeftSwipe && !isRightSwipe) return;

        const currentIndex = values.indexOf(value);
        if (currentIndex === -1) return;

        if (isLeftSwipe && currentIndex < values.length - 1) {
            // Swipe left - go to next tab
            onValueChange(values[currentIndex + 1]);
        } else if (isRightSwipe && currentIndex > 0) {
            // Swipe right - go to previous tab
            onValueChange(values[currentIndex - 1]);
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
};

// Enhanced Tabs component with swipe functionality
const Tabs = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
        swipeable?: boolean;
    }
>(({ swipeable = true, ...props }, ref) => {
    // Extract all possible tab values from children
    const [tabValues, setTabValues] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!swipeable || !props.children) return;

        // Extract tab values from TabsTrigger components
        const values: string[] = [];
        React.Children.forEach(props.children, (child) => {
            if (!React.isValidElement(child)) return;

            if (child.type === TabsList) {
                React.Children.forEach(child.props.children, (trigger) => {
                    if (React.isValidElement(trigger)) {
                        // Type assertion to access the value prop safely
                        const triggerProps = trigger.props as {
                            value?: string;
                        };
                        if (triggerProps.value) {
                            values.push(triggerProps.value);
                        }
                    }
                });
            }
        });

        setTabValues(values);
    }, [props.children, swipeable]);

    const swipeHandlers = useSwipeableTabs(
        props.value,
        props.onValueChange,
        tabValues
    );

    return (
        <TabsPrimitive.Root
            ref={ref}
            {...props}
            {...(swipeable ? swipeHandlers : {})}
        />
    );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
