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
    <div className="space-y-8 pb-10">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
        <p className="text-gray-300">
          Find answers and resources to help you succeed as a contributor
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/40 hover:border-gray-700/40 transition-all duration-300 group">
          <div className="p-3 bg-blue-500/10 rounded-xl mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <EnvelopeIcon className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm mb-4">Get help from our dedicated contributor support team</p>
          <Link 
            href="mailto:support@klickstock.com" 
            className="text-blue-400 font-medium text-sm hover:text-blue-300 transition-colors flex items-center gap-2 group-hover:gap-3"
          >
            support@klickstock.com
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/40 hover:border-gray-700/40 transition-all duration-300 group">
          <div className="p-3 bg-purple-500/10 rounded-xl mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm mb-4">Chat with our support team in real time</p>
          <button className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-all duration-300 flex items-center gap-2">
            Start Chat
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/40 hover:border-gray-700/40 transition-all duration-300 group">
          <div className="p-3 bg-emerald-500/10 rounded-xl mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Resource Center</h3>
          <p className="text-gray-400 text-sm mb-4">Browse our comprehensive guides and tutorials</p>
          <Link 
            href="/contributor/resources" 
            className="text-emerald-400 font-medium text-sm hover:text-emerald-300 transition-colors flex items-center gap-2 group-hover:gap-3"
          >
            Browse Resources
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/40">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-gray-800/40 px-0">
            <AccordionTrigger className="text-left font-medium text-gray-200 hover:text-white">
              What types of images can I upload?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              KlickStock accepts high-quality photographs, illustrations, vector graphics, and digital art. All content must be original and owned by you. We don't accept content that violates copyright laws, contains offensive material, or depicts trademarked/copyrighted elements without proper releases.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-gray-800/40 px-0">
            <AccordionTrigger className="text-left font-medium text-gray-200 hover:text-white">
              How long does the review process take?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Our team typically reviews submissions within 2-3 business days. During high volume periods, it may take up to 5 business days. You'll receive an email notification when your content has been reviewed.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-gray-800/40 px-0">
            <AccordionTrigger className="text-left font-medium text-gray-200 hover:text-white">
              Why was my image rejected?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Images may be rejected for various reasons including: poor technical quality, insufficient commercial value, similarity to existing content, copyright/trademark issues, or not meeting our content guidelines. Check the rejection notification for specific feedback.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-gray-800/40 px-0">
            <AccordionTrigger className="text-left font-medium text-gray-200 hover:text-white">
              How do I earn money from my uploads?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              You earn royalties whenever your content is downloaded by users. We offer two licensing options: Standard and Extended, with different royalty rates. Your earnings accumulate in your account and can be withdrawn once you reach the minimum payout threshold of $50.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-gray-800/40 px-0">
            <AccordionTrigger className="text-left font-medium text-gray-200 hover:text-white">
              How do I make my content more discoverable?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              To improve discoverability, use descriptive titles, add comprehensive descriptions, include relevant keywords in your tags, and select appropriate categories. Focus on current trends and in-demand subjects, and maintain consistent uploading to build your portfolio.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 p-8 rounded-xl border border-gray-800/40">
        <h2 className="text-2xl font-bold text-white mb-3">Can't find what you're looking for?</h2>
        <p className="text-gray-300 mb-6">Our support team is ready to assist you with any questions or issues you may have.</p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/contributor/help/contact" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 gap-2 hover:gap-3"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link 
            href="/contributor/help/faq" 
            className="inline-flex items-center px-6 py-3 bg-gray-900/50 text-white border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all duration-300 gap-2 hover:gap-3"
          >
            Full FAQ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 