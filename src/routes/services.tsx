import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/thump/site-shell";
import { services, pageHead } from "@/lib/thump/data";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Fire safety services",
      "Fire alarms, hydrants, pumps, extinguishers, sprinklers, fire curtains and maintenance services in Bangalore.",
    ),
  component: Services,
});
function Services() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-hero text-hero-foreground">
          <div className="container-width py-20">
            <p className="eyebrow text-primary mb-5">OUR EXPERTISE</p>
            <h1 className="text-4xl sm:text-5xl font-bold">
              Fire safety.
              <br />
              From every angle.
            </h1>
            <p className="text-hero-muted mt-6 max-w-lg leading-7">
              From installation to ongoing maintenance, THUMP supports the systems that protect your
              people and property.
            </p>
          </div>
        </section>
        <section className="container-width py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 service-grid">
            {services.map(({ name, icon: Icon, description }, i) => (
              <article className="service-tile p-8" key={name}>
                <div className="flex justify-between">
                  <Icon className="size-10 text-primary stroke-[1.3]" />
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <h2 className="text-xl font-semibold mt-8">{name}</h2>
                <p className="text-sm text-muted-foreground mt-4 leading-7">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap justify-between items-center gap-5">
            <h2 className="text-2xl font-bold">The right protection starts with a conversation.</h2>
            <Button asChild>
              <Link to="/contact">
                Contact THUMP
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
