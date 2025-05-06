import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  href: string;
  linkText?: string;
}

export default function Card({ title, description, href, linkText = "移動" }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={href}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
