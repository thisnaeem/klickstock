import { auth } from "@/auth";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnvelopeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function HelpPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-500">
          Frequently asked questions and resources for contributors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 rounded-full mb-3">
            <EnvelopeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Email Support</h3>
          <p className="text-gray-500 text-sm mb-4">Get help from our dedicated contributor support team</p>
          <Link 
            href="mailto:support@klickstock.com" 
            className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
          >
            support@klickstock.com
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-purple-100 rounded-full mb-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Live Chat</h3>
          <p className="text-gray-500 text-sm mb-4">Chat with our support team in real time</p>
          <button
            className="text-white bg-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Start Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-green-100 rounded-full mb-3">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Resource Center</h3>
          <p className="text-gray-500 text-sm mb-4">Browse our comprehensive guides and tutorials</p>
          <Link 
            href="/contributor/resources" 
            className="text-green-600 font-medium text-sm hover:text-green-800 transition-colors"
          >
            Browse Resources
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-medium">
              What types of images can I upload?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              KlickStock accepts high-quality photographs, illustrations, vector graphics, and digital art. All content must be original and owned by you. We don't accept content that violates copyright laws, contains offensive material, or depicts trademarked/copyrighted elements without proper releases.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-medium">
              How long does the review process take?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Our team typically reviews submissions within 2-3 business days. During high volume periods, it may take up to 5 business days. You'll receive an email notification when your content has been reviewed.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-medium">
              Why was my image rejected?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Images may be rejected for various reasons including: poor technical quality, insufficient commercial value, similarity to existing content, copyright/trademark issues, or not meeting our content guidelines. Check the rejection notification for specific feedback.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-medium">
              How do I earn money from my uploads?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              You earn royalties whenever your content is downloaded by users. We offer two licensing options: Standard and Extended, with different royalty rates. Your earnings accumulate in your account and can be withdrawn once you reach the minimum payout threshold of $50.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left font-medium">
              How do I make my content more discoverable?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              To improve discoverability, use descriptive titles, add comprehensive descriptions, include relevant keywords in your tags, and select appropriate categories. Focus on current trends and in-demand subjects, and maintain consistent uploading to build your portfolio.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-lg font-medium text-blue-900 mb-2">Can't find what you're looking for?</h2>
        <p className="text-blue-700 mb-4">Our support team is ready to assist you with any questions or issues you may have.</p>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/contributor/help/contact" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
          <Link 
            href="/contributor/help/faq" 
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Full FAQ
          </Link>
        </div>
      </div>
    </div>
  );
} 