import { supabase } from "./supabaseClient";

export type SmartSeoTableKey =
  | "backlink_blog_agent_outputs"
  | "content_writer_agent_outputs"
  | "final_seo_recommendations_agent_outputs"
  | "final_website_content_agent_outputs"
  | "keyword_strategy_agent_outputs"
  | "off_page_seo_agent_outputs"
  | "on_page_seo_agent_outputs"
  | "seo_agent_outputs"
  | "seo_keyword_agent_outputs";

export type SmartSeoRecord = {
  id: string;
  agent_name: string;
  website: string;
  created_at: string | null;
  [key: string]: any;
};

export type SmartSeoData = Record<SmartSeoTableKey, SmartSeoRecord[]>;

const tables: SmartSeoTableKey[] = [
  "backlink_blog_agent_outputs",
  "content_writer_agent_outputs",
  "final_seo_recommendations_agent_outputs",
  "final_website_content_agent_outputs",
  "keyword_strategy_agent_outputs",
  "off_page_seo_agent_outputs",
  "on_page_seo_agent_outputs",
  "seo_agent_outputs",
  "seo_keyword_agent_outputs",
];

export async function fetchSmartSeoData(): Promise<SmartSeoData> {
  const results = await Promise.all(
    tables.map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to load ${table}: ${error.message}`);
      }

      return [table, data ?? []] as const;
    })
  );

  return Object.fromEntries(results) as SmartSeoData;
}
