"use client"

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
interface Earnings {
    name: string;
    value: number;
}

const fields: Earnings[] = [
    {
        name: "Total Earning",
        value: 1000
    },
    {
        name: "Pending",
        value: 100
    },
    {
        name: "Fees",
        value: 100
    }

];
const EarningSection = () => {
    return (
        <Card className="w-[350px] mt-8 h-[300px] mx-auto md:justify-start">
            <CardHeader>
                <CardTitle className="text-5xl font-['Inter']">Earnings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 ">
                {fields.map((item: Earnings, index: number) => (
                    <div key={index} className="grid grid-cols-2">
                        <div className="text-2xl font-semibold ">{item.name}:</div>
                        <div className="inline-block pt-1 ml-6 align-middle ">{item.value}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default EarningSection;