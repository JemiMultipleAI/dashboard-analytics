"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetGrid } from "@/components/dashboard/WidgetGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchSmartSeoData,
  SmartSeoData,
  SmartSeoRecord,
} from "@/lib/smartSeo";
import { ArrowRight, Filter, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

type AgentSummary = {
  agent_name: string;
  website: string;
  totalRecords: number;
  tables: string[];
};

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
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugifyAgent(agent_name: string, website: string) {
  return `${encodeURIComponent(agent_name)}__${encodeURIComponent(website)}`;
}

function buildAgents(data?: SmartSeoData): AgentSummary[] {
  if (!data) return [];
  const map = new Map<string, AgentSummary>();

  Object.entries(data).forEach(([table, records]) => {
    records.forEach((record: SmartSeoRecord) => {
      const key = `${record.agent_name}::${record.website}`;
      if (!map.has(key)) {
        map.set(key, {
          agent_name: record.agent_name,
          website: record.website,
          totalRecords: 0,
          tables: [],
        });
      }
      const current = map.get(key)!;
      current.totalRecords += 1;
      if (!current.tables.includes(table)) current.tables.push(table);
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.agent_name.localeCompare(b.agent_name)
  );
}

function AgentSkeletons() {
  return (
    <WidgetGrid>
      {Array.from({ length: 6 }).map((_, idx) => (
        <DashboardCard key={idx} className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
        </DashboardCard>
      ))}
    </WidgetGrid>
  );
}

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");
  const [workflowUrl, setWorkflowUrl] = useState("");
  const [workflowLoading, setWorkflowLoading] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<SmartSeoData>({
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
  });

  const agents = useMemo(() => {
    const list = buildAgents(data);
    const q = search.toLowerCase().trim();
    const w = websiteFilter.toLowerCase().trim();
    return list.filter(
      (agent) =>
        (!q || agent.agent_name.toLowerCase().includes(q)) &&
        (!w || agent.website.toLowerCase().includes(w))
    );
  }, [data, search, websiteFilter]);

  const handleInitiateWorkflow = async () => {
    const targetUrl = process.env.NEXT_PUBLIC_N8N_FULL_SEO_URL;
    if (!workflowUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }
    if (!targetUrl) {
      toast.error("Missing NEXT_PUBLIC_N8N_FULL_SEO_URL configuration.");
      return;
    }
    try {
      setWorkflowLoading(true);
      const resp = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: workflowUrl.trim() }),
      });
      if (!resp.ok) {
        let errText = "";
        try {
          errText = await resp.text();
        } catch (e) {
          // ignore
        }
        throw new Error(errText || `HTTP ${resp.status}`);
      }
      toast.success("Workflow initiated successfully.");
      setWorkflowUrl("");
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to initiate workflow. Check CORS, network, or URL."
      );
    } finally {
      setWorkflowLoading(false);
    }
  };

  return (
    <DashboardLayout title="Smart SEO Agents">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Agents Directory</CardTitle>
            <CardDescription>
              Browse all SEO agent outputs grouped by agent and website. Click a
              card to view the fully structured report.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by agent name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by website..."
                  value={websiteFilter}
                  onChange={(e) => setWebsiteFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-secondary/40 rounded-lg border border-border/60 p-3">
                <p className="text-sm font-semibold">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Initiate Full SEO Workflow</CardTitle>
            <CardDescription>
              Trigger the n8n workflow for a specific website URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 flex flex-col gap-2">
              <Input
                placeholder="https://example.com"
                value={workflowUrl}
                onChange={(e) => setWorkflowUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Button
                className="w-full"
                onClick={handleInitiateWorkflow}
                disabled={workflowLoading}
              >
                {workflowLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Initiate Workflow
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <AgentSkeletons />
        ) : agents.length === 0 ? (
          <DashboardCard>
            <p className="text-sm text-muted-foreground">
              No agents found. Adjust your filters or add data in Supabase.
            </p>
          </DashboardCard>
        ) : (
          <WidgetGrid>
            {agents.map((agent) => (
              <DashboardCard
                key={`${agent.agent_name}-${agent.website}`}
                className="flex flex-col gap-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {formatAgentName(agent.agent_name)}
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {agent.website}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {agent.totalRecords} records
                  </Badge>
                  <Badge variant="outline">{agent.tables.length} tables</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.tables.map((table) => (
                    <Badge
                      key={table}
                      variant="outline"
                      className="text-[11px]"
                    >
                      {table.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/dashboard/agents/${slugifyAgent(
                    agent.agent_name,
                    agent.website
                  )}`}
                  className="mt-auto"
                >
                  <Button className="w-full justify-between">
                    View report
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </DashboardCard>
            ))}
          </WidgetGrid>
        )}
      </div>
    </DashboardLayout>
  );
}
// "use client";

// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { DashboardCard } from "@/components/dashboard/DashboardCard";
// import { WidgetGrid } from "@/components/dashboard/WidgetGrid";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   fetchSmartSeoData,
//   SmartSeoData,
//   SmartSeoRecord,
//   SmartSeoTableKey,
// } from "@/lib/smartSeo";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { RefreshCw, Search, Filter, Loader2 } from "lucide-react";

// type Section = {
//   key: SmartSeoTableKey;
//   title: string;
//   description: string;
// };

// const sections: Section[] = [
//   {
//     key: "keyword_strategy_agent_outputs",
//     title: "Keyword Strategy",
//     description: "Executive strategy, keyword clusters, and KPIs.",
//   },
//   {
//     key: "seo_keyword_agent_outputs",
//     title: "Keyword Recommendations",
//     description: "Input keywords, recommendations, and competitive insights.",
//   },
//   {
//     key: "content_writer_agent_outputs",
//     title: "Content Writer",
//     description: "Pages, blog strategy, FAQs, and schema.",
//   },
//   {
//     key: "final_website_content_agent_outputs",
//     title: "Final Website Content",
//     description: "Homepage, services, blog ideas, and FAQs.",
//   },
//   {
//     key: "final_seo_recommendations_agent_outputs",
//     title: "Final SEO Recommendations",
//     description: "Technical, content, off-page, social, and roadmap.",
//   },
//   {
//     key: "backlink_blog_agent_outputs",
//     title: "Backlink Blog Ideation",
//     description: "Target domains and backlink blog outlines.",
//   },
//   {
//     key: "off_page_seo_agent_outputs",
//     title: "Off-Page SEO",
//     description: "Link building, guest posting, PR, and citations.",
//   },
//   {
//     key: "on_page_seo_agent_outputs",
//     title: "On-Page SEO",
//     description: "Technical, content, internal linking, and performance.",
//   },
//   {
//     key: "seo_agent_outputs",
//     title: "SEO Agent Summary",
//     description: "Domain analysis, backlink strategy, outreach, and ROI.",
//   },
// ];

// const fieldLabels: Partial<Record<SmartSeoTableKey, string[]>> = {
//   backlink_blog_agent_outputs: ["selected_domains", "backlink_blog_ideas"],
//   content_writer_agent_outputs: ["pages", "blog_strategy", "faq", "faq_schema"],
//   final_seo_recommendations_agent_outputs: [
//     "technical_seo_recommendations",
//     "content_recommendations",
//     "off_page_action_plan",
//     "social_media_recommendations",
//     "growth_roadmap_30days",
//   ],
//   final_website_content_agent_outputs: [
//     "homepage",
//     "about_page",
//     "services_page",
//     "contact_page",
//     "blog_ideas",
//     "faq",
//     "faq_schema",
//   ],
//   keyword_strategy_agent_outputs: [
//     "executive_summary",
//     "keyword_strategy",
//     "content_strategy",
//     "technical_seo",
//     "link_building_strategy",
//     "integrated_action_plan",
//     "kpi_tracking",
//     "budget_allocation",
//   ],
//   off_page_seo_agent_outputs: [
//     "summary",
//     "link_building_opportunities",
//     "broken_link_building",
//     "guest_posting_targets",
//     "backlink_strategy",
//     "social_and_pr",
//     "influencer_outreach",
//     "citations_and_directories",
//   ],
//   on_page_seo_agent_outputs: [
//     "summary",
//     "technical_issues",
//     "content_issues",
//     "internal_linking_issues",
//     "performance_issues",
//     "schema_issues",
//     "metadata",
//   ],
//   seo_agent_outputs: [
//     "domain_analysis",
//     "backlink_strategy",
//     "broken_links",
//     "digital_pr",
//     "content_syndication",
//     "outreach_plan",
//     "action_plan",
//     "risk_quality",
//     "budget_roi",
//   ],
//   seo_keyword_agent_outputs: [
//     "input_keywords",
//     "keyword_recommendations",
//     "strategic_insights",
//     "content_recommendations",
//     "competitive_analysis",
//     "_metadata",
//   ],
// };

// function formatDate(value?: string | null) {
//   if (!value) return "—";
//   try {
//     const date = new Date(value);
//     return date.toLocaleString();
//   } catch {
//     return value;
//   }
// }

// function prettifyLabel(label: string) {
//   return label
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// }

// function JsonBlock({ label, value }: { label: string; value: unknown }) {
//   if (!value) return null;
//   return (
//     <div className="space-y-2">
//       <p className="text-xs font-semibold text-muted-foreground">{label}</p>
//       <ScrollArea className="max-h-80 rounded-lg border border-border/50 bg-secondary/40">
//         <pre className="p-3 text-xs whitespace-pre-wrap break-words text-foreground/90">
//           {JSON.stringify(value, null, 2)}
//         </pre>
//       </ScrollArea>
//     </div>
//   );
// }

// function RecordCard({
//   record,
//   tableKey,
// }: {
//   record: SmartSeoRecord;
//   tableKey: SmartSeoTableKey;
// }) {
//   const fields = fieldLabels[tableKey] || [];

//   return (
//     <DashboardCard
//       title={record.website}
//       subtitle={`${record.agent_name} • ${formatDate(record.created_at)}`}
//       className="h-full flex flex-col gap-4"
//     >
//       <div className="flex flex-wrap gap-2 text-xs">
//         <Badge variant="secondary">{record.agent_name}</Badge>
//         <Badge variant="outline">Website</Badge>
//       </div>
//       <div className="space-y-4">
//         {fields.map((field) => (
//           <JsonBlock
//             key={field}
//             label={prettifyLabel(field)}
//             value={record[field]}
//           />
//         ))}
//         {fields.length === 0 && (
//           <p className="text-sm text-muted-foreground">
//             No structured fields available for this record.
//           </p>
//         )}
//       </div>
//     </DashboardCard>
//   );
// }

// function LoadingGrid() {
//   return (
//     <WidgetGrid>
//       {Array.from({ length: 6 }).map((_, idx) => (
//         <DashboardCard key={idx} className="space-y-4">
//           <Skeleton className="h-4 w-2/3" />
//           <Skeleton className="h-3 w-1/2" />
//           <Skeleton className="h-32 w-full" />
//         </DashboardCard>
//       ))}
//     </WidgetGrid>
//   );
// }

// export default function SmartSeoDashboard() {
//   const [search, setSearch] = useState("");
//   const [agentFilter, setAgentFilter] = useState("");
//   const [activeSection, setActiveSection] = useState<SmartSeoTableKey>(
//     sections[0].key
//   );

//   const { data, isLoading, isFetching, refetch } = useQuery<SmartSeoData>({
//     queryKey: ["smart-seo-data"],
//     queryFn: async () => {
//       try {
//         return await fetchSmartSeoData();
//       } catch (error: any) {
//         toast.error(error.message || "Unable to load Smart SEO data");
//         throw error;
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   const filteredData = useMemo(() => {
//     if (!data) return {} as SmartSeoData;
//     const searchTerm = search.toLowerCase().trim();
//     const agentTerm = agentFilter.toLowerCase().trim();

//     return Object.entries(data).reduce((acc, [key, records]) => {
//       acc[key as SmartSeoTableKey] = records.filter((record) => {
//         const matchesSearch =
//           !searchTerm ||
//           record.website?.toLowerCase().includes(searchTerm) ||
//           record.agent_name?.toLowerCase().includes(searchTerm);
//         const matchesAgent =
//           !agentTerm || record.agent_name?.toLowerCase().includes(agentTerm);
//         return matchesSearch && matchesAgent;
//       });
//       return acc;
//     }, {} as SmartSeoData);
//   }, [agentFilter, data, search]);

//   const agentOptions = useMemo(() => {
//     if (!data) return [];
//     const set = new Set<string>();
//     Object.values(data).forEach((records) => {
//       records.forEach((record) => set.add(record.agent_name));
//     });
//     return Array.from(set).sort();
//   }, [data]);

//   const totalRecords = useMemo(() => {
//     if (!data) return 0;
//     return Object.values(data).reduce(
//       (sum, records) => sum + records.length,
//       0
//     );
//   }, [data]);

//   return (
//     <DashboardLayout title="Smart SEO">
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <Card className="lg:col-span-2">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-xl">Supabase Connected</CardTitle>
//               <CardDescription>
//                 Live Smart SEO data pulled directly from your Supabase tables
//                 with search and agent filtering.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div className="col-span-2 space-y-3">
//                 <div className="flex items-center gap-2">
//                   <Search className="h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by website or agent..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Filter className="h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Filter by agent (e.g., content_writer_agent)"
//                     value={agentFilter}
//                     onChange={(e) => setAgentFilter(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <div className="bg-secondary/40 rounded-lg border border-border/60 p-3">
//                   <p className="text-sm font-semibold">Total Records</p>
//                   <p className="text-2xl font-bold">{totalRecords}</p>
//                 </div>
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => refetch()}
//                   disabled={isFetching}
//                 >
//                   {isFetching ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   ) : (
//                     <RefreshCw className="mr-2 h-4 w-4" />
//                   )}
//                   Refresh
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">Agent Names</CardTitle>
//               <CardDescription>
//                 Quick view of agents available across tables.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-wrap gap-2">
//               {agentOptions.length === 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   No agents found yet.
//                 </p>
//               )}
//               {agentOptions.map((name) => (
//                 <Badge
//                   key={name}
//                   variant="secondary"
//                   className="font-mono text-xs"
//                 >
//                   {name}
//                 </Badge>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Smart SEO Data</CardTitle>
//             <CardDescription>
//               Navigate each agent’s dataset and view structured JSON outputs.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs
//               value={activeSection}
//               onValueChange={(value) =>
//                 setActiveSection(value as SmartSeoTableKey)
//               }
//             >
//               <ScrollArea className="mb-4 w-full">
//                 <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
//                   {sections.map((section) => (
//                     <TabsTrigger
//                       key={section.key}
//                       value={section.key}
//                       className="text-xs md:text-sm"
//                     >
//                       {section.title}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>
//               </ScrollArea>

//               {sections.map((section) => {
//                 const records = filteredData?.[section.key] ?? [];
//                 return (
//                   <TabsContent
//                     key={section.key}
//                     value={section.key}
//                     className="space-y-4"
//                   >
//                     <p className="text-sm text-muted-foreground">
//                       {section.description}
//                     </p>
//                     {isLoading ? (
//                       <LoadingGrid />
//                     ) : records.length === 0 ? (
//                       <DashboardCard>
//                         <p className="text-sm text-muted-foreground">
//                           No results found for this section with the current
//                           filters.
//                         </p>
//                       </DashboardCard>
//                     ) : (
//                       <WidgetGrid>
//                         {records.map((record) => (
//                           <RecordCard
//                             key={record.id}
//                             record={record}
//                             tableKey={section.key}
//                           />
//                         ))}
//                       </WidgetGrid>
//                     )}
//                   </TabsContent>
//                 );
//               })}
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }
