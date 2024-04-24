"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "ThePrimeagen",
    avatar: "TP",
    title: "CEO of HTMX",
    description: "This is the worst application I've ever used!",
  },
  {
    name: "Theo",
    avatar: "TB",
    title: "Tech Influencer",
    description: "I use this daily for building Flutter app!",
  },
  {
    name: "Fireship",
    avatar: "FI",
    title: "YouTuber",
    description: "This app has changed my life! JK.",
  },
  {
    name: "Nirmalya",
    avatar: "NN",
    title: "Unemployed",
    description: "Best way to change README.md file!",
  },
];

export default function LandingContent() {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <div className="flex flex-row items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback className="text-black font-bold">
                    {item.avatar}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-zinc-400 text-sm">{item.title}</p>
                  </div>
                </CardTitle>
              </div>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
