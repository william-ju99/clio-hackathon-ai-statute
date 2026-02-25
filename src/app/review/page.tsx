import { redirect } from "next/navigation";

export default function ReviewPage() {
  // Redirect to bills page — user needs to select a bill first
  redirect("/bills");
}
