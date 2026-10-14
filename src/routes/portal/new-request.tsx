import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { z } from "zod";
import { CalendarIcon, Upload, ArrowRight, Info, X } from "lucide-react";
import { PortalHeading } from "@/components/thump/portal-shell";
import { useDemo } from "@/components/thump/demo-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { sites, assets, categories, pageHead } from "@/lib/thump/data";
export const Route = createFileRoute("/portal/new-request")({
  head: () =>
    pageHead(
      "New service request demo",
      "Preview a maintenance service request for your site and fire safety equipment.",
    ),
  component: NewRequest,
});
const schema = z.object({
  site: z.enum(sites),
  asset: z.string().max(50),
  category: z.enum(categories),
  title: z.string().trim().min(5, "Enter a subject of at least 5 characters.").max(120),
  description: z.string().trim().min(15, "Describe the issue in at least 15 characters.").max(2000),
  priority: z.enum(["Low", "Normal", "High"]),
});
function NewRequest() {
  const navigate = useNavigate();
  const { addTicket } = useDemo();
  const [site, setSite] = useState("");
  const [asset, setAsset] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>();
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  return (
    <>
      <PortalHeading
        title="Raise a service request."
        subtitle="Give us the details. We’ll take it from there."
      />
      <div className="notice mb-7 flex gap-3">
        <Info className="size-5 shrink-0" />
        <p>
          This is a demo form. Requests stay in this preview session only. Photos are previewed
          locally, not uploaded. No email is sent.
        </p>
      </div>
      <form
        className="max-w-3xl space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const result = schema.safeParse({
            site,
            asset,
            category,
            title: form.get("title"),
            description: form.get("description"),
            priority: form.get("priority"),
          });
          if (!result.success) {
            setError(result.error.issues[0]?.message ?? "Check your request details.");
            return;
          }
          if (
            asset &&
            !assets.some((a) => a.site === site && a.id === asset && a.category === category)
          ) {
            setError("Choose equipment that matches the site and category.");
            return;
          }
          const id = `DEMO-${Date.now().toString().slice(-6)}`;
          addTicket({
            ...result.data,
            id,
            status: "New",
            date: format(new Date(), "dd MMM yyyy"),
            visit: date ? format(date, "dd MMM yyyy") : undefined,
            photo: photo?.name,
            history: [
              {
                status: "New",
                date: format(new Date(), "dd MMM yyyy · HH:mm"),
                note: "Demo request created locally. No email sent.",
              },
            ],
          });
          navigate({
            to: "/portal/tickets/$ticketId",
            params: { ticketId: id },
            search: { created: true },
          });
        }}
      >
        <section className="border-b border-border pb-8">
          <h2 className="text-lg font-semibold mb-5">
            01 <span className="ml-3">Site & equipment</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="field-label">
              Site *
              <select
                required
                className="select-control mt-2"
                value={site}
                onChange={(e) => {
                  setSite(e.target.value);
                  setAsset("");
                  setCategory("");
                }}
              >
                <option value="">Select a site</option>
                {sites.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Equipment asset
              <select
                className="select-control mt-2"
                disabled={!site}
                value={asset}
                onChange={(e) => {
                  setAsset(e.target.value);
                  setCategory(assets.find((a) => a.id === e.target.value)?.category ?? "");
                }}
              >
                <option value="">Select equipment (optional)</option>
                {assets
                  .filter((a) => a.site === site)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field-label sm:col-span-2">
              Equipment category *
              <select
                className="select-control mt-2"
                value={category}
                required
                onChange={(e) => {
                  setCategory(e.target.value);
                  setAsset("");
                }}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
        <section className="border-b border-border pb-8">
          <h2 className="text-lg font-semibold mb-5">
            02 <span className="ml-3">Issue details</span>
          </h2>
          <div className="space-y-5">
            <label className="field-label">
              Request subject *
              <Input
                name="title"
                required
                minLength={5}
                maxLength={120}
                className="mt-2 h-12 bg-background"
                placeholder="A short summary of the issue"
              />
            </label>
            <label className="field-label">
              Issue description *
              <Textarea
                name="description"
                required
                minLength={15}
                maxLength={2000}
                className="mt-2 min-h-32 bg-background"
                placeholder="Describe what happened, where and when you noticed it."
              />
            </label>
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="field-label">
                Priority *
                <select className="select-control mt-2" name="priority" defaultValue="Normal">
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                </select>
              </label>
              <div className="field-label">
                Preferred visit date
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 h-12 w-full justify-start font-normal"
                    >
                      <CalendarIcon />
                      {date ? format(date, "dd MMM yyyy") : "Select a date (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={{ before: startOfDay(new Date()) }}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-[11px] font-normal text-muted-foreground mt-2">
                  Preferred date only. Not a confirmed appointment.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This form is not for emergencies. In an emergency, contact local emergency services
              immediately.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-5">
            03{" "}
            <span className="ml-3">
              Photo <span className="text-sm text-muted-foreground font-normal">(optional)</span>
            </span>
          </h2>
          <label className="border border-dashed border-border bg-background rounded-md p-7 flex flex-col items-center cursor-pointer">
            <Upload className="size-6 text-muted-foreground mb-3" />
            <span className="text-sm font-medium">Choose a photo to preview</span>
            <span className="text-xs text-muted-foreground mt-2">
              JPG, PNG or WebP · Up to 5 MB · Local preview only
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-4 max-w-full text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (
                  file.size > 5 * 1024 * 1024 ||
                  !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                ) {
                  setError("Choose a JPG, PNG or WebP photo under 5 MB.");
                  e.target.value = "";
                  return;
                }
                setPhoto(file);
                setError("");
              }}
            />
          </label>
          {photo && (
            <div className="flex items-center gap-4 mt-4">
              <img
                src={preview}
                alt="Local issue photo preview"
                className="size-20 object-cover rounded-md"
              />
              <span className="text-xs min-w-0 break-all">{photo.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove photo"
                onClick={() => setPhoto(undefined)}
              >
                <X />
              </Button>
            </div>
          )}
        </section>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-3 pb-10">
          <Button type="submit" className="h-12">
            Create demo request
            <ArrowRight />
          </Button>
          <Button asChild variant="outline" className="h-12">
            <Link to="/portal">Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}
