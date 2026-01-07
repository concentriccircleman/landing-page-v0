import Link from "next/link";

const NotFound = () => {
  return (
    <section className="w-full flex-1 flex items-center justify-center px-6 md:px-8">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center text-center text-foreground">
          <h1 className="text-3xl/snug s:text-4xl/snug md:text-5xl/snug font-medium mb-4">
            Page not found
          </h1>
          <p className="text-lg text-muted mb-8">The page you are looking for does not exist.</p>
          <Link href="/" className="text-lg underline hover:no-underline">
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
