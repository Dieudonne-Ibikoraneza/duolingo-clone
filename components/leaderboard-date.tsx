"use client";

import { useEffect, useState } from "react";

export const LeaderboardDate = () => {
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, []);

    if (!date) return null;

    return (
        <p className="text-muted-foreground text-center text-sm mb-6 italic">
            Last updated: {date}
        </p>
    );
};
