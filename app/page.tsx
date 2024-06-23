import { Fieldset } from "@headlessui/react";

import { Button } from "@/app/components/button";
import { signUpWithGoogle } from "@/utils/signUpWithGoogle";

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(240_10%_3.9%)] font-sans text-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="mb-8 text-center text-4xl font-bold">BlogStreak</h1>

        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">
            Elevate Your Writing, Share Your Insights, Build Your Online
            Presence
          </h2>
          <p className="mb-6 text-xl">
            Build a Daily Writing Habit and Transform Your Thoughts into
            Consistent Content
          </p>
          <form className="" action={signUpWithGoogle}>
            <Button color="blue" className={"cursor-pointer"} type="submit">
              Start Your Writing Journey Today
            </Button>
          </form>
        </div>

        {/* Main content */}
        <div className="mb-12">
          <p className="mb-6 text-lg">
            BlogStreak is your all-in-one platform designed to help you develop
            a daily writing routine, unlock your potential as a blogger, and
            share your unique perspective with the world through your own
            personal site.
          </p>
          <h3 className="mb-4 text-2xl font-semibold">
            Why Choose BlogStreak?
          </h3>
          <ul className="mb-6 list-inside list-disc">
            <li>
              Habit Formation: Develop a consistent daily writing practice
            </li>
            <li>
              Personal Publishing Hub: Your own customizable site for blogs and
              microblogs
            </li>
            <li>
              Motivation Boost: Stay inspired with streak tracking and rewards
            </li>
            <li>Guided Writing: Overcome writer's block with daily prompts</li>
            <li>
              Microblogging Support: Share quick thoughts and updates alongside
              full blog posts
            </li>
            <li>Progress Tracking: Visualize your growth as a writer</li>
            <li>
              Audience Building: Grow your readership with integrated social
              sharing features
            </li>
            <li>
              Flexible Goal Setting: Tailor your writing goals to your lifestyle
            </li>
            <li>
              Flexible Privacy: Choose what to keep private and what to share
              publicly
            </li>
          </ul>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h3 className="mb-4 text-2xl font-semibold">Key Features</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Daily Writing Reminders: Gentle nudges to keep you on track",
              "Streak Tracker: Visualize your consistency and stay motivated",
              "Writing Prompts: Overcome blank page syndrome with tailored inspiration",
              "Progress Analytics: Track your word count, frequency, and growth over time",
              "Distraction-Free Editor: Focus solely on your writing",
              "Milestone Celebrations: Earn badges and rewards for hitting targets",
              "Mobile App: Write on-the-go and never miss a day",
              "Personal Website: Your own corner of the internet to share your thoughts",
              "Blog & Microblog Publishing: Share both long-form content and quick updates",
              "Thought Capsules: Daily prompts to inspire your writing",
              "Content Organization: Tag and categorize your posts for easy navigation",
              "Audience Insights: Understand your readers with built-in analytics",
              "Customizable Themes: Make your personal site uniquely yours",
              "Mobile-Friendly: Write, publish, and manage on the go",
            ].map((feature, index) => (
              <div key={index} className="rounded bg-gray-800 p-4">
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="mb-4 text-2xl font-semibold">Success Stories</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "With BlogStreak, I've written every day for 3 months straight, and my personal site is gaining more readers each day!",
                author: "Sarah K., Aspiring Blogger",
              },
              {
                quote:
                  "The streak tracker and daily prompts keep me motivated. Plus, the customization options for my site are fantastic!",
                author: "James L., Freelance Writer",
              },
              {
                quote:
                  "BlogStreak's distraction-free editor and progress analytics have revolutionized my writing. My audience loves the regular updates!",
                author: "Michael T., Hobbyist Writer",
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded bg-gray-800 p-4">
                <p className="mb-2 italic">"{testimonial.quote}"</p>
                <p className="text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Start Building Your Online Presence Today
          </h3>
          <p className="mb-4">
            Join the community of thinkers, writers, and influencers who are
            growing their audience with BlogStreak.
          </p>
          <form className="" action={signUpWithGoogle}>
            <Button color="blue" className={"cursor-pointer"} type="submit">
              Launch Your Personal Site and Begin Your Writing Journey
            </Button>
          </form>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-semibold">Simple Pricing</h3>
          <div className="inline-block rounded bg-gray-800 p-6">
            <p className="mb-2 text-xl">$5/month</p>
            <p className="mb-4 text-lg">or</p>
            <p className="text-xl font-bold">$50/year</p>
            <p className="mt-4 text-sm">
              Includes your personal website and all features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
