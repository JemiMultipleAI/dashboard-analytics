'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { fetchSheetsData } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileSpreadsheet, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function SheetsDashboard() {
  const [activeTab, setActiveTab] = useState('column1');
  const [tabs, setTabs] = useState<string[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);

  const handleLoadSheet = async (sheetIdOrUrl: string) => {
    if (!sheetIdOrUrl.trim()) {
      toast.error('Please enter a Google Sheet ID');
      return;
    }

    setLoading(true);
    try {
      // Extract sheet ID from URL if full URL is provided
      let extractedSheetId = sheetIdOrUrl;
      if (sheetIdOrUrl.includes('/spreadsheets/d/')) {
        const match = sheetIdOrUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          extractedSheetId = match[1];
        }
      }

      const data = await fetchSheetsData(extractedSheetId);
      console.log("sheet data", data);
      
      if (data.tabs && data.tabs.length > 0) {
        setTabs(data.tabs);
        setContent(data.content || {});
        setActiveTab('column1'); // Set first tab as active
        setIsLoaded(true);
        localStorage.setItem('google_sheet_id', extractedSheetId);
        toast.success('Sheet loaded successfully');
      } else {
        toast.error('No data found in sheet. Please ensure the sheet has 2 rows with 6 columns.');
      }
    } catch (error: any) {
      console.error('Error loading sheet:', error);
      toast.error(error.message || 'Failed to load sheet');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerWebhook = async () => {
    setIsWebhookLoading(true);
    try {
      // Wait 7 seconds, then automatically load the sheet
      setTimeout(async () => {
        try {
          const sheetUrl = 'https://docs.google.com/spreadsheets/d/11Ar45A5gR_EdZ9zjJJyMNPo6EVHJmQX-ErjsDX-_BLQ/edit?gid=0#gid=0';
          await handleLoadSheet(sheetUrl);
        } catch (error) {
          console.error('Error loading sheet:', error);
        } finally {
          setIsWebhookLoading(false);
        }
      }, 7000);
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast.error('Error triggering webhook');
      setIsWebhookLoading(false);
    }
  };

  const renderTabContent = (columnKey: string) => {
    const contentValue = content[columnKey] || '';
    
    if (!contentValue.trim()) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No content available
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:bg-secondary/50 transition-colors">
          <span className="text-sm text-foreground whitespace-pre-wrap break-words">
            {contentValue}
          </span>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Smart SEO">
      <div className="space-y-6">
        {/* Webhook Trigger Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">SEO Magic</h2>
              <p className="text-sm text-muted-foreground">Initiate the magic</p>
            </div>
          </div>
          <Button
            onClick={handleTriggerWebhook}
            disabled={isWebhookLoading}
            className="gradient-primary text-primary-foreground hover:opacity-90"
          >
            {isWebhookLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Initiate
              </>
            )}
          </Button>
        </div>


        {/* Tabs with Column Data */}
        {isLoaded && tabs.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex">
                {/* Left Side Tabs */}
                <TabsList className="flex flex-col h-auto w-48 bg-secondary/50 border-r border-border rounded-none rounded-l-lg p-2 space-y-1">
                  {tabs.map((tabTitle, index) => {
                    const columnKey = `column${index + 1}`;
                    return (
                      <TabsTrigger
                        key={columnKey}
                        value={columnKey}
                        className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {tabTitle}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Content Area */}
                <div className="flex-1">
                  {tabs.map((_, index) => {
                    const columnKey = `column${index + 1}`;
                    return (
                      <TabsContent key={columnKey} value={columnKey} className="mt-0 h-full">
                        <ScrollArea className="h-[calc(100vh-300px)]">
                          {renderTabContent(columnKey)}
                        </ScrollArea>
                      </TabsContent>
                    );
                  })}
                </div>
              </div>
            </Tabs>
          </div>
        )}

        {!isLoaded && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Sheet Loaded</h3>
            <p className="text-muted-foreground">
              Enter a Google Sheet ID or URL above and click "Load Sheet" to view columns
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


