import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Contact Us — CreatineCalc',
    description: 'Get in touch with the CreatineCalc team. Questions, feedback, or corrections welcome.',
    alternates: {
      canonical: `https://www.creatinecalc.com/${params.locale}/contact`,
    },
  };
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question, spotted an error, or want to suggest an improvement? We&apos;d love to hear
        from you.
      </p>
      <ContactForm />
    </div>
  );
}
