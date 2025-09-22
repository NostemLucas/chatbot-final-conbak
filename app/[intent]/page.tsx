"use client";
import SectionContent from "@/components/SectionContent";
import { yastaTopics } from "@/data/topics";

interface PageProps {
  params: {
    intent: string;
  };
}

export default function Page({ params }: PageProps) {
  const { intent } = params;

  const topic = yastaTopics.find((t) => t.intent === intent);

  if (!topic) {
    return <div>❌ No se encontró contenido para "{intent}"</div>;
  }

  return <SectionContent topic={topic} />;
}
