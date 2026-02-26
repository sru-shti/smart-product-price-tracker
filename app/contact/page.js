import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Contact Us | PriceScout",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-600">Have a question, feature request, or found a bug? Let us know!</p>
      </div>

      <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>We typically reply within 24 hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option>Report a Bug</option>
                <option>Feature Request</option>
                <option>General Inquiry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea 
                className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="How can we help?"
              />
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}