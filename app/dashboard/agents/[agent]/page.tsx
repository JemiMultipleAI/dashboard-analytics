"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchSmartSeoData,
  SmartSeoData,
  SmartSeoRecord,
  SmartSeoTableKey,
} from "@/lib/smartSeo";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

type Section = {
  key: SmartSeoTableKey;
  title: string;
  description: string;
};

const sections: Section[] = [
  {
    key: "keyword_strategy_agent_outputs",
    title: "Keyword Strategy",
    description: "Clusters, executive summary, KPIs",
  },
  {
    key: "seo_keyword_agent_outputs",
    title: "Keyword Recommendations",
    description: "Inputs, recommendations, insights",
  },
  {
    key: "content_writer_agent_outputs",
    title: "Content Writer",
    description: "Pages, blogs, FAQs, schema",
  },
  {
    key: "final_website_content_agent_outputs",
    title: "Final Website Content",
    description: "Site sections and blog ideas",
  },
  {
    key: "final_seo_recommendations_agent_outputs",
    title: "Final SEO Recommendations",
    description: "Technical, content, off-page",
  },
  {
    key: "backlink_blog_agent_outputs",
    title: "Backlink Blog Ideation",
    description: "Target domains and article outlines",
  },
  {
    key: "off_page_seo_agent_outputs",
    title: "Off-Page SEO",
    description: "Link building, PR, outreach",
  },
  {
    key: "on_page_seo_agent_outputs",
    title: "On-Page SEO",
    description: "Technical and content audits",
  },
  {
    key: "seo_agent_outputs",
    title: "SEO Agent Summary",
    description: "Domain analysis, outreach, ROI",
  },
];

const sectionAccent: Record<SmartSeoTableKey, string> = {
  keyword_strategy_agent_outputs: "bg-blue-500/10 border-blue-400/40",
  seo_keyword_agent_outputs: "bg-indigo-500/10 border-indigo-400/40",
  content_writer_agent_outputs: "bg-emerald-500/10 border-emerald-400/40",
  final_website_content_agent_outputs: "bg-teal-500/10 border-teal-400/40",
  final_seo_recommendations_agent_outputs: "bg-orange-500/10 border-orange-400/40",
  backlink_blog_agent_outputs: "bg-pink-500/10 border-pink-400/40",
  off_page_seo_agent_outputs: "bg-amber-500/10 border-amber-400/40",
  on_page_seo_agent_outputs: "bg-rose-500/10 border-rose-400/40",
  seo_agent_outputs: "bg-slate-500/10 border-slate-400/40",
};

function parseAgentSlug(slug: string | string[] | undefined) {
  if (!slug || Array.isArray(slug)) return null;
  return { agent_name: decodeURIComponent(slug) };
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[12px] font-semibold text-foreground uppercase tracking-wide">
    {children}
  </p>
);

const TextBlock = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
    {children}
  </p>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <Badge variant="secondary" className="text-[11px] font-semibold bg-primary/15 text-primary border-primary/30">
    {children}
  </Badge>
);

const agentLabelMap: Record<string, string> = {
  keyword_strategy_agent: "Keyword Strategy Agent",
  keywords_recommendation_agent: "Keyword Recommendations Agent",
  content_writer_agent: "Content Writer Agent",
  final_website_content_generator: "Final Website Content Agent",
  final_seo_recommendations_agent: "Final SEO Recommendations Agent",
  backlink_blog_ideation_agent: "Backlink Blog Ideation Agent",
  off_page_seo_agent: "Off-Page SEO Agent",
  on_page_seo_agent: "On-Page SEO Agent",
  seo_agent_1: "SEO Agent",
};

function formatAgentName(name: string) {
  if (agentLabelMap[name]) return agentLabelMap[name];
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const priorityClass = (priority?: string) => {
  if (!priority) return "bg-secondary text-foreground";
  const p = priority.toLowerCase();
  if (p.includes("high")) return "bg-red-500/15 text-red-700 border-red-200";
  if (p.includes("medium"))
    return "bg-amber-500/15 text-amber-700 border-amber-200";
  if (p.includes("low"))
    return "bg-emerald-500/15 text-emerald-700 border-emerald-200";
  return "bg-secondary text-foreground";
};

const PriorityTag = ({ priority }: { priority?: string }) => (
  <Badge
    variant="outline"
    className={`text-[11px] font-semibold ${priorityClass(priority)}`}
  >
    {priority || "N/A"}
  </Badge>
);

function KeyValueTable({ data }: { data: Record<string, any> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return <TextBlock>Not provided.</TextBlock>;

  return (
    <div className="divide-y divide-border/70 rounded-lg border border-border/60 bg-secondary/30">
      {entries.map(([k, v]) => {
        const label = k.replace(/_/g, " ");
        const isPrimitive =
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean";
        const isPrimitiveArray =
          Array.isArray(v) &&
          v.every(
            (item) =>
              typeof item === "string" ||
              typeof item === "number" ||
              typeof item === "boolean"
          );

        return (
          <div
            key={k}
            className="px-3 py-2 grid grid-cols-3 gap-2 items-start text-sm even:bg-secondary/50"
          >
            <p className="font-semibold text-foreground col-span-1">{label}</p>
            <div className="col-span-2 space-y-1">
              {isPrimitive && <TextBlock>{String(v)}</TextBlock>}
              {isPrimitiveArray && <List items={v as any[]} />}
              {!isPrimitive &&
                !isPrimitiveArray &&
                v &&
                typeof v === "object" && (
                  <ObjectCard obj={v as Record<string, unknown>} />
                )}
              {v === null && <TextBlock>Not provided.</TextBlock>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ObjectCard({ obj }: { obj: Record<string, unknown> }) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-1 text-sm">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="space-y-0.5">
          <p className="font-semibold">{k.replace(/_/g, " ")}</p>
          <TextBlock>
            {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
          </TextBlock>
        </div>
      ))}
    </div>
  );
}

function List({ items }: { items: any[] }) {
  if (!items || items.length === 0) return <TextBlock>No items.</TextBlock>;

  const isPrimitive = items.every(
    (item) =>
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
  );

  if (isPrimitive) {
    return (
      <ul className="list-disc pl-4 space-y-1 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed text-foreground">
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  // Fallback for array of objects
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map((item, idx) => (
        <ObjectCard key={idx} obj={item || {}} />
      ))}
    </div>
  );
}

function DomainsList({ domains }: { domains?: any[] }) {
  if (!domains || domains.length === 0)
    return <TextBlock>No domains provided.</TextBlock>;
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {domains.map((d, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-1"
        >
          <FieldLabel>Domain</FieldLabel>
          <TextBlock>{d.domain}</TextBlock>
          {d.domainTheme && (
            <>
              <FieldLabel>Theme</FieldLabel>
              <TextBlock>{d.domainTheme}</TextBlock>
            </>
          )}
          {d.authorityLevel && (
            <>
              <FieldLabel>Authority</FieldLabel>
              <TextBlock>{d.authorityLevel}</TextBlock>
            </>
          )}
          {d.reasonSelected && (
            <>
              <FieldLabel>Reason</FieldLabel>
              <TextBlock>{d.reasonSelected}</TextBlock>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function BlogIdeas({ ideas }: { ideas?: any[] }) {
  if (!ideas || ideas.length === 0)
    return <TextBlock>No blog ideas provided.</TextBlock>;
  return (
    <div className="space-y-4">
      {ideas.map((idea, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-border/50 bg-secondary/20 p-4 space-y-2"
        >
          <FieldLabel>Target Domain</FieldLabel>
          <TextBlock>{idea.domain}</TextBlock>
          <FieldLabel>Blog Title</FieldLabel>
          <TextBlock>{idea.blogTitle}</TextBlock>
          {idea.targetAudience && (
            <>
              <FieldLabel>Target Audience</FieldLabel>
              <TextBlock>{idea.targetAudience}</TextBlock>
            </>
          )}
          {idea.linkPlacementStrategy && (
            <>
              <FieldLabel>Link Placement Strategy</FieldLabel>
              <TextBlock>{idea.linkPlacementStrategy}</TextBlock>
            </>
          )}
          {idea.outline && (
            <div className="space-y-2">
              <FieldLabel>Outline</FieldLabel>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="font-semibold">H1</p>
                  <TextBlock>{idea.outline.h1}</TextBlock>
                </div>
                <div>
                  <p className="font-semibold">H2</p>
                  <List items={idea.outline.h2 || []} />
                </div>
                <div>
                  <p className="font-semibold">H3</p>
                  <List items={idea.outline.h3 || []} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QAList({ items }: { items?: { question: string; answer: string }[] }) {
  if (!items || items.length === 0) return <TextBlock>No FAQs yet.</TextBlock>;
  return (
    <div className="space-y-3">
      {items.map((qa, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
        >
          <p className="font-semibold text-sm">{qa.question}</p>
          <TextBlock>{qa.answer}</TextBlock>
        </div>
      ))}
    </div>
  );
}

function TasksList({ tasks }: { tasks?: string[] }) {
  if (!tasks || tasks.length === 0)
    return <TextBlock>No tasks listed.</TextBlock>;
  return <List items={tasks} />;
}

function KeyValueGrid({ data }: { data?: Record<string, any> }) {
  if (!data) return <TextBlock>Not provided.</TextBlock>;
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {Object.entries(data).map(([k, v]) => (
        <div
          key={k}
          className="rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-1"
        >
          <FieldLabel>{k.replace(/_/g, " ")}</FieldLabel>
          {Array.isArray(v) ? (
            <List items={v as any[]} />
          ) : typeof v === "object" && v !== null ? (
            <KeyValueTable data={v as Record<string, unknown>} />
          ) : (
            <TextBlock>{String(v)}</TextBlock>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-secondary/40 rounded-xl shadow-lg">
      <CardHeader className="pb-2 border-b border-border/70">
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">{children}</CardContent>
    </Card>
  );
}

function renderSectionContent(
  key: SmartSeoTableKey,
  record: SmartSeoRecord | undefined
) {
  if (!record) {
    return <TextBlock>No data found for this agent in this section.</TextBlock>;
  }

  switch (key) {
    case "backlink_blog_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Selected Domains">
            <DomainsList domains={record.selected_domains} />
          </SectionCard>
          <SectionCard title="Backlink Blog Ideas">
            <BlogIdeas ideas={record.backlink_blog_ideas} />
          </SectionCard>
        </div>
      );
    case "content_writer_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Pages">
            <div className="space-y-3">
              {record.pages &&
                Object.entries(record.pages).map(([pageKey, pageData]: any) => (
                  <div
                    key={pageKey}
                    className="rounded-lg border border-border/50 p-3 space-y-2 bg-secondary/20"
                  >
                    <FieldLabel>{pageKey}</FieldLabel>
                    {pageData.metaTitle && (
                      <TextBlock>{pageData.metaTitle}</TextBlock>
                    )}
                    {pageData.metaDescription && (
                      <TextBlock>{pageData.metaDescription}</TextBlock>
                    )}
                    {pageData.content && (
                      <TextBlock>{pageData.content}</TextBlock>
                    )}
                  </div>
                ))}
            </div>
          </SectionCard>
          <SectionCard title="Blog Strategy">
            {record.blog_strategy ? (
              <div className="space-y-3">
                {record.blog_strategy.blogTitles && (
                  <>
                    <FieldLabel>Titles</FieldLabel>
                    <List items={record.blog_strategy.blogTitles} />
                  </>
                )}
                {record.blog_strategy.blogOutlines && (
                  <div className="space-y-2">
                    <FieldLabel>Outlines</FieldLabel>
                    {record.blog_strategy.blogOutlines.map(
                      (o: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border/50 p-3 space-y-2 bg-secondary/10"
                        >
                          <p className="font-semibold text-sm">{o.title}</p>
                          <div className="grid md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="font-semibold">H1</p>
                              <TextBlock>{o.h1}</TextBlock>
                            </div>
                            <div>
                              <p className="font-semibold">H2</p>
                              <List items={o.h2 || []} />
                            </div>
                            <div>
                              <p className="font-semibold">H3</p>
                              <List items={o.h3 || []} />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <TextBlock>No blog strategy provided.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="FAQs">
            <QAList items={record.faq?.questions} />
          </SectionCard>
        </div>
      );
    case "final_seo_recommendations_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Technical SEO Recommendations">
            {record.technical_seo_recommendations ? (
              <div className="space-y-2">
                {record.technical_seo_recommendations.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="text-sm font-semibold">
                        {item.recommendation}
                      </p>
                      <TextBlock>Priority: {item.priority}</TextBlock>
                      <TextBlock>Impact: {item.expectedImpact}</TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No technical recommendations.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Content Recommendations">
            {record.content_recommendations ? (
              <div className="space-y-2">
                {record.content_recommendations.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="text-sm font-semibold">
                        {item.recommendation}
                      </p>
                      <TextBlock>Priority: {item.priority}</TextBlock>
                      <TextBlock>Impact: {item.expectedImpact}</TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No content recommendations.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Off-Page Action Plan">
            {record.off_page_action_plan ? (
              <div className="space-y-2">
                {record.off_page_action_plan.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="text-sm font-semibold">{item.action}</p>
                    <TextBlock>Priority: {item.priority}</TextBlock>
                    <TextBlock>Outcome: {item.expectedOutcome}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No off-page plan.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Social Media Recommendations">
            {record.social_media_recommendations ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.social_media_recommendations.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="text-sm font-semibold">{item.platform}</p>
                      <TextBlock>{item.action}</TextBlock>
                      <TextBlock>Frequency: {item.frequency}</TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No social media plan.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="30-Day Growth Roadmap">
            {record.growth_roadmap_30days ? (
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(record.growth_roadmap_30days).map(
                  ([week, data]: any) => (
                    <div
                      key={week}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                    >
                      <FieldLabel>{week}</FieldLabel>
                      <TextBlock>{data.focus}</TextBlock>
                      <TasksList tasks={data.tasks} />
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No roadmap available.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    case "final_website_content_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Homepage">
            <TextBlock>{record.homepage?.title}</TextBlock>
            <TextBlock>{record.homepage?.heroText}</TextBlock>
            <TextBlock>{record.homepage?.content}</TextBlock>
          </SectionCard>
          <SectionCard title="About Page">
            <TextBlock>{record.about_page?.title}</TextBlock>
            <TextBlock>{record.about_page?.content}</TextBlock>
          </SectionCard>
          <SectionCard title="Services Page">
            {record.services_page?.services ? (
              <div className="space-y-2">
                {record.services_page.services.map((s: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{s.serviceName}</p>
                    <TextBlock>{s.serviceDescription}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No services listed.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Contact Page">
            <TextBlock>{record.contact_page?.content}</TextBlock>
          </SectionCard>
          <SectionCard title="Blog Ideas">
            {record.blog_ideas ? (
              <div className="space-y-2">
                {record.blog_ideas.map((idea: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                  >
                    <p className="font-semibold text-sm">{idea.title}</p>
                    {idea.outline && (
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="font-semibold">H1</p>
                          <TextBlock>{idea.outline.h1}</TextBlock>
                        </div>
                        <div>
                          <p className="font-semibold">H2</p>
                          <List items={idea.outline.h2 || []} />
                        </div>
                        <div>
                          <p className="font-semibold">H3</p>
                          <List items={idea.outline.h3 || []} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No blog ideas.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="FAQs">
            <QAList items={record.faq?.questions} />
          </SectionCard>
        </div>
      );
    case "keyword_strategy_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Executive Summary">
            {record.executive_summary ? (
              <div className="space-y-2">
                {record.executive_summary.overallGoal && (
                  <>
                    <FieldLabel>Overall Goal</FieldLabel>
                    <TextBlock>
                      {record.executive_summary.overallGoal}
                    </TextBlock>
                  </>
                )}
                {record.executive_summary.projectedImpact && (
                  <>
                    <FieldLabel>Projected Impact</FieldLabel>
                    <TextBlock>
                      {record.executive_summary.projectedImpact}
                    </TextBlock>
                  </>
                )}
                {record.executive_summary.keyRecommendations && (
                  <>
                    <FieldLabel>Key Recommendations</FieldLabel>
                    <List items={record.executive_summary.keyRecommendations} />
                  </>
                )}
              </div>
            ) : (
              <TextBlock>No executive summary.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Keyword Clusters">
            {record.keyword_strategy?.topKeywordClusters ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.keyword_strategy.topKeywordClusters.map(
                  (cluster: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">
                          {cluster.mainKeyword}
                        </p>
                        <Tag>{cluster.priority} Priority</Tag>
                        {cluster.searchIntent && (
                          <Tag>{cluster.searchIntent}</Tag>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {cluster.difficultyRange && (
                          <Tag>{cluster.difficultyRange}</Tag>
                        )}
                        {cluster.suggestedPageType && (
                          <Tag>{cluster.suggestedPageType}</Tag>
                        )}
                      </div>
                      {cluster.supportingKeywords && (
                        <>
                          <FieldLabel>Supporting Keywords</FieldLabel>
                          <List items={cluster.supportingKeywords} />
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No keyword clusters.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Primary Strategy & Exclusions">
            {record.keyword_strategy?.primaryKeywordStrategy ? (
              <>
                <FieldLabel>Primary Strategy</FieldLabel>
                <TextBlock>
                  {record.keyword_strategy.primaryKeywordStrategy}
                </TextBlock>
              </>
            ) : (
              <TextBlock>No primary strategy provided.</TextBlock>
            )}
            {record.keyword_strategy?.negativeKeywordsToExclude && (
              <div className="mt-3">
                <FieldLabel>Negative Keywords</FieldLabel>
                <List
                  items={record.keyword_strategy.negativeKeywordsToExclude}
                />
              </div>
            )}
          </SectionCard>

          <SectionCard title="Content Plan">
            {record.content_strategy?.contentPlan ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.content_strategy.contentPlan.map(
                  (plan: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag>{plan.contentType}</Tag>
                        <Tag>{plan.priority}</Tag>
                        {plan.wordCountTarget && (
                          <Tag>{plan.wordCountTarget} words</Tag>
                        )}
                        {plan.publishingTimeline && (
                          <Tag>{plan.publishingTimeline}</Tag>
                        )}
                      </div>
                      <p className="font-semibold text-sm">
                        {plan.suggestedTitle}
                      </p>
                      {plan.targetKeywords && (
                        <>
                          <FieldLabel>Target Keywords</FieldLabel>
                          <List items={plan.targetKeywords} />
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No content plan.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Content Gap Analysis">
            {record.content_strategy?.contentGapAnalysis ? (
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <FieldLabel>Opportunity Areas</FieldLabel>
                  <List
                    items={
                      record.content_strategy.contentGapAnalysis
                        .opportunityAreas || []
                    }
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Missing Content Types</FieldLabel>
                  <List
                    items={
                      record.content_strategy.contentGapAnalysis
                        .missingContentTypes || []
                    }
                  />
                </div>
              </div>
            ) : (
              <TextBlock>No content gap analysis.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Technical SEO">
            {record.technical_seo ? (
              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <FieldLabel>Critical Issues</FieldLabel>
                  <List items={record.technical_seo.criticalIssues || []} />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Important Improvements</FieldLabel>
                  <List
                    items={record.technical_seo.importantImprovements || []}
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Nice To Have</FieldLabel>
                  <List
                    items={record.technical_seo.niceToHaveEnhancements || []}
                  />
                </div>
              </div>
            ) : (
              <TextBlock>No technical SEO notes.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Link Building Strategy">
            {record.link_building_strategy ? (
              <div className="space-y-3">
                {record.link_building_strategy.digitalPRStrategy && (
                  <div className="space-y-2">
                    <FieldLabel>Digital PR Strategy</FieldLabel>
                    <div className="space-y-2">
                      {record.link_building_strategy.digitalPRStrategy.map(
                        (item: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                          >
                            <p className="font-semibold text-sm">
                              {item.strategy}
                            </p>
                            <TextBlock>{item.exampleAnglePitch}</TextBlock>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {record.link_building_strategy.guestPostingStrategy && (
                  <div className="space-y-2">
                    <FieldLabel>Guest Posting Strategy</FieldLabel>
                    {record.link_building_strategy.guestPostingStrategy
                      .focusTopics && (
                      <>
                        <FieldLabel>Focus Topics</FieldLabel>
                        <List
                          items={
                            record.link_building_strategy.guestPostingStrategy
                              .focusTopics
                          }
                        />
                      </>
                    )}
                    {record.link_building_strategy.guestPostingStrategy
                      .targetOutlets && (
                      <>
                        <FieldLabel>Target Outlets</FieldLabel>
                        <List
                          items={
                            record.link_building_strategy.guestPostingStrategy
                              .targetOutlets
                          }
                        />
                      </>
                    )}
                  </div>
                )}
                {record.link_building_strategy.contentForLinkAttraction && (
                  <div className="space-y-2">
                    <FieldLabel>Content for Link Attraction</FieldLabel>
                    <List
                      items={
                        record.link_building_strategy.contentForLinkAttraction
                      }
                    />
                  </div>
                )}
                {record.link_building_strategy.contentSyndicationChannels && (
                  <div className="space-y-2">
                    <FieldLabel>Content Syndication Channels</FieldLabel>
                    <List
                      items={
                        record.link_building_strategy.contentSyndicationChannels
                      }
                    />
                  </div>
                )}
                {record.link_building_strategy.highPriorityBacklinkTargets && (
                  <div className="space-y-2">
                    <FieldLabel>High Priority Backlink Targets</FieldLabel>
                    <List
                      items={
                        record.link_building_strategy
                          .highPriorityBacklinkTargets
                      }
                    />
                  </div>
                )}
                {record.link_building_strategy
                  .brokenLinkBuildingOpportunities && (
                  <div className="space-y-2">
                    <FieldLabel>Broken Link Opportunities</FieldLabel>
                    <List
                      items={
                        record.link_building_strategy
                          .brokenLinkBuildingOpportunities
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <TextBlock>No link building strategy.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="Integrated Action Plan (90 Days)">
            {record.integrated_action_plan?.roadmap90Days ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.integrated_action_plan.roadmap90Days.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Tag>{item.week}</Tag>
                      </div>
                      <TasksList tasks={item.tasks} />
                      {item.dependencies && (
                        <>
                          <FieldLabel>Dependencies</FieldLabel>
                          <TextBlock>{item.dependencies}</TextBlock>
                        </>
                      )}
                      {item.expectedOutcomes && (
                        <>
                          <FieldLabel>Expected Outcomes</FieldLabel>
                          <TextBlock>{item.expectedOutcomes}</TextBlock>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No action plan.</TextBlock>
            )}
          </SectionCard>

          <SectionCard title="KPI Tracking">
            {record.kpi_tracking ? (
              <KeyValueTable data={record.kpi_tracking} />
            ) : (
              <TextBlock>No KPI tracking set.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Budget Allocation">
            {record.budget_allocation ? (
              <div className="space-y-3">
                {record.budget_allocation.roiExpectations && (
                  <>
                    <FieldLabel>ROI Expectations</FieldLabel>
                    <TextBlock>
                      {record.budget_allocation.roiExpectations}
                    </TextBlock>
                  </>
                )}
                {record.budget_allocation.estimatedBudget6Months && (
                  <>
                    <FieldLabel>Estimated Budget (6 Months)</FieldLabel>
                    <KeyValueTable
                      data={record.budget_allocation.estimatedBudget6Months}
                    />
                  </>
                )}
              </div>
            ) : (
              <TextBlock>No budget details.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    case "off_page_seo_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Summary">
            {record.summary ? (
              <KeyValueGrid data={record.summary} />
            ) : (
              <TextBlock>No summary.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Link Building Opportunities">
            {record.link_building_opportunities ? (
              <div className="space-y-2">
                {record.link_building_opportunities.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="font-semibold text-sm">
                        {item.description}
                      </p>
                      <TextBlock>Priority: {item.priority}</TextBlock>
                      <TextBlock>Type: {item.opportunityType}</TextBlock>
                      <TextBlock>
                        Recommended: {item.recommendedAction}
                      </TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No link opportunities.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Broken Link Building">
            {record.broken_link_building ? (
              <div className="space-y-2">
                {record.broken_link_building.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">
                      {item.exampleSource}
                    </p>
                    <TextBlock>Target Type: {item.targetType}</TextBlock>
                    <TextBlock>
                      Replacement: {item.replacementContent}
                    </TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No broken link items.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Guest Posting Targets">
            {record.guest_posting_targets ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.guest_posting_targets.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.niche}</p>
                    <TextBlock>Type: {item.websiteType}</TextBlock>
                    <TextBlock>Angle: {item.outreachAngle}</TextBlock>
                    <TextBlock>Authority: {item.authorityLevel}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No guest posting targets.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Strategy & Signals">
            {record.backlink_strategy ? (
              <KeyValueGrid data={record.backlink_strategy} />
            ) : (
              <TextBlock>No backlink strategy.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Social & PR">
            {record.social_and_pr ? (
              <KeyValueGrid data={record.social_and_pr} />
            ) : (
              <TextBlock>No social/PR data.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Influencer Outreach">
            {record.influencer_outreach ? (
              <div className="grid md:grid-cols-2 gap-3">
                {record.influencer_outreach.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.platform}</p>
                    <TextBlock>Type: {item.influencerType}</TextBlock>
                    <TextBlock>Purpose: {item.outreachPurpose}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No influencer outreach.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Citations & Directories">
            {record.citations_and_directories ? (
              <KeyValueGrid data={record.citations_and_directories} />
            ) : (
              <TextBlock>No citations listed.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    case "on_page_seo_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Summary">
            {record.summary ? (
              <div className="space-y-2">
                {record.summary.quickWins && (
                  <>
                    <FieldLabel>Quick Wins</FieldLabel>
                    <List items={record.summary.quickWins} />
                  </>
                )}
                {record.summary.topIssues && (
                  <>
                    <FieldLabel>Top Issues</FieldLabel>
                    <List items={record.summary.topIssues} />
                  </>
                )}
                {record.summary.overallHealth && (
                  <TextBlock>Health: {record.summary.overallHealth}</TextBlock>
                )}
              </div>
            ) : (
              <TextBlock>No summary.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Technical Issues">
            {record.technical_issues ? (
              <div className="space-y-2">
                {record.technical_issues.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.issue}</p>
                    <TextBlock>Impact: {item.impact}</TextBlock>
                    <TextBlock>{item.evidence}</TextBlock>
                    <TextBlock>Recommendation: {item.recommendation}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No technical issues.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Content Issues">
            {record.content_issues ? (
              <div className="space-y-2">
                {record.content_issues.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.issue}</p>
                    <TextBlock>Impact: {item.impact}</TextBlock>
                    {item.affectedPages && <List items={item.affectedPages} />}
                    <TextBlock>Recommendation: {item.recommendation}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No content issues.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Internal Linking Issues">
            {record.internal_linking_issues ? (
              <div className="space-y-2">
                {record.internal_linking_issues.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <TextBlock>{item.issue}</TextBlock>
                      {item.affectedPages && (
                        <List items={item.affectedPages} />
                      )}
                      <TextBlock>
                        Recommendation: {item.recommendation}
                      </TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No internal linking issues.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Performance Issues">
            {record.performance_issues ? (
              <div className="space-y-2">
                {record.performance_issues.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.issue}</p>
                    <TextBlock>Impact: {item.impact}</TextBlock>
                    <TextBlock>Metric: {item.metric}</TextBlock>
                    <TextBlock>Recommendation: {item.recommendation}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No performance issues.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Schema Issues">
            {record.schema_issues ? (
              <div className="space-y-2">
                {record.schema_issues.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.issue}</p>
                    <TextBlock>Impact: {item.impact}</TextBlock>
                    <TextBlock>Affected: {item.affectedSchema}</TextBlock>
                    <TextBlock>Recommendation: {item.recommendation}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No schema issues.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    case "seo_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Domain Analysis">
            {record.domain_analysis ? (
              <KeyValueGrid data={record.domain_analysis} />
            ) : (
              <TextBlock>No domain analysis.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Backlink Strategy">
            {record.backlink_strategy ? (
              <KeyValueGrid data={record.backlink_strategy} />
            ) : (
              <TextBlock>No backlink strategy.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Broken Links">
            {record.broken_links ? (
              <div className="space-y-2">
                {record.broken_links.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.pageURL}</p>
                    <TextBlock>{item.anchorContext}</TextBlock>
                    <TextBlock>
                      Why replacement: {item.whyGoodReplacement}
                    </TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No broken links data.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Digital PR">
            {record.digital_pr ? (
              <div className="space-y-2">
                {record.digital_pr.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.strategy}</p>
                    <TextBlock>{item.exampleAnglePitch}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No PR plan.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Content Syndication">
            {record.content_syndication ? (
              <div className="space-y-2">
                {record.content_syndication.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <p className="font-semibold text-sm">{item.idea}</p>
                    <TextBlock>{item.details}</TextBlock>
                    <TextBlock>Platforms: {item.platforms}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No content syndication.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Outreach Plan">
            {record.outreach_plan ? (
              <div className="space-y-4">
                {record.outreach_plan.emailTemplates && (
                  <div className="space-y-3">
                    <FieldLabel>Email Templates</FieldLabel>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(record.outreach_plan.emailTemplates).map(
                        ([key, tpl]: [string, any]) => (
                          <div
                            key={key}
                            className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2"
                          >
                            <p className="font-semibold text-sm">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            {tpl.subject && (
                              <>
                                <FieldLabel>Subject</FieldLabel>
                                <TextBlock>{tpl.subject}</TextBlock>
                              </>
                            )}
                            {tpl.body && (
                              <>
                                <FieldLabel>Body</FieldLabel>
                                <TextBlock>{tpl.body}</TextBlock>
                              </>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {record.outreach_plan.stepByStepStrategy && (
                  <div className="space-y-2">
                    <FieldLabel>Step-by-step Strategy</FieldLabel>
                    <List items={record.outreach_plan.stepByStepStrategy} />
                  </div>
                )}
              </div>
            ) : (
              <TextBlock>No outreach plan.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Action Plan">
            {record.action_plan ? (
              <div className="space-y-2">
                {record.action_plan.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <TextBlock>{item.task}</TextBlock>
                    <TextBlock>Priority: {item.priority}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No action plan.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Risk & Quality">
            {record.risk_quality ? (
              <div className="space-y-2">
                {record.risk_quality.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                  >
                    <TextBlock>{item.whatToAvoid}</TextBlock>
                    <TextBlock>Minimum: {item.minimumCriteria}</TextBlock>
                  </div>
                ))}
              </div>
            ) : (
              <TextBlock>No risk guidance.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Budget & ROI">
            {record.budget_roi ? (
              <KeyValueGrid data={record.budget_roi} />
            ) : (
              <TextBlock>No budget/ROI data.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    case "seo_keyword_agent_outputs":
      return (
        <div className="space-y-4">
          <SectionCard title="Input Keywords">
            {record.input_keywords ? (
              <List items={record.input_keywords} />
            ) : (
              <TextBlock>No input keywords.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Keyword Recommendations">
            {record.keyword_recommendations?.localKeywords ? (
              <div className="space-y-2">
                {record.keyword_recommendations.localKeywords.map(
                  (kw: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="font-semibold text-sm">{kw.keyword}</p>
                      <TextBlock>Priority: {kw.priority}</TextBlock>
                      <TextBlock>Intent: {kw.searchIntent}</TextBlock>
                      <TextBlock>Volume: {kw.monthlySearches}</TextBlock>
                      <TextBlock>
                        Recommended Action: {kw.recommendedAction}
                      </TextBlock>
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No keyword recommendations.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Strategic Insights">
            {record.strategic_insights ? (
              <div className="space-y-3">
                {record.strategic_insights.quickWins && (
                  <>
                    <FieldLabel>Quick Wins</FieldLabel>
                    <List items={record.strategic_insights.quickWins} />
                  </>
                )}
                {record.strategic_insights.contentGaps && (
                  <>
                    <FieldLabel>Content Gaps</FieldLabel>
                    <List items={record.strategic_insights.contentGaps} />
                  </>
                )}
                {record.strategic_insights.longTermTargets && (
                  <>
                    <FieldLabel>Long-Term Targets</FieldLabel>
                    <List items={record.strategic_insights.longTermTargets} />
                  </>
                )}
                {record.strategic_insights.topOpportunities && (
                  <>
                    <FieldLabel>Top Opportunities</FieldLabel>
                    <List items={record.strategic_insights.topOpportunities} />
                  </>
                )}
              </div>
            ) : (
              <TextBlock>No strategic insights.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Content Recommendations">
            {record.content_recommendations ? (
              <div className="space-y-2">
                {record.content_recommendations.map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-1"
                    >
                      <p className="font-semibold text-sm">
                        {item.suggestedTitle}
                      </p>
                      <TextBlock>Type: {item.contentType}</TextBlock>
                      <TextBlock>Priority: {item.priority}</TextBlock>
                      {item.targetKeywords && (
                        <List items={item.targetKeywords} />
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <TextBlock>No content recommendations.</TextBlock>
            )}
          </SectionCard>
          <SectionCard title="Competitive Analysis">
            {record.competitive_analysis ? (
              <KeyValueGrid data={record.competitive_analysis} />
            ) : (
              <TextBlock>No competitive analysis.</TextBlock>
            )}
          </SectionCard>
        </div>
      );
    default:
      return <TextBlock>Section not recognized.</TextBlock>;
  }
}

function SectionRenderer({
  section,
  records,
  isLoading,
}: {
  section: Section;
  records: SmartSeoRecord[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-border/70">
        <CardContent className="pt-6 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Card className="border-border/70">
        <CardContent className="pt-6">
          <TextBlock>
            No data found for this section for the selected agent.
          </TextBlock>
        </CardContent>
      </Card>
    );
  }

  // If only one record, render inline; otherwise use accordion per record (by created date)
  if (records.length === 1) {
    return renderSectionContent(section.key, records[0]);
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={records[0].id}
      className="space-y-3"
    >
      {records.map((record) => (
        <AccordionItem
          key={record.id}
          value={record.id}
          className="border border-border/60 rounded-lg px-3"
        >
          <AccordionTrigger className="text-left">
            <div className="flex flex-col items-start gap-1">
              <p className="text-sm font-semibold">
                {record.website} • {formatDate(record.created_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                {section.title} entry
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            {renderSectionContent(section.key, record)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const parsed = parseAgentSlug(params?.agent);

  const { data, isLoading } = useQuery<SmartSeoData>({
    queryKey: ["smart-seo-data"],
    queryFn: async () => {
      try {
        return await fetchSmartSeoData();
      } catch (error: any) {
        toast.error(error.message || "Unable to load Smart SEO data");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(parsed),
  });

  const agentRecords = useMemo(() => {
    if (!data || !parsed) return [];
    return Object.values(data).flatMap((records) =>
      records.filter((r) => r.agent_name === parsed.agent_name)
    );
  }, [data, parsed]);

  const websites = useMemo(() => {
    const set = new Set<string>();
    agentRecords.forEach((r) => set.add(r.website));
    return Array.from(set);
  }, [agentRecords]);

  const recordsByWebsiteAndSection = useMemo(() => {
    const result: Record<
      string,
      Record<SmartSeoTableKey, SmartSeoRecord[]>
    > = {};
    if (!data || !parsed) return result;

    Object.entries(data).forEach(([key, records]) => {
      records
        .filter((r) => r.agent_name === parsed.agent_name)
        .forEach((r) => {
          const websiteKey = r.website;
          if (!result[websiteKey]) {
            result[websiteKey] = {} as Record<
              SmartSeoTableKey,
              SmartSeoRecord[]
            >;
          }
          if (!result[websiteKey][key as SmartSeoTableKey]) {
            result[websiteKey][key as SmartSeoTableKey] = [];
          }
          result[websiteKey][key as SmartSeoTableKey].push(r);
        });
    });

    // sort by created_at desc per bucket
    Object.values(result).forEach((sectionMap) => {
      Object.entries(sectionMap).forEach(([k, recs]) => {
        sectionMap[k as SmartSeoTableKey] = recs.sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });
      });
    });

    return result;
  }, [data, parsed]);

  if (!parsed) {
    return (
      <DashboardLayout title="Smart SEO">
        <DashboardCard>
          <p className="text-sm text-muted-foreground">Invalid agent URL.</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/dashboard/agents")}
          >
            Back to agents
          </Button>
        </DashboardCard>
      </DashboardLayout>
    );
  }

  const totalRecords = agentRecords.length;

  return (
    <DashboardLayout title="Smart SEO">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Agent
                  </p>
                  <CardTitle className="text-2xl text-foreground">
                    {formatAgentName(parsed.agent_name)}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {formatAgentName(parsed.agent_name)}
                  </Badge>
                  <Badge variant="outline">Websites: {websites.length}</Badge>
                  <Badge variant="outline">Records: {totalRecords}</Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/agents")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="h-[calc(100vh-280px)] pr-2">
          <div className="space-y-4">
            {websites.length === 0 && !isLoading && (
              <Card className="border-border/70">
                <CardContent className="pt-6">
                  <TextBlock>No data found for this agent.</TextBlock>
                </CardContent>
              </Card>
            )}

            <Accordion
              type="single"
              collapsible
              defaultValue={websites[0]}
              className="space-y-3"
            >
              {websites.map((website) => {
                const sectionsWithData = sections.filter(
                  (section) =>
                    (recordsByWebsiteAndSection?.[website]?.[section.key] || [])
                      .length > 0
                );
                return (
                  <AccordionItem
                    key={website}
                    value={website}
                    className="border border-border/60 rounded-lg px-3"
                  >
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-semibold break-all">
                          {website}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sectionsWithData.length} sections •{" "}
                          {(recordsByWebsiteAndSection?.[website] &&
                            Object.values(
                              recordsByWebsiteAndSection[website]
                            ).reduce((sum, recs) => sum + recs.length, 0)) ||
                            0}{" "}
                          entries
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 pb-4">
                      <div className="space-y-4">
                        {sectionsWithData.length === 0 && (
                          <TextBlock>No data for this website.</TextBlock>
                        )}
                        {sectionsWithData.map((section) => (
                          <div key={section.key} className="space-y-2">
                            <div
                              className={`flex items-center justify-between border-l-4 pl-3 rounded-lg p-2 ${
                                sectionAccent[section.key] ||
                                "border-primary/70"
                              }`}
                            >
                              <div>
                                <p className="text-lg font-semibold text-foreground">
                                  {section.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {section.description}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {
                                  (
                                    recordsByWebsiteAndSection?.[website]?.[
                                      section.key
                                    ] || []
                                  ).length
                                }{" "}
                                entries
                              </Badge>
                            </div>
                            <SectionRenderer
                              section={section}
                              records={
                                recordsByWebsiteAndSection?.[website]?.[
                                  section.key
                                ] || []
                              }
                              isLoading={isLoading}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
}
