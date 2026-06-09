import ChatWindow from "@/components/ChatWindow";

type Props = {
  params: Promise<{ sessionId: string }>;
};
export default async function Chat({ params }: Props) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col">
      <ChatWindow sessionId={resolvedParams.sessionId} />
    </div>
  );
}
