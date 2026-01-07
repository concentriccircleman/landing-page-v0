import { redirect } from "next/navigation";
import { bookDemoUrl } from "@/utils/external-links";

// placeholder until attio connection
const ContactPage = () => {
  redirect(bookDemoUrl);
};

export default ContactPage;
