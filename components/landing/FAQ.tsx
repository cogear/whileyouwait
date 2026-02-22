"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How long does it take?",
    answer:
      "Most sites are done in 15-20 minutes. I'll have your website live and ready to share before you leave the market.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Just your business name, contact info, a logo if you have one, and a few photos. I'll handle the rest.",
  },
  {
    question: "Can I update my site later?",
    answer:
      "Yes! Reach out anytime and I'll make updates for you. Small changes are always free.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Absolutely. I'll help you connect your custom domain so your site shows up at yourbusiness.com.",
  },
  {
    question: "What if I want a full online store?",
    answer:
      "Store packages are coming soon. Leave your info and I'll reach out when they're ready.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-muted-bg py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Questions? I&apos;ve Got Answers.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
