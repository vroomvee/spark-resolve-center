import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/thump/site-shell";
import { pageHead } from "@/lib/thump/data";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact THUMP",
      "Contact THUMP Services & Solutions in Indiranagar, Bangalore for fire safety and maintenance support.",
    ),
  component: Contact,
});
function Contact() {
  return (
    <>
      <SiteHeader />
      <main className="container-width py-20">
        <p className="eyebrow mb-5">LET’S TALK PROTECTION</p>
        <h1 className="text-4xl sm:text-5xl font-bold">Contact THUMP.</h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-7">
          For fire safety systems, maintenance support or client portal access, get in touch with
          our team.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-16 border-y border-border py-10">
          <div>
            <Phone className="text-primary size-7 mb-6" />
            <h2 className="font-semibold mb-3">Call us</h2>
            <a href="tel:08041134036" className="text-muted-foreground">
              080-41134036
            </a>
          </div>
          <div>
            <Mail className="text-primary size-7 mb-6" />
            <h2 className="font-semibold mb-3">Email us</h2>
            <a href="mailto:mohit@thumpserve.com" className="text-muted-foreground break-all">
              mohit@thumpserve.com
            </a>
          </div>
          <div>
            <MapPin className="text-primary size-7 mb-6" />
            <h2 className="font-semibold mb-3">Visit our office</h2>
            <p className="text-sm text-muted-foreground leading-7">
              No. 839, 6th Cross, 10th 'A' Main,
              <br />
              Indiranagar 2nd Stage,
              <br />
              Bangalore - 560 038.
            </p>
          </div>
        </div>
        <Button asChild className="mt-10 h-12">
          <a href="mailto:mohit@thumpserve.com">
            Start a conversation
            <ArrowUpRight />
          </a>
        </Button>
      </main>
      <SiteFooter />
    </>
  );
}
