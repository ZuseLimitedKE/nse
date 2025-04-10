import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  image?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoplaySpeed?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoplaySpeed = 5000,
  className,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [testimonials.length, autoplaySpeed]);

  return (
    <div className={cn("relative overflow-hidden w-full", className)}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="min-w-full px-4">
            <Card className="border border-primary/10 bg-background/50 backdrop-blur-sm shadow-lg p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <svg
                    className="absolute -top-4 -left-4 h-8 w-8 text-primary/30"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>

                <p className="text-lg md:text-xl text-foreground/80 mb-4">
                  {testimonial.quote}
                </p>

                <div className="flex items-center mt-4">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full mr-3 object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex
                ? "bg-primary w-6"
                : "bg-primary/30 hover:bg-primary/50",
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
